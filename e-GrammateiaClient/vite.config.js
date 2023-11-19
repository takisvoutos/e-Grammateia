import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Client port
    https: {
      key: '/Users/takisvoutos/Desktop/e-Grammateia/e-GrammateiaClient/key.pem',
      cert: '/Users/takisvoutos/Desktop/e-Grammateia/e-GrammateiaClient/cert.pem',
    },
  }
})