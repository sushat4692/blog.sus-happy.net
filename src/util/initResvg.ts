import { initWasm } from "@resvg/resvg-wasm";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

let initialized = false;

export const initResvg = async () => {
    if (initialized) {
        return;
    }
    initialized = true;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    console.log(import.meta.url);

    await initWasm(
        readFile(
            join(
                __dirname,
                "../../../node_modules/@resvg/resvg-wasm/index_bg.wasm"
            )
        )
    );
};
