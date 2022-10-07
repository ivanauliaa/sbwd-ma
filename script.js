const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w185';
const apiKey = '427601ac0efa59ed0e5d43e2949275d9';

let movies = [];

const buildMovieCard = (title, rating, released, imgUrl) => {
  const date = new Date(released);
  const newDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `
    <div class="col-md-4 d-flex align-items-stretch">
      <div class="card" style="width: 18rem;">
          <img src="${imgUrl}" class="card-img-top" alt="${title} poster">
          <div class="card-body">
              <div class="row">
                  <div class="col-6">
                      <p>${title}</p>
                  </div>
                  <div class="col-6 text-end">
                      <p><b>${rating}</b></p>
                  </div>
              </div>
              <p class="card-text">${newDate}</p>
          </div>
      </div>
    </div>
  `;
};

const refresh = () => {
  let moviesHtml = '';

  movies.forEach((movie) => {
    moviesHtml += buildMovieCard(
      movie.title,
      movie.vote_average,
      movie.release_date,
      imageBaseUrl + movie.poster_path,
    );
  });

  document.getElementById('movieList').innerHTML = moviesHtml;
};

const popularMovie = async () => {
  const response = await fetch(
    baseUrl +
    `/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=1`, {
    method: 'GET',
  });

  const responseJson = await response.json();
  return responseJson.results;
};

const searchMovie = async (query) => {
  const response = await fetch(
    baseUrl +
    `/search/movie?api_key=${apiKey}&query=${query}&page=1`, {
    method: 'GET',
  });

  const responseJson = await response.json();
  return responseJson.results;
};

const initData = async () => {
  movies = await popularMovie();
  refresh();
}

const searchHandler = async (event) => {
  event.preventDefault();

  const query = document.getElementById('search').value.trim();

  if (query.length > 0) {
    movies = await searchMovie(query);
    refresh();
    return
  }

  initData();
}

document.getElementById('submitSearch').addEventListener('click', searchHandler);

window.onload = async () => {
  await initData();
};
