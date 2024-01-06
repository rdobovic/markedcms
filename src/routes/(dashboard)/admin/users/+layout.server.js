import db from '$db';

export async function load() {
    const users = (await db.User.findAll({
        raw: true,
        order: [[ 'username', 'ASC' ]],
    })).map((u) => {
        const { password, token, tokenExpires, ...rest } = u;
        return rest;
    });

    return { users };
}