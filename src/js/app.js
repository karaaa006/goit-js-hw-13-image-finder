import apiQuery from "./apiService";
import refs from "./refs";
import { Notify } from "notiflix";
import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";
import galleryListTemplate from "../templates/template.hbs";

const { form, input, gallery } = refs;
let page = 1;
let maxPage = 1;

const observer = new IntersectionObserver(
  (entries, observer) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.firstElementChild.complete) {
        observer.unobserve(entry.target);
        renderNextPage(input.value);
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

    maxPage = total / hits.length;

    if (total === 0) {
      throw new Error("Photo not found!");
    }

    Notify.success(`${total} photos found!`);
    form.style.backgroundImage = `linear-gradient(rgba(34, 60, 80, 0.4), rgba(34, 60, 80, 0.4)), url(${hits[0].largeImageURL}) `;
    gallery.innerHTML = markup;
    document.querySelector(".arrow").classList.remove("is-hidden");

    observer.observe(document.querySelector(".photo-card:last-child"));
  } catch (err) {
    Notify.warning(err.message);
  }
};

const renderNextPage = async (query) => {
  try {
    if (page <= maxPage) {
      const data = await apiQuery(query, ++page);
      const { hits } = data;
      const markup = galleryListTemplate(hits);

      gallery.insertAdjacentHTML("beforeend", markup);
    }
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
