import options from '$lib/server/options.js';

export async function load({ locals }) {
    return {
        title: options.siteTitle,
        footer: options.footerCopyRight,
        userId: locals?.user?.id,
        username: locals?.user?.username,
        userDisplayName: locals?.user?.displayName,
    }
}