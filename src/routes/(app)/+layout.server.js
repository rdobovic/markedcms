import db from '$db';

export async function load() {

    const headerRoot = await db.RootCategory.findOne({
        where: { location: 'header' }
    });

    const sidebarRoot = await db.RootCategory.findOne({
        where: { location: 'sidebar' }
    });

    const headerItems = await db.Content.findAll({
        raw: true,
        order: [[ 'orderField', 'ASC' ]],
        where: {
            display: true,
            rootCategoryId: headerRoot.id,
            parentId: {
                [db.Sequelize.Op.is]: null,
            }
        }
    });

    const sidebarItems = await db.Content.findAll({
        raw: true,
        order: [[ 'orderField', 'ASC' ]],
        where: {
            display: true,
            rootCategoryId: sidebarRoot.id,
            parentId: {
                [db.Sequelize.Op.is]: null,
            }
        }
    });

    const contentStructure = await db.Content.findAllHierarchy({
        raw: true,
        order: [[ 'orderField', 'ASC' ]],
        where: {
            display: true,
        }
    });

    const data = {
        contentStructure, headerItems, sidebarItems
    }

    return data;
}