import type { APIContext } from "astro";

export const prerender = false;

export async function get({ params, redirect, site }: APIContext) {
    const { slug } = params;
    const redirectUrl = new URL(slug || "", site);

    return redirect(redirectUrl.toString(), 301);
}
