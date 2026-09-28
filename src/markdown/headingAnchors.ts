import { defineHastPlugin } from "satteri";
import GithubSlugger from "github-slugger";

export const headingAnchors = () => {
    const slugger = new GithubSlugger();

    return defineHastPlugin({
        name: "heading-anchors",
        element: {
            filter: ["h2", "h3", "h4", "h5", "h6"],
            visit(node, ctx) {
                const existingId = node.properties?.id;
                const id =
                    typeof existingId === "string"
                        ? existingId
                        : slugger.slug(ctx.textContent(node));

                if (typeof existingId !== "string") {
                    ctx.setProperty(node, "id", id);
                }

                ctx.appendChild(node, {
                    type: "element",
                    tagName: "a",
                    properties: {
                        href: `#${id}`,
                        className: ["header-anchor"],
                        ariaHidden: "true",
                    },
                    children: [],
                });
            },
        },
    });
};
