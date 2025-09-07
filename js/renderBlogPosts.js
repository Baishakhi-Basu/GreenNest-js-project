export async function renderBlogPosts() {
  try {
    const blogResponse = await fetch("../api/blog.json");
    const blogData = await blogResponse.json();

    const blogPostsBlock = document.getElementById("blogPostsBlock");
    const blogTemplate = document.getElementById("blogTemplate");

    blogData.slice(0, 3).forEach((blog) => {
      const clone = blogTemplate.content.cloneNode(true);
      const blogTitle = clone.querySelector(".blog-title");
      blogTitle.textContent = blog.subheading;
      blogTitle.addEventListener("click", () => {
        window.location.href = `blog.html?id=${blog.id}`;
      });
      clone.querySelector(".blog-excerpt").textContent = blog.excerpt;
      clone.querySelector(".blog-date").textContent = blog.date;
      const blogImage = clone.querySelector("#blogImage");
      blogImage.src = blog.image;
      blogImage.addEventListener("click", () => {
        window.location.href = `blog.html?id=${blog.id}`;
      });
      clone.querySelector("#blogLink").addEventListener("click", () => {
        window.location.href = `blog.html?id=${blog.id}`;
      });
      blogPostsBlock.appendChild(clone);
    });
  } catch (err) {
    console.log(err);
  }
}
