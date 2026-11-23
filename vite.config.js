import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return { base: env.VITE_BASE_PATH || '/', plugins: [tailwindcss()] };
});
