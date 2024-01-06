import z from 'zod';
import db from '$db';
import { error, fail } from '@sveltejs/kit';

export async function load({ params }) {
    if (!params.id)
        throw error(404);

    const user = await db.User.findByPk(params.id, { raw: true });

    if (!user)
        throw error(404);

    const { password, token, tokenExpires, ...userData } = user;

    return {
        user: userData,
    }
}

export const actions = {
    default: async ({ params, request }) => {
        const formData = Object.fromEntries(await request.formData());

        if (!params.id)
            throw error(404);

        const user = await db.User.findByPk(params.id);

        if (!user)
            throw error(404);

        const User = z.object({
            displayName: z
                .string({ required_error: 'Display name is required' })
                .min(1, { message: 'Display name is required' })
                .max(40, { message: 'Display name cannot have more than 40 characters' }),
            password: z
                .string()
                .min(8, { message: 'Password must have at least 8 characters' })
                .max(1000, { message: 'Password cannot be longer than 1000 characters' })
                .or(z.string().length(0))
                .optional(),
            passwordRetype: z
                .string()
                .optional(),
        })
            .refine((data) => data.password === data.passwordRetype, {
                message: "Passwords don't match",
                path: [ 'passwordRetype' ],
            });

        let parsed;
        try {
            parsed = User.parse(formData);
        } catch (err) {
            console.log(err);
            return fail(400, {
                data: formData,
                errors: err.flatten().fieldErrors,
            });
        }
        console.log(parsed);

        user.displayName = parsed.displayName;

        if (parsed.password)
            user.password = parsed.password;

        await user.save();
        console.log(user);
    }
}