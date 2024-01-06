import db from '$db';

export async function load({ locals }) {
    return {
        // Get total number of posts
        postsTotal: await db.Content.count({ 
            where: { type: 'post' } 
        }),
        // Get total number of categories
        categoriesTotal: await db.Content.count({ 
            where: { type: 'category' } 
        }),
        // Get number of posts created by user
        postsUser: await db.Content.count({ 
            where: { 
                type: 'post',
                authorId: locals.user.id,
            } 
        }),
        // Get number of categories created by user
        categoriesUser: await db.Content.count({ 
            where: { 
                type: 'category',
                authorId: locals.user.id,
            } 
        }),
    }
}