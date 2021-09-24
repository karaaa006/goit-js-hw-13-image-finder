export default function (query, page = "1") {
  const BASE_URL = "https://pixabay.com/api/";
  const API_KEY = "23524775-df2d338982330c0756c93cc31";
  let url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query,
  )}&image_type=photo&orientation=horizontal&page=${page}&per_page=12`;

  return fetch(url).then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    throw new Error("Oh No! Error.");
  });
}
