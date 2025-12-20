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

const form = document.querySelector("#search-form");

const page = 1;
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
      <a href="${img.largeImagesURL}"><img src="${img.webformatURL}" alt="" /></a>
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
  try {
    const data = await fetchImages();
    createPicturesMarkup(data.hits);
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: error.message,
      position: "topRight",
    });
  }
}

form.addEventListener("submit", onSubmitForm);
