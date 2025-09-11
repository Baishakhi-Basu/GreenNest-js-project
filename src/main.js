// import "./style.css";
import { renderProducts } from "./js/renderAllProducts.js";
import { loadCategories } from "./js/load-categories.js";
import { renderTestimonials } from "./js/renderTestimonials.js";
import { renderBlogPosts } from "./js/renderBlogPosts.js";

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Load categories first
  await loadCategories();

  // Render Best Sellers
  await renderProducts("bestSellerContainer", (product) => product.bestSeller);

  // Render New Arrivals
  await renderProducts("newArrivalContainer", (product) => product.newArrival);

  // Render testimonials and blog posts
  await renderTestimonials();
  await renderBlogPosts();
});
