import axios from "axios";

export default async function (query, page = "1") {
  axios.defaults.baseURL = "https://pixabay.com/api/";
  axios.defaults.params = { key: "23524775-df2d338982330c0756c93cc31" };

  const { data, status } = await axios.get(
    `?image_type=photo&orientation=horizontal&q=${query}&page=${page}&per_page=12`,
  );
  if (status !== 200) return;
  return data;
}
