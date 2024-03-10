import db from '$db';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { redirect, fail } from "@sveltejs/kit";
import generateToken from '$lib/helpers/generateToken';

export async function load({ locals, cookies }) {

    if (locals.user)
        throw redirect(303, '/admin');
}

export const actions = {
    default: async ({ url, cookies, request }) => {
        const data = await request.formData();

        const username = data.get('username');
        const password = data.get('password');
        const remember = data.get('remember');

        const redirectTo = `/${url.searchParams.get('redirectTo')?.substring(1) ?? 'admin'}`;

        if (!username || !password)
            return fail(400, {
                data: { username, remember },
                errors: { 
                    username: !username ? ['Username cannot be empty'] : [],
                    password: !password ? ['Password cannot be empty'] : [],
                },
            });

        const user = await db.User.findOne({ where: { username } });

        if (!user || !(await user.authenticate(password)))
            return fail(403, {
                data: { username, remember },
                errors: { global: ['Invalid username or password'] }
            });

        const token = generateToken();
        const expires = new Date(
            Date.now() + 
            Number(remember ? env.AUTH_TOKEN_REMEMBER_VALID_SEC : env.AUTH_TOKEN_VALID_SEC) * 1000
        );

        cookies.set('token', token, {
            path: '/', 
            secure: !dev,
            sameSite: 'strict',
            expires: expires,
        });

        user.token = token;
        user.tokenExpires = expires;
        await user.save();

        throw redirect(303, redirectTo);
    }
}