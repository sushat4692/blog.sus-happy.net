import type { APIContext } from "astro";
import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-wasm";
import { getEntry } from "astro:content";

import backgroundImage from "../../../assets/background.jpg?inline";
import { loadGoogleFont } from "../../../util/loadGoogleFont";
import { initResvg } from "../../../util/initResvg";

export const prerender = false;

export async function GET({ params, url }: APIContext) {
    const entry = await getEntry("blog", params.slug || "");

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
        resp?.arrayBuffer(),
    );
    const fonts: SatoriOptions["fonts"] = [];
    if (fontData) {
        fonts.push({
            name: "NotoSansJapanese",
            data: fontData,
            weight: 700,
            style: "normal",
        });
    }

    const toDataUri = async (source: string) => {
        const res = await fetch(source);
        if (!res.ok) {
            throw new Error(`Failed to fetch image: ${source}`);
        }
        const contentType = res.headers.get("content-type") ?? "image/jpeg";
        const buffer = Buffer.from(await res.arrayBuffer());
        return `data:${contentType};base64,${buffer.toString("base64")}`;
    };

    const { thumbnail } = entry.data;
    const image = thumbnail
        ? {
              src: await toDataUri(`${url.origin}${thumbnail.src}`),
              width: thumbnail.width,
              height: thumbnail.height,
          }
        : { src: backgroundImage, width: 1800, height: 1200 };

    const svg = await satori(
        {
            type: "div",
            props: {
                children: [
                    {
                        type: "img",
                        props: {
                            src: image.src,
                            width: image.width,
                            height: image.height,
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
                                marginRight: "auto",
                                marginLeft: "auto",
                                justifyContent: "center",
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
                    fontWeight: 700,
                },
            },
        },
        {
            width: 1200,
            height: 630,
            fonts,
        },
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

    return new Response(new Uint8Array(pngBuffer), {
        headers: {
            "content-type": "image/png",
            "cache-control":
                "public, immutable, no-transform, max-age=31536000",
        },
    });
}
