document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".search-form");
  const input = document.querySelector(".input");
  const photoGrid = document.querySelector(".photo-grid");
  const hotKeyWords = document.querySelectorAll(".hot-keyword");

  const API_URL = "https://api.unsplash.com/photos/random";
  const ACCESS_KEY = "LMdfguklTWSfi5F5PjY96u-2IOLYk-juubaNfI79UKE";

  function handleSearch(event, query) {
    event.preventDefault();
    axios
      .get(`${API_URL}?count=10&client_id=${ACCESS_KEY}&query=${query}`)
      .then((response) => {
        const images = response.data;
        photoGrid.innerHTML = "";
        images.forEach((image) => {
          const imageElement = document.createElement("li");
          imageElement.innerHTML = `
          <img src="" data-src="${image.urls.regular}" class="lazy" alt="Image" /> `;
          photoGrid.appendChild(imageElement);
          console.log(images);
        });
        // Start lazy loading after images are added
        observeLazyImages();
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }

  function observeLazyImages() {
    const lazyImages = document.querySelectorAll(".lazy");
    lazyImages.forEach((image) => {
      imageObserver.observe(image);
    });
  }

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const { target } = entry;
        const src = target.getAttribute("data-src");
        if (entry.isIntersecting && src) {
          target.setAttribute("src", src);
          target.classList.remove("lazy"); // Remove lazy class after loading
          imageObserver.unobserve(target);
        }
      });
    },
    {
      rootMargin: "200px",
      threshold: 0.9,
    }
  );

  function handleClickKeyword(event) {
    const query = event.target.innerText;
    handleSearch(event, query);
  }

  hotKeyWords.forEach((keyword) => {
    keyword.addEventListener("click", handleClickKeyword);
  });

  searchForm.addEventListener("submit", (event) => {
    const inputValue = input.value.trim();
    if (!inputValue) {
      event.preventDefault(); // Prevent form submission and page reload

      alert("Please enter a search term.");
      return;
    }

    handleSearch(event, inputValue);
  });
  if (!input.value.trim()) {
    handleSearch({ preventDefault: () => {} }, "random");
  }
});
