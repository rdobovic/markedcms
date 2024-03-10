import db from '$db';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ params, locals }) {

    if (!params.id)
        throw error(404);

    const user = await db.User.findByPk(params.id, { raw: true });

    if (!user)
        throw error(404);

    if (user.id === locals.user.id)
        return redirect(303, '/admin/users');

    const { password, token, tokenExpires, ...userData } = user;

    const users = (await db.User.findAll({
        where: {
            id: {
                [db.Sequelize.Op.ne]: params.id,
            }
        }
    })).map(
        u => ({ name: u.username, value: u.id })
    );

    return {
        users: [{ name: 'Nobody', value: 0 }, ...users],
        user: userData,
    };
}

export const actions = {
    default: async ({ params, request, locals }) => {
        const formData = Object.fromEntries(await request.formData());

        const user = await db.User.findByPk(params.id);
        if (!user)
            throw error(404);

        if (user.id === locals.user.id)
            return fail(400, {
                data: formData,
                errors: { global: ['You cannot delete yourself'] }
            });

        const leaveToUser = await db.User.findByPk(formData.leaveTo);
        if (!leaveToUser) {
            console.log("LEAVE TO ERROR");
            return fail(400, {
                data: formData,
                errors: { leaveTo: ['You must leave it to someone'] }
            });
        }

        await db.Content.update({ authorId: leaveToUser.id }, {
            where: {
                authorId: user.id,
            }
        });

        await user.destroy();
        return redirect(303, '/admin/users');
    }
}