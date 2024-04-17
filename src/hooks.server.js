import db from '$db';
import { init } from '$db';
import { redirect } from '@sveltejs/kit';
import { initOptions } from '$lib/server/options.js'

let initDone = false;

// Run startup/initialization code
async function appInit() {

    init();              // Init DB
    await initOptions(); // Init Options
    initDone = true;
}

export async function handle({ event, resolve }) {
    const token = event.cookies.get('token');

    if (!initDone)
        await appInit();

    if (token) {
        const user = await db.User.findOne({ where: { token } });

        if (user && user.tokenExpires > (new Date())) {
            event.locals.user = user;
        }
    }

    const url = event.url.pathname + event.url.search;
    
    if (url.startsWith('/admin')) {
        if (!event.locals.user) {
            throw redirect(303, `/login?redirectTo=${url}`);
        }
    }

    return await resolve(event);
}