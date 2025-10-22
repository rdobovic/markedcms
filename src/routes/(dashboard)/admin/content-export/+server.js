import db from '$db';

export async function GET() {

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

    const now = new Date();
    const filename = 'site-content-'
        + now.getFullYear().toString().padStart(4, '0')
        + (now.getMonth() + 1).toString().padStart(2, '0')
        + now.getDate().toString().padStart(2, '0')
        + '-'
        + now.getHours().toString().padStart(2, '0')
        + now.getMinutes().toString().padStart(2, '0')
        + now.getSeconds().toString().padStart(2, '0')
        + '.json';

    return new Response(JSON.stringify(structure), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}