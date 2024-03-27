import z from 'zod';
import db from '$db';
import options from '$lib/server/options.js';
import { fail } from '@sveltejs/kit';

export async function load() {

    const content = (await db.Content.findAll({
        order: [[ 'title', 'ASC' ]],
    })).map(
        c => ({ name: c.title, value: c.id })
    );

    return {
        pages: [{ name: 'Default home', value: 0 }, ...content],
        options: options.raw(),
    }
}

export const actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        const Options = z.object({
            siteTitle: z
                .string({ required_error: 'Site title is required' })
                .min(1, { message: 'Site title is required' })
                .max(40, { message: 'Site title must be less than 40 characters' }),
            footerCopyRight: z
                .string({ required_error: 'Site footer is required' })
                .min(1, { message: 'Site footer is required' })
                .max(40, { message: 'Site footer must be less than 40 characters' }),
            homePageId: z
                .preprocess((x) => Number(x), z.number().int().nonnegative()),
            showPlainPosts: z
                .string()
                .optional()
                .transform(val => val === 'on'),
            numeratePosts: z
                .string()
                .optional()
                .transform(val => val === 'on'),
        });

        let parsed;

        try {
            parsed = Options.parse(formData);
        } catch (err) {
            return fail(400, {
                data: formData,
                errors: err.flatten().fieldErrors,
            })
        }

        await options.set('siteTitle', parsed.siteTitle);
        await options.set('footerCopyRight', parsed.footerCopyRight);
        await options.set('homePageId', parsed.homePageId);
        await options.set('showPlainPosts', parsed.showPlainPosts);
        await options.set('numeratePosts', parsed.numeratePosts);
    }
}