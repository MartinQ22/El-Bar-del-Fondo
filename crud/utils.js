import { dirname } from "path";
import { fileURLToPath } from "url";

export const serverRoot = dirname(fileURLToPath(import.meta.url));