export async function renderTestimonials() {
  try {
    const response = await fetch("api/testimonials.json");
    const testimonials = await response.json();
    console.log(testimonials);

    const testimonialTemplate = document.getElementById("testimonialsTemplate");
    const testimonyContainer = document.getElementById("testimonyContainer");

    testimonials.forEach((testimonial) => {
      const clone = testimonialTemplate.content.cloneNode(true);
      const testimonialText = clone.getElementById("testimonialText");
      const authorImage = clone.querySelector(".authorImage");
      const authorName = clone.getElementById("authorName");
      const authorOccupation = clone.getElementById("authorOccupation");

      testimonialText.textContent = testimonial.content;
      authorImage.src = testimonial.authorImage;
      authorName.textContent = testimonial.name;
      authorOccupation.textContent = testimonial.occupation;

      testimonyContainer.appendChild(clone);
    });
  } catch (err) {
    console.log(err);
  }

  $("#testimonyContainer").owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3500,
    navText: [
      '<i class="fa-solid fa-circle-arrow-left"></i>',
      '<i class="fa-solid fa-circle-arrow-right"></i>',
    ],
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 1 },
      1200: { items: 1 },
    },
  });
}
