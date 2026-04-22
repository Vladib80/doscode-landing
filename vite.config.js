import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        v6: 'v6.html',
        v7: 'v7.html',
        v8: 'v8.html',
        v9: 'v9.html',
        v10: 'v10.html'
      }
    }
  }
}
