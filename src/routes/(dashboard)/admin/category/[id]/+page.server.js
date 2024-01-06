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
        }
    }
}

export async function load({ params }) {
    const { action, category } = await checkAction(params.id);

    const categories = (await db.Content.findAll({
        where: {
            type: 'category',
            id: {
                [db.Sequelize.Op.ne]: category?.id ?? 0
            }
        }
    })).map(
        cat => ({ name: cat.title, value: cat.id })
    );

    // Fetch list of users
    const authors = (await db.User.findAll({ order: [[ 'username', 'ASC' ]] })).map(
        user => ({ name: user.username, value: user.id })
    );

    return {
        action, category, authors,
        categories: [ { name: 'Root category', value: 0 }, ...categories ],
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
            parentId: z
                .preprocess((x) => Number(x), z.number().int().nonnegative())
                .transform(x => x == 0 ? null : x),
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
                id: parsed.parentId,
                type: 'category',
            }
        });
        const duplicateSlug = await db.Content.findOne({
            where: {
                slug: parsed.slug,
                id: {
                    [db.Sequelize.Op.ne]: category?.id ?? 0
                }
            }
        });

        // Check that category and parent id are not equal
        if (parsed.parentId && category && parsed.parentId === category.id)
            errors.parentId = [ 'Category cannot be parent to itself' ];
        // Check that valid author is specified
        if (!author)
            errors.authorId = [ 'Invalid author try reloading the page' ];
        // Check that if parent id is specified it is valid
        if (parsed.parentId && !parent)
            errors.parentId = [ 'Invalid parent try reloading the page' ];
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

        // If we are creating new category create it
        if (action === 'create') {
            const highest = await db.Content.findOne({
                order: [[ 'orderField', 'DESC' ]],
                where: {
                    parentId: parsed.parentId,
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