import db from '$db';

export async function load() {
    const structure = await db.Content.findAllHierarchy({ 
        raw: true,
        order: [[ 'orderField', 'ASC' ]],
    });

    return {
        structure: structure,
    };
}