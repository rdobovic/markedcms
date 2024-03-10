import db from '$db';
import { z } from 'zod';
import { error, fail } from '@sveltejs/kit';

// Check if new post is beeing created or we are editing existing post
const checkAction = async (param) => {
    const validParam = z
        .preprocess(x => Number(x), z.number().int().nonnegative())
        .or(z.enum([ 'new' ]));

    const result = validParam.safeParse(param);

    if (!result.success)
        throw error(404);

    if (result.data == 'new')
        return { action: 'create', post: null };

    const post = await db.Content.findOne({
        where: {
            id: result.data,
            type: 'post'
        }
    });

    if (!post)
        throw error(404);

    return {
        action: 'update', post: post.dataValues
    };
}

export async function load({ params }) {
    const { action, post } = await checkAction(params.id);

    // Check if post has children
    if (post) {
        post.hasChildren = 
            !!(await db.Content.findOne({ where: { parentId: post.id } }));

        if (post.parentType === 'category') {
            post.categoryId = post.parentId;
            post.parentId = null;
        }
    }

    // Fetch list of posts
    const posts = (await db.Content.findAll({
        where: {
            type: 'post',
            [db.Sequelize.Op.or]: [
                { parentId: null },
                { parentType: 'category' },
            ],
            id: {
                [db.Sequelize.Op.ne]: post?.id ?? 0,
            },
        }
    })).map(
        post => ({ name: post.title, value: post.id })
    );
    // Fetch list of categories
    const categories = (await db.Content.findAll({
        where: {
            type: 'category',
        }
    })).map(
        category => ({ name: category.title, value: category.id })
    );
    // Fetch list of users
    const authors = (await db.User.findAll({ order: [[ 'username', 'ASC' ]] })).map(
        user => ({ name: user.username, value: user.id })
    );

    return {
        action, post,
        posts: [ { name: 'No parent', value: 0 }, ...posts ],
        categories: [ { name: 'Root category', value: 0 }, ...categories ],
        authors: authors,
    }
}

export const actions = {
    default: async ({ params, request }) => {

        // Check if valid action or post id is specified
        const { action, post } = await checkAction(params.id);
        // Get form data
        const formData = Object.fromEntries(await request.formData());

        // Create ZOD validation shema
        const Post = z.object({
            title: z
                .string({ required_error: 'Post title is required' })
                .min(1, { message: 'Post title is required' })
                .max(1023, { message: 'Post title must be less than 1023 characters' })
                .trim(),
            slug: z
                .string({ required_error: 'URL slug is required' })
                .min(1, { message: 'URL slug is required' })
                .max(1023, { message: 'URL slug must be less than 1023 characters' })
                .trim()
                .transform(sl => sl.toLowerCase()),
            subType: z
                .enum([ 'single', 'split' ], { message: 'Allowed post types are "single" and "split"' }),
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
            categoryId: z
                .preprocess((x) => Number(x), z.number().int().nonnegative())
                .transform(x => x == 0 ? null : x),
            parentId: z
                .preprocess((x) => Number(x), z.number().int().nonnegative())
                .transform(x => x == 0 ? null : x),
            bodyA: z
                .string({ required_error: 'First post body must not be empty' })
                .min(1, { message: 'First post body must not be empty' }),
            bodyB: z
                .string()
                .optional(),
        });

        // Variable to store validation result
        let parsed;

        try {
            // Validate given form data
            parsed = Post.parse(formData);
            
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
                type: 'post',
                parentType: {
                    [db.Sequelize.Op.or]: ['category', null]
                },
            }
        });
        const category = await db.Content.findOne({
            where: {
                id: parsed.categoryId,
                type: 'category',
            }
        });
        const duplicateSlug = await db.Content.findOne({
            where: {
                slug: parsed.slug,
                id: {
                    [db.Sequelize.Op.ne]: post?.id ?? 0
                }
            }
        });

        console.log("PARENT ID >> ", parsed.parentId, parent);

        // Check that post and parent id are not equal
        if (parsed.parentId && post && parsed.parentId === post.id)
            errors.parentId = [ 'Post cannot be parent to itself' ];
        // Check that valid author is specified
        if (!author)
            errors.authorId = [ 'Invalid author try reloading the page' ];
        // Check that if parent id is specified it is valid
        if (parsed.parentId && !parent)
            errors.parentId = [ 'Invalid parent try reloading the page' ];
        // Check that if category id is specified it is valid
        if (parsed.categoryId && !category)
            errors.categoryId = [ 'Invalid category try reloading the page' ];
        // Check that given URL slug is unique
        if (duplicateSlug)
            errors.slug = [ 'URL slug must be unique' ];

        // If no parent is set use category as parent, otherwise post
        // shares parent's category
        if (!parsed.parentId)
            parsed.parentId = parsed.categoryId;

        // If any of above errors occured, return them
        if (Object.keys(errors).length > 0)
            return fail(400, {
                data: formData,
                errors: errors,
            });
        
        // Set content type to post
        parsed.type = 'post';

        // If we are creating new post create it
        if (action === 'create') {
            const highest = await db.Content.findOne({
                order: [[ 'orderField', 'DESC' ]],
                where: {
                    parentId: parsed.parentId,
                }
            });

            parsed.orderField = (highest?.orderField ?? 0) + 1;
            await db.Content.create(parsed);

        // Otherwise update existing post
        } else {
            await db.Content.update(parsed, {
                where: {
                    id: post.id,
                },

                individualHooks: true,
            });
        }
    },
}