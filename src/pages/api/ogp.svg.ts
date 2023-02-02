import satori from "satori";

import { loadGoogleFont } from "../../util/loadGoogleFont";
import { getImageDataUri } from "../../util/getImageDataUri";

export async function get() {
    const title = "SUSH-i LOG";
    const subTitle = "名古屋のWeb制作会社につとめるプログラマーのつぶやき";

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

    const dataUri = await getImageDataUri("/content/background.jpg");

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
                                color: "#fff",
                                fontSize: 64,
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

    return {
        body: svg,
    };
}
