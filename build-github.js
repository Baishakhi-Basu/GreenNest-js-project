import { copyFileSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Helper function to copy directories recursively
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

// Create dist directory (remove if exists)
const distDir = resolve(__dirname, 'dist')
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true })
}
mkdirSync(distDir, { recursive: true })

// Copy HTML files
const htmlFiles = ['index.html', 'products.html', 'cart.html', 'checkout.html', 
                  'wishlist.html', 'blog.html', 'contact.html', 'product-details.html',
                  'thankyou.html', 'terms.html', 'privacy.html', 'header.html', 'footer.html']

htmlFiles.forEach(file => {
  if (existsSync(file)) {
    copyFileSync(file, resolve(distDir, file))
  }
})

// Copy src folder
const srcDir = resolve(__dirname, 'src')
const distSrcDir = resolve(distDir, 'src')
if (existsSync(srcDir)) {
  copyDir(srcDir, distSrcDir)
}

// Copy js folder
const jsDir = resolve(__dirname, 'js')
const distJsDir = resolve(distDir, 'js')
if (existsSync(jsDir)) {
  copyDir(jsDir, distJsDir)
}

// Copy common.js
if (existsSync('common.js')) {
  copyFileSync('common.js', resolve(distDir, 'common.js'))
}

// Copy API folder
const apiDir = resolve(__dirname, 'api')
const distApiDir = resolve(distDir, 'api')
if (existsSync(apiDir)) {
  copyDir(apiDir, distApiDir)
}

// Copy images folder
const imagesDir = resolve(__dirname, 'images')
const distImagesDir = resolve(distDir, 'images')
if (existsSync(imagesDir)) {
  copyDir(imagesDir, distImagesDir)
}

console.log('Build completed successfully!')
