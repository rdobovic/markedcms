import db from '$db';
import { init } from '$db';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { initOptions } from '$lib/server/options.js'

let initDone = false;

// Run sync init
if (!building) {
    init(); // Init database
}

// Run async init
const doInit = async () => {
    initDone = true;
    console.log(">>>>>>>> HERE <<<<<<<<<");
    await initOptions(); // Init global options
}

export async function handle({ event, resolve }) {

    if (!initDone) {
        await doInit();
    }

    const token = event.cookies.get('token');

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