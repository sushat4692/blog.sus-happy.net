import { readFile } from "node:fs/promises";
import mime from "mime-types";

export const getImageDataUri = async (fileName: string) => {
    const buffer = await readFile(`${process.cwd()}/public${fileName}`);
    const mimeType = mime.lookup(fileName);
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
};
