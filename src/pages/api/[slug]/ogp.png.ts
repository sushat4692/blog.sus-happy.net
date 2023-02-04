import type { APIContext } from "astro";
import { ImageResponse } from "@vercel/og";
import { loadGoogleFont } from "../../../util/loadGoogleFont";
import { getImageDataUri } from "../../../util/getImageDataUri";
import { CollectionEntry, getCollection } from "astro:content";

export const config = {
    runtime: "experimental-edge",
};

type Props = {
    entry: CollectionEntry<"blog">;
};

export async function getStaticPaths() {
    const blogEntries = await getCollection("blog");
    return blogEntries.map((entry) => ({
        params: { slug: entry.slug },
        props: { entry },
    }));
}

export async function get({ props }: APIContext<Props>) {
    const title = props.entry.data.title;
    const subTitle = "SUSH-i LOG";

    const fontData = await loadGoogleFont(title, subTitle).then((resp) =>
        resp?.arrayBuffer()
    );
    const fonts: any[] = [];
    if (fontData) {
        fonts.push({
            name: "NotoSansJapanese",
            data: fontData,
            weight: 700,
            style: "normal",
        });
    }

    const dataUri = await getImageDataUri(
        props.entry.data.thumbnail
            ? props.entry.data.thumbnail
            : "/content/background.jpg"
    );

    return new ImageResponse(
        {
            type: "div",
            props: {
                children: [
                    {
                        type: "img",
                        props: {
                            src: dataUri,
                            style: {
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                opacity: "0.4",
                            },
                        },
                    },
                    {
                        type: "h1",
                        props: {
                            children: title,
                            style: {
                                width: "90%",
                                color: "#fff",
                                fontSize: 64,
                                textAlign: "center",
                                wordBreak: "break-word",
                            },
                        },
                    },
                    {
                        type: "p",
                        props: {
                            children: subTitle,
                            style: {
                                color: "#fff",
                                fontSize: 32,
                            },
                        },
                    },
                ],
                style: {
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#000",
                    fontSize: 32,
                    fontWeight: 500,
                },
            },
        },
        {
            width: 1200,
            height: 630,
            fonts,
        }
    );
}
