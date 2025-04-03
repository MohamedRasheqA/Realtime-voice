import { join, dirname } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

const path = fileURLToPath(import.meta.url);

export default {
  root: join(dirname(path), "client"),
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [react()]
};
