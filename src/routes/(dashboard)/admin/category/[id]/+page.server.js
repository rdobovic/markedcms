import z from 'zod';
import db from '$db';
import { error, fail } from '@sveltejs/kit';

const checkAction = async (param) => {
    const validParam = z
        .preprocess(x => Number(x), z.number().int().nonnegative())
        .or(z.enum([ 'new' ]));

    const result = validParam.safeParse(param);

    if (!result.success)
        throw error(404);

    if (result.data == 'new')
        return { action: 'create', category: null };

    const category = await db.Content.findOne({
        where: {
            id: result.data,
            type: 'category',
        }
    });

    if (!category)
        throw error(404);

    return {
        action: 'update', 
        category: {
            ...category.dataValues,
            hasPage: !!(category.bodyA),
            parentIdString: category.rootCategoryId + '.' + (category.parentId || 0),
        }
    }
}

export async function load({ params }) {
    const { action, category } = await checkAction(params.id);

    // Fetch the list of categories
    const categories = await db.Content.findAll({
        where: {
            type: 'category',
            id: {
                [db.Sequelize.Op.ne]: (category?.id ?? 0)
            }
        }
    });
    // Fetch all root categories
    const rootCategories = await db.RootCategory.findAll({});
    // Combine categories and roots and map them for dropdown list
    const categoryIdStrings = [
        ...rootCategories.map(cat => ({
            name: cat.displayName,
            value: cat.id + '.0',
        })),
        ...categories.map(cat => ({
            name: cat.title,
            value: cat.rootCategoryId + '.' + cat.id,
        })),
    ];

    // Fetch list of users
    const authors = (await db.User.findAll({ order: [[ 'username', 'ASC' ]] })).map(
        user => ({ name: user.username, value: user.id })
    );

    return {
        action, category, authors,
        categoryIdStrings: categoryIdStrings,
    }
}

export const actions = {
    default: async ({ params, request }) => {
        // Check if valid action or category id is specified
        const { action, category } = await checkAction(params.id);
        // Get form data
        const formData = Object.fromEntries(await request.formData());

        const Category = z.object({
            title: z
                .string({ required_error: 'Category title is required' })
                .min(1, { message: 'Category title is required' })
                .max(1023, { message: 'Category title must be less than 1023 characters' })
                .trim(),
            slug: z
                .string({ required_error: 'URL slug is required' })
                .min(1, { message: 'URL slug is required' })
                .max(1023, { message: 'URL slug must be less than 1023 characters' })
                .trim()
                .transform(sl => sl.toLowerCase()),
            hasPage: z
                .string()
                .optional()
                .transform(val => val === 'on'),
            display: z
                .string()
                .optional()
                .transform(val => val === 'on'),
            displayPosts: z
                .string()
                .optional()
                .transform(val => val === 'on'),
            authorId: z
                .preprocess((x) => Number(x), z.number().int().nonnegative()),
            parentIdString: z
                .string()
                .regex(/[0-9]+\.[0-9]+/)
                .transform(cat => ({
                    rootId: Number(cat.split('.')[0]),
                    categoryId: Number(cat.split('.')[1]),
                })),
            bodyA: z
                .string()
                .optional(),
        })
            .refine((data) => 
                !(data.hasPage && data.bodyA.length === 0)
            ,{
                path: [ 'bodyA' ],
                message: 'Page should not be empty when turned on'
            });

        // Variable to store validation result
        let parsed;

        try {
            // Validate form data
            parsed = Category.parse(formData);

        } catch (err) {
            // If ZOD validation failed return errors
            return fail(400, {
                data: formData,
                errors: err.flatten().fieldErrors,
            });
        }

        // Database validation error messages
        const errors = {};

        // Try to fetch data from DB by given ids
        const author = await db.User.findByPk(parsed.authorId);
        const parent = await db.Content.findOne({
            where: {
                id: parsed.parentIdString.categoryId,
                type: 'category',
            }
        });
        // Fetch given root category
        const rootCategory = await db.RootCategory.findByPk(parsed.parentIdString.rootId);
        // Find content with the same slug
        const duplicateSlug = await db.Content.findOne({
            where: {
                slug: parsed.slug,
                id: {
                    [db.Sequelize.Op.ne]: category?.id ?? 0
                }
            }
        });

        // Check if root category exists
        if (!rootCategory)
            errors.parentIdString = [ 'Invalid root category' ];
        // Check that category and parent id are not equal
        if (parsed.parentIdString.categoryId && category && parsed.parentIdString.categoryId === category.id)
            errors.parentIdString = [ 'Category cannot be parent to itself' ];
        // Check that valid author is specified
        if (!author)
            errors.authorId = [ 'Invalid author try reloading the page' ];
        // Check that if parent id is specified it is valid
        if (parsed.parentIdString.categoryId && !parent)
            errors.parentIdString = [ 'Invalid parent try reloading the page' ];
        // Check if parent root and given root match
        if (parent && rootCategory.id !== parent.rootCategoryId)
            errors.parentIdString = [ 'Invalid parent root combination' ];
        // Check that given URL slug is unique
        if (duplicateSlug)
            errors.slug = [ 'URL slug must be unique' ];

        // If any of above errors occured, return them
        if (Object.keys(errors).length > 0)
            return fail(400, {
                data: formData,
                errors: errors,
            });

        // If category has no page set body to null
        if (!parsed.hasPage)
            parsed.bodyA = null;

        parsed.type = 'category';

        parsed.parentId = parent?.id || null;
        parsed.rootCategoryId = rootCategory.id;

        // If we are creating new category create it
        if (action === 'create') {
            const highest = await db.Content.findOne({
                order: [[ 'orderField', 'DESC' ]],
                where: {
                    parentId: parsed.parentId,
                    rootCategoryId: parsed.rootCategoryId,
                }
            });

            parsed.orderField = (highest?.orderField ?? 0) + 1;
            await db.Content.create(parsed);

        // Otherwise update existing category
        } else {
            await db.Content.update(parsed, {
                where: {
                    id: category.id,
                },

                individualHooks: true,
            });
        }
    }
}