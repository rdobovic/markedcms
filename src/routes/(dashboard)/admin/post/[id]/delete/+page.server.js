import db from '$db';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params, url }) {
    const post = await db.Content.findOne({
        where: {
            id: params.id,
            type: 'post'
        }
    });

    if (!post)
        throw error(404);

    return {
        post: post.dataValues,
        back: `/${url.searchParams.get('back')?.substring(1) ?? 'admin'}`,
    };
}

export const actions = {
    default: async ({ params, url }) => {
        const post = await db.Content.findOne({
            where: {
                id: params.id,
                type: 'post'
            }
        });

        if (!post)
            throw error(440);

        if (await db.Content.findOne({ where: { parentId: post.id } }))
            return fail(422, {
                error: 'You cannot delete the post which has children, delete all the children first.'
            });

        await post.destroy();
        return redirect(303, `/${url.searchParams.get('back')?.substring(1) ?? 'admin'}`);
    }
}