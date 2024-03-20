import db from '$db';

export async function load() {

    const structure = [];
    const rootCategories = await db.RootCategory.findAll({});

    for (const root of rootCategories) {
        structure.push({
            id: root.id,
            type: 'root',
            title: root.displayName,
            location: root.location,
            children: (await db.Content.findAllHierarchy({
                raw: true,
                order: [[ 'orderField', 'ASC' ]],
                where: {
                    rootCategoryId: root.id,
                }
            })),
        });
    }

    return { structure };
}