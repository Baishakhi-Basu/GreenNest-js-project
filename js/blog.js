async function blog() {
  try {
    const blogResponse = await fetch("api/blog.json");
    const blogData = await blogResponse.json();
    // console.log(blogData);

    let params = new URLSearchParams(window.location.search);
    const blogId = parseFloat(params.get("id"));

    const blogListOuter = document.getElementById("blogListOuter");
    const blogListTemplate = document.getElementById("blogListTemplate");
    const blogDetailTemplate = document.getElementById("blog-detail-template");
    const blogDetailsContainer = document.getElementById("blog-details");

    const currentBlog = blogData.find((blogEl) => blogEl.id === blogId);

    if (currentBlog) {
      const blogDetailsClone = blogDetailTemplate.content.cloneNode(true);
      blogDetailsClone.querySelector("#blogDetailImg").src =
        currentBlog.imageBig;
      blogDetailsClone.querySelector("#blogDetailImg").alt =
        currentBlog.heading;
      blogDetailsClone.querySelector("#blogDate").textContent =
        currentBlog.date;
      blogDetailsClone.querySelector("#blogTitle").textContent =
        currentBlog.heading;
      blogDetailsClone.querySelector("#blogSubhead").textContent =
        currentBlog.subheading;
      const blogDescription =
        blogDetailsClone.querySelector("#blogDescription");

      blogDescription.innerHTML = "";

      currentBlog.content.split("\n").forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        blogDescription.appendChild(p);
      });
      blogDetailsContainer.appendChild(blogDetailsClone);
    }

    blogData.forEach((blogElement) => {
      const clone = blogListTemplate.content.cloneNode(true);
      clone.querySelector("#blogImg").src = blogElement.image;
      clone.querySelector("#blogImg").alt = blogElement.heading;
      clone.querySelector(".blog-title").textContent = blogElement.heading;
      //   clone.querySelector(".highlights-date").textContent = blogElement.date;
      clone.querySelector(".blogShortText").textContent = blogElement.excerpt;
      clone.querySelector(".blog-list").addEventListener("click", () => {
        window.location.href = `blog.html?id=${blogElement.id}`;
      });

      blogListOuter.appendChild(clone);
    });
  } catch (error) {
    console.error("Error fetching blog data:", error);
  }
}
blog();
