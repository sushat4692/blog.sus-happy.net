import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import removeMd from "remove-markdown";
import type { APIContext } from "astro";

import { PER_PAGE } from "../const";

export async function GET(context: APIContext) {
    const posts = (await getCollection("blog"))
        .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
        .slice(0, PER_PAGE);

    return rss({
        title: "SUSH-i LOG",
        description: "名古屋のWeb制作会社につとめるプログラマーのつぶやき",
        site: context.site!,
        customData: "<language>ja</language>",
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            link: `/${post.id}/`,
            description: removeMd(post.body ?? "")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 200),
            categories: post.data.tags,
        })),
    });
}
