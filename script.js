// https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=что_искать&page=номер_страницы&per_page=12&key=твой_ключ
// план
// 1. обробити submit форми. (есть)
// 2. зробити запит за ключовим словом. (есть)
// 3. зробити функцію для рендеру розмітки. (есть)
// 4. зробити завантаження картинок (нескінченний скролл за допомогою IntersectionObserver).
// 5. відкрити модальне вікно по кліку на картинку (бібліотека SimpleLightbox, BasicLightbox).
// 6. додати повідомлення користувачу (бібліотека Notifix, easyToast).

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "53713087-2b0a12a22f0eae895a449346a";
const picturesContainer = document.querySelector(".gallery");
const PER_PAGE = 12;
let simpleLightbox;

const form = document.querySelector("#search-form");

let page = 1;
let query = "";

const fetchImages = async () => {
  const response = await fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12&key=${API_KEY}`
  );
  const data = await response.json();
  console.log(data);
  return data;
};

const createPicturesMarkup = (pictures) => {
  const markup = pictures
    .map((img) => {
      return `<div class="photo-card">
        <a class="gallery-link" href=${img.largeImageURL}>
          <img src=${img.webformatURL} alt="" class="gallery-image"/>
        </a>
        <div class="stats">
          <p class="stats-item">
            <i class="material-icons">thumb_up</i>
            ${img.likes}
          </p>
          <p class="stats-item">
            <i class="material-icons">visibility</i>
            ${img.views}
          </p>
          <p class="stats-item">
            <i class="material-icons">comment</i>
            ${img.comments}
          </p>
          <p class="stats-item">
            <i class="material-icons">cloud_download</i>
            ${img.downloads}
          </p>
        </div>
      </div>`;
    })
    .join("");
  picturesContainer.insertAdjacentHTML("beforeend", markup);
};

async function onSubmitForm(e) {
  e.preventDefault();

  const form = e.target;
  query = form.elements.query.value.trim();
  if (!query) {
    iziToast.error({
      title: "Error",
      message: "Enter valid value",
      position: "topRight",
    });
    return;
  }

  page = 1;
  picturesContainer.innerHTML = "";
  observer.disconnect();

  try {
    const data = await fetchImages();
    createPicturesMarkup(data.hits);

    simpleLightbox = new SimpleLightbox(".gallery a", {});

    const picturesTarget = document.querySelector(".photo-card:last-child");
    observer.observe(picturesTarget);
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: error.message,
      position: "topRight",
    });
  }
}

form.addEventListener("submit", onSubmitForm);

const options = {
  threshold: 1.0,
};

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    console.log(entry.isIntersecting);
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      page += 1;
      loadingMorePictures();
    }
  });
};

async function loadingMorePictures() {
  try {
    const data = await fetchImages();
    createPicturesMarkup(data.hits);
    const picturesTarget = document.querySelector(".photo-card:last-child");
    observer.observe(picturesTarget);
    simpleLightbox.refresh();
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: error.message,
      position: "topRight",
    });
  }
}

const observer = new IntersectionObserver(callback, options);
