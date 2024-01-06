import z from 'zod';
import db from '$db';
import { fail } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        const User = z.object({
            username: z
                .string({ required_error: 'Username is required' })
                .min(4, { message: 'Username must have at least 4 characters' })
                .max(40, { message: 'Username cannot have more than 40 characters' }),
            displayName: z
                .string({ required_error: 'Display name is required' })
                .min(1, { message: 'Display name is required' })
                .max(40, { message: 'Display name cannot have more than 40 characters' }),
            password: z
                .string()
                .min(8, { message: 'Password must have at least 8 characters' })
                .max(1000, { message: 'Password cannot be longer than 1000 characters' })
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
            return fail(400, {
                data: formData,
                errors: err.flatten().fieldErrors,
            });
        }

        const user = await db.User.findOne({
            where: {
                username: parsed.username,
            }
        });

        if (user)
            return fail(400, {
                data: formData,
                errors: { username: [ 'Given username already exists' ] },
            });

        await db.User.create(parsed);
    }
}