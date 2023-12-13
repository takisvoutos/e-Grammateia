import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    basicSsl()],
  server: {
    port: 3000,  // Client port
    // https: {
    //   key: './key.pem',
    //   cert: './cert.pem',
    // },
  }
})