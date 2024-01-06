import db from '$db';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params, url }) {
    const category = await db.Content.findOne({
        where: {
            id: params.id,
            type: 'category'
        }
    });

    if (!category)
        throw error(404);

    return {
        category: category.dataValues,
        back: `/${url.searchParams.get('back')?.substring(1) ?? 'admin'}`,
    };
}

export const actions = {
    default: async ({ params, url }) => {
        const category = await db.Content.findOne({
            where: {
                id: params.id,
                type: 'category'
            }
        });

        if (!category)
            throw error(404);

        if (await db.Content.findOne({ where: { parentId: category.id } }))
            return fail(422, {
                error: 'You cannot delete the category which has children, delete all the children first.'
            });

        await category.destroy();
        return redirect(303, `/${url.searchParams.get('back')?.substring(1) ?? 'admin'}`);
    }
}