import db from '$db';

export async function load() {

    const structure = await db.Content.findAllHierarchy({
        raw: true,
        order: [[ 'orderField', 'ASC' ]],
        where: {
            display: true,
        }
    });

    const data = {
        menu: structure,
    }

    return data;
}