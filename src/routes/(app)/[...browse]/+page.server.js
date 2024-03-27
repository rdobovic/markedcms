import db from '$db';
import { error } from "@sveltejs/kit";
import options from '$lib/server/options.js';

export async function load({ params, url }) {

    let content;

    const neededOptions = {
        numeratePosts: options.numeratePosts,
        showPlainPosts: options.showPlainPosts,
    }

    if (url.pathname === '/') {
        content = await db.Content.findByPk(options.homePageId, {});

        if (!content)
            return {
                content: {},
                ...neededOptions,
                defaultHomePage: true,
            }
    } else {
        content = await db.Content.findOne({
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
            order: [[ 'orderField', 'ASC' ]],
            where: {
                type: 'post',
                path: {
                    [db.Sequelize.Op.startsWith]: content.path,
                }
            }
        });
    }

    let postNumber = '';
    if (content.type === 'post') {
        postNumber = await content.getPostOrder();
    }

    return {
        ...neededOptions,
        children, postNumber,

        content: content.dataValues,
        defaultHomePage: false,
    };
}