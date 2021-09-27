import throttle from "lodash.throttle";
import apiQuery from "./apiService";
import refs from "./refs";
import { Notify } from "notiflix";
import * as basicLightbox from "basiclightbox";
import galleryListTemplate from "../templates/template.hbs";

const { form, input, gallery } = refs;
let page = 1;

const observer = new IntersectionObserver(
  (entries, observer) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.firstElementChild.complete) {
        renderNextPage(input.value);

        observer.unobserve(entry.target);
        observer.observe(document.querySelector(".photo-card:last-child"));
      }
    }),
  { threshold: 1 },
);

const renderPhoto = async (query) => {
  try {
    page = 1;

    const data = await apiQuery(query);
    const { total, hits } = data;
    const markup = galleryListTemplate(hits);

    if (total === 0) {
      throw new Error("Photo not found!");
    }

    Notify.success(`${total} photos found!`);

    gallery.innerHTML = markup;

    observer.observe(document.querySelector(".photo-card:last-child"));
  } catch (err) {
    Notify.warning(err.message);
  }
};

const renderNextPage = async (query) => {
  try {
    const data = await apiQuery(query, ++page);
    const { hits } = data;
    const markup = galleryListTemplate(hits);

    gallery.insertAdjacentHTML("beforeend", markup);
  } catch (err) {
    Notify.warning(err.message);
  }
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
