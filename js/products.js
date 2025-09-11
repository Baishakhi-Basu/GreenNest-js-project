import { renderProducts } from "./renderAllProducts";

export async function loadProducts() {
  try {
    const params = new URLSearchParams(window.location.search);
    let inputCategory = params.get("category");
    console.log(inputCategory);

    const response = await fetch("api/available-products.json");
    const products = await response.json();
    // console.log(products);
    const productCategory = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
    console.log(productCategory);

    const proCategoryList = document.getElementById("pro-category-list");
    const productCategoryTemplate = document.getElementById("product-category");
    const priceRangeList = document.getElementById("price-range-list");
    const resetFilters = document.getElementById("resetFilters");

    // Default "All" option
    const allClone = productCategoryTemplate.content.cloneNode(true);
    allClone.querySelector("input[type='radio']").value = "All";
    if (inputCategory === null) {
      allClone.querySelector("input").checked = true;
    }
    allClone.querySelector(
      "#pro-category-name"
    ).textContent = `All (${products.length})`;
    proCategoryList.appendChild(allClone);

    // Other categories
    for (let category in productCategory) {
      const clone = productCategoryTemplate.content.cloneNode(true);
      clone.querySelector("input[type='radio']").value = category;
      clone.querySelector("#pro-category-name").textContent = `${category} `;
      
      // Check the radio button if it matches the URL parameter
      if (inputCategory === category) {
        clone.querySelector("input[type='radio']").checked = true;
      }

      clone.querySelector(
        "#pro-category-qty"
      ).textContent = `(${productCategory[category]})`;
      proCategoryList.appendChild(clone);
    }
    let selectedCategory = inputCategory ?? "All";
    console.log(selectedCategory);
    let selectedPriceRange = "All";
    // renderProducts("productList", (product) => product);

    function filterProducts(product) {
      let categoryMatch =
        selectedCategory === "All" || product.category === selectedCategory;

      let priceRange = true;
      if (selectedPriceRange !== "All") {
        let [min, max] = selectedPriceRange.split("-").map(Number);
        priceRange = product.price >= min && product.price <= max;
      }
      return categoryMatch && priceRange;
    }

    renderProducts("productList", filterProducts);

    proCategoryList.addEventListener("change", async (event) => {
      selectedCategory = event.target.value;
      await renderProducts("productList", filterProducts);
      // if (event.target.value === "All" && selectedPriceRange === "All") {
      //   renderProducts("productList", (product) => product);
      // } else {
      //   renderProducts(
      //     "productList",
      //     (product) => product.category === event.target.value
      //   );
      // }
    });

    priceRangeList.addEventListener("change", async (event) => {
      selectedPriceRange = event.target.value;
      await renderProducts("productList", filterProducts);
    });
    resetFilters.addEventListener("click", async () => {
      selectedCategory = "All";
      selectedPriceRange = "All";
      proCategoryList.querySelector(
        "input[type='radio'][value='All']"
      ).checked = true;
      priceRangeList.querySelector(
        "input[type='radio'][value='All']"
      ).checked = true;
      await renderProducts("productList", (product) => product);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}
loadProducts();
