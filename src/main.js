import "./style.css";
import { renderProducts } from "../js/renderAllProducts";
import { loadCategories } from "../js/load-categories";
import { renderTestimonials } from "../js/renderTestimonials";
import { renderBlogPosts } from "../js/renderBlogPosts";

// Render Best Sellers
renderProducts("bestSellerContainer", (product) => product.bestSeller);

// Render New Arrivals
renderProducts("newArrivalContainer", (product) => product.newArrival);

// Render Related Products
// renderProducts("relatedProductContainer", (product) => product.category);

document.addEventListener("DOMContentLoaded", loadCategories);

renderTestimonials();

renderBlogPosts();
