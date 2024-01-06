import db from '$db';

export async function load() {
    const tree = await db.Content.findAllHierarchy({ raw: true });
}