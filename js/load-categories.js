export async function loadCategories() {
  try {
    const [categoryResponse, productsResponse] = await Promise.all([
      fetch("api/category.json"),
      fetch("api/available-products.json"),
    ]);
    // const response = await fetch("api/category.json");
    const categories = await categoryResponse.json();
    const products = await productsResponse.json();

    const container = document.getElementById("category-list");
    const categoryTemplate = document.getElementById("category-template");

    categories.forEach((category) => {
      const categoryCount = products.filter(
        (pro) => pro.category === category.name
      ).length;

      const clone = categoryTemplate.content.cloneNode(true);
      clone.querySelector(".categoryImg").src = category.image;
      clone.querySelector(".categoryTitle").textContent = category.name;
      clone.querySelector(
        ".categoryCount"
      ).textContent = `(${categoryCount} items)`;
      clone.querySelector(".item").setAttribute("data-category", category.name);

      // click → go to products.html with category filter
      clone.querySelector(".categoryCardBlock").onclick = () => {
        window.location.href = `products.html?category=${encodeURIComponent(
          category.name
        )}`;
      };
      container.appendChild(clone);
    });
  } catch (err) {
    console.error("Error loading categories:", err);
  }
  // owl caraosel item
  $("#category-list").owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    autoplay: true,
    autoplayTimeout: 2500,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      1200: { items: 5 },
    },
    onTranslated: function () {
      $(".owl-item.cloned, .owl-item:not(.cloned)").on(
        "click",
        ".item",
        function () {
          const categoryName = $(this).data("category");
          window.location.href = `products.html?category=${encodeURIComponent(
            categoryName
          )}`;
        }
      );
    },
  });
}
