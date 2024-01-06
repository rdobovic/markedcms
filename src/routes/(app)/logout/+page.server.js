import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ locals, cookies }) => {
        if (locals.user) {
            locals.user.token = null;
            await locals.user.save();
            locals.user = null;

            cookies.set('token', '', { path: '/', secure: false });
        }

        throw redirect(303, '/');
    }
}