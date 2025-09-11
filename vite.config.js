import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
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
