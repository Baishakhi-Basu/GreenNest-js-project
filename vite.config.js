import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: '.',
  base: './', // Use relative paths for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html',
        products: './products.html',
        cart: './cart.html',
        checkout: './checkout.html',
        wishlist: './wishlist.html',
        blog: './blog.html',
        contact: './contact.html',
        'product-details': './product-details.html',
        thankyou: './thankyou.html',
        terms: './terms.html',
        privacy: './privacy.html'
      }
    }
  },
  plugins: [
    {
      name: 'copy-static-files',
      writeBundle() {
        // Copy API folder to dist
        const apiSrc = resolve(__dirname, 'api')
        const apiDest = resolve(__dirname, 'dist/api')
        
        if (!existsSync(apiDest)) {
          mkdirSync(apiDest, { recursive: true })
        }
        
        // Copy all JSON files from api folder
        const files = readdirSync(apiSrc)
        files.forEach(file => {
          if (file.endsWith('.json')) {
            copyFileSync(resolve(apiSrc, file), resolve(apiDest, file))
          }
        })
        
        // Copy images folder to dist
        const imagesSrc = resolve(__dirname, 'images')
        const imagesDest = resolve(__dirname, 'dist/images')
        
        if (existsSync(imagesSrc) && !existsSync(imagesDest)) {
          const copyDir = (src, dest) => {
            if (!existsSync(dest)) {
              mkdirSync(dest, { recursive: true })
            }
            const entries = readdirSync(src, { withFileTypes: true })
            for (const entry of entries) {
              const srcPath = resolve(src, entry.name)
              const destPath = resolve(dest, entry.name)
              if (entry.isDirectory()) {
                copyDir(srcPath, destPath)
              } else {
                copyFileSync(srcPath, destPath)
              }
            }
          }
          copyDir(imagesSrc, imagesDest)
        }
        
        // Copy header.html and footer.html
        const headerSrc = resolve(__dirname, 'header.html')
        const footerSrc = resolve(__dirname, 'footer.html')
        const headerDest = resolve(__dirname, 'dist/header.html')
        const footerDest = resolve(__dirname, 'dist/footer.html')
        
        if (existsSync(headerSrc)) {
          copyFileSync(headerSrc, headerDest)
        }
        if (existsSync(footerSrc)) {
          copyFileSync(footerSrc, footerDest)
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
    }
  }
})
