import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANTE: cambia '/compound-tcg/' al nombre exacto de tu repositorio en GitHub
// Por ejemplo, si tu repo es github.com/usuario/mi-juego, pon '/mi-juego/'
export default defineConfig({
  plugins: [react()],
  base: '/alquimiaelementaljuego/',
})
