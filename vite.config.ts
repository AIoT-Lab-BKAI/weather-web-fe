import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const envDir = "./env";
  const env = loadEnv(mode, envDir);

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      tailwindcss(),
      svgr(),
    ],
    envDir,
    root: "./",
    server: {
      port: Number(env.VITE_APP_PORT) || undefined,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
