import type { APIContext } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-wasm";
import { getEntryBySlug } from "astro:content";

import { loadGoogleFont } from "../../../util/loadGoogleFont";
import { initResvg } from "../../../util/initResvg";

export async function get({ params, url }: APIContext) {
    const entry = await getEntryBySlug("blog", params.slug || "");

    if (!entry) {
        return new Response(null, {
            status: 404,
            statusText: "Not found post",
        });
    }

    await initResvg();

    const title = entry.data.title;
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

    const dataUri = entry.data.thumbnail
        ? url.origin + entry.data.thumbnail
        : `${url.origin}/content/background.jpg`;

    const svg = await satori(
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

    const resvg = new Resvg(svg, {
        background: "#000",
        fitTo: {
            mode: "width",
            value: 1200,
        },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
        headers: {
            "content-type": "image/png",
            "cache-control":
                "public, immutable, no-transform, max-age=31536000",
        },
    });
}
