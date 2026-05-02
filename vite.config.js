import fs from 'node:fs';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const rollupInputs = {
  main: 'index.html',
  kk: 'kk/index.html',
  en: 'en/index.html',
  v6: 'v6.html',
  v7: 'v7.html',
  v8: 'v8.html',
  v9: 'v9.html',
  v10: 'v10.html',
  v10Lite: 'v10-lite.html',
  v11: 'v11.html',
  v12: 'v12.html',
  v15: 'v15.html',
  restopulse: 'restopulse/index.html',
  restopulseKk: 'kk/restopulse/index.html',
  whatsapp: 'whatsapp/index.html',
  whatsappKk: 'kk/whatsapp/index.html',
  eobEra: 'eob-era/index.html',
  contacts: 'contacts/index.html',
  privacy: 'privacy/index.html',
  terms: 'terms/index.html',
};

if (fs.existsSync('duck-inspired.html')) {
  rollupInputs.duckInspired = 'duck-inspired.html';
}

export default {
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: rollupInputs
    }
  }
}
