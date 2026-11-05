import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ base: '/design-thinking/', plugins: [react(), tailwindcss()], resolve: { alias: { '@': new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') } } });

