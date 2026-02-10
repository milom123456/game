// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'remarkable-healing-production-d38b.up.railway.app'
    ]
  },
  // যদি আপনি রেলওয়েতে প্রিভিউ মোড ব্যবহার করেন
  preview: {
    allowedHosts: [
      'remarkable-healing-production-d38b.up.railway.app'
    ]
  }
})