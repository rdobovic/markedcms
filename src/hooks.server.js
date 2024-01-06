import db from '$db';
import { init } from '$db';
import { building } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { initOptions } from '$lib/server/options.js'

// Run startup/initialization code
if (!building) {
    (async () => {

        init();              // Init DB
        await initOptions(); // Init Options
        
    })();
}

export async function handle({ event, resolve }) {

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