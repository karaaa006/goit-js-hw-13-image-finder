import apiQuery from "./apiService";
import refs from "./refs";
import { Notify } from "notiflix";
import * as basicLightbox from "basiclightbox";

const { form, input, gallery, moreBtn } = refs;
let page = 1;

const getListItems = (hits) => {
  return hits
    .map((el) => {
      const {
        tags,
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
      } = el;

      return `
            <li class="photo-card">
          <img
            src="${webformatURL}"
            alt="${tags}"
            data-full="${largeImageURL}"
            class="gallery-photo"
          />
          <div class="stats">
            <p class="stats-item">
              <i class="material-icons">thumb_up</i>
              ${likes}
            </p>
            <p class="stats-item">
              <i class="material-icons">visibility</i>
              ${views}
            </p>
            <p class="stats-item">
              <i class="material-icons">comment</i>
              ${comments}
            </p>
            <p class="stats-item">
              <i class="material-icons">cloud_download</i>
              ${downloads}
            </p>
          </div>
        </li>
        `;
    })
    .join("");
};

const renderPhoto = (query) => {
  page = 1;

  apiQuery(query)
    .then((d) => {
      const { total, hits } = d;

      if (total === 0) {
        throw new Error("Photo not found!");
      }

      Notify.success(`${total} photos found!`);

      gallery.innerHTML = getListItems(hits);
    })
    .catch((err) => {
      Notify.warning(err.message);
    });

  moreBtn.classList.remove("display-none");
};

const renderNextPage = (query) => {
  apiQuery(query, ++page)
    .then((d) => {
      const { hits } = d;

      gallery.insertAdjacentHTML("beforeend", getListItems(hits));
    })
    .catch((err) => {
      Notify.warning(err.message);
    });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  renderPhoto(input.value);
});

gallery.addEventListener("click", (e) => {
  if (e.target.tagName !== "IMG") return;

  const fullImg = e.target.dataset.full;
  basicLightbox.create(`<img src="${fullImg}" width="1920">`).show();
});

moreBtn.addEventListener("click", (e) => {
  renderNextPage(input.value);
});
