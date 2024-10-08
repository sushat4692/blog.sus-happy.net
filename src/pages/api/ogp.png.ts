import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-wasm";
import type { APIContext } from "astro";

import { loadGoogleFont } from "../../util/loadGoogleFont";
import { initResvg } from "../../util/initResvg";
import { getImageDataUri } from "../../util/getImageDataUri";

export const prerender = false;

export const config = {
    runtime: "edge",
};

export async function GET({ url }: APIContext) {
    await initResvg();

    const title = "SUSH-i LOG";
    const subTitle = "名古屋のWeb制作会社につとめるプログラマーのつぶやき";

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

    // const dataUri = await getImageDataUri("/content/background.jpg");
    const dataUri = `${url.origin}/content/background.jpg`;

    const svg = await satori(
        {
            type: "div",
            props: {
                children: [
                    {
                        type: "img",
                        props: {
                            src: dataUri,
                            width: 1800,
                            height: 1200,
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

    return new Response(pngBuffer, {
        headers: {
            "content-type": "image/png",
            "cache-control":
                "public, immutable, no-transform, max-age=31536000",
        },
    });
}
