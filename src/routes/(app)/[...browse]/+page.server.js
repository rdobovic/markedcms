import db from '$db';
import { error } from "@sveltejs/kit";
import options from '$lib/server/options.js';

export async function load({ params, url }) {

    console.log(url.pathname);

    let content;

    if (url.pathname === '/') {
        content = await db.Content.findByPk(options.homePageId, { 
            raw: true 
        });

        if (!content)
            return {
                content: {},
                defaultHomePage: true,
            }
    } else {
        content = await db.Content.findOne({
            raw: true,
            where: {
                path: url.pathname,
            }
        });
    }

    if (!content)
        throw error(404);

    let children = null;
    if (content.type === 'category') {
        children = await db.Content.findAllHierarchy({
            raw: true,
            treeRoot: content.id,
            where: {
                type: 'post',
                path: {
                    [db.Sequelize.Op.startsWith]: content.path,
                }
            }
        });
    }

    return {
        content, children, 
        defaultHomePage: false,
    };
}