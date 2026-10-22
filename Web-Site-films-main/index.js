let API_KEY = 'dcea1fd7b3e65d34387ad6de7ef9cc5e';
let IMG_PATH = 'https://image.tmdb.org/t/p/w500';
let tokenTop = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=`;
let tokenPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=`;
let tokenUpComing = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=`;
let tokenSearch = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
let currentUrl = tokenPopular;
let currentPage = 1;
let currentMoviesData = [];

const appendContainer = document.querySelector('.append');
const pageTitle = document.querySelector('.title');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const categoryButtons = document.querySelectorAll('.btns');
const searchInput = document.getElementById('search');
const minInput = document.getElementById('min');
const maxInput = document.getElementById('max');
const scoreInput = document.getElementById('score');
const filterBtn = document.getElementById('filterBtn');

async function getMovies(url, page = 1) {
    try {
        let fullUrl = url.includes('search') ? `${url}&page=${page}` : `${url}${page}`;
        let response = await fetch(fullUrl);
        let data = await response.json();
        
        currentMoviesData = data.results || [];
        filterAndShowMovies();
    } catch (error) {
        console.error("Xatolik yuz berdi:", error);
    }
}

function filterAndShowMovies() {
    let filtered = [...currentMoviesData];

    let minYear = parseInt(minInput.value);
    let maxYear = parseInt(maxInput.value);
    let minScore = parseFloat(scoreInput.value);

    if (!isNaN(minYear)) {
        filtered = filtered.filter(m => m.release_date && new Date(m.release_date).getFullYear() >= minYear);
    }
    if (!isNaN(maxYear)) {
        filtered = filtered.filter(m => m.release_date && new Date(m.release_date).getFullYear() <= maxYear);
    }
    if (!isNaN(minScore)) {
        filtered = filtered.filter(m => m.vote_average >= minScore);
    }

    showMovies(filtered);
}

function showMovies(movies) {
    appendContainer.innerHTML = '';

    if (!movies || movies.length === 0) {
        appendContainer.innerHTML = '<h2 style="color:white; margin: 20px auto;">Kinolar topilmadi</h2>';
        return;
    }

    movies.forEach(movie => {
        let { title, poster_path, vote_average, release_date } = movie;

        let movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        let poster = poster_path ? IMG_PATH + poster_path : 'https://via.placeholder.com/300x450?text=Rasm+Yo%27q';

        movieEl.innerHTML = `
            <img src="${poster}" alt="${title}">
            <div class="movie-info">
               <h3>${title}</h3>
               <span class="orange">${vote_average ? vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <span class="date">${release_date || 'N/A'}</span>
        `;

        appendContainer.appendChild(movieEl);
    });
}

getMovies(currentUrl, currentPage);

searchInput.addEventListener('input', (e) => {
    let searchTerm = e.target.value.trim();
    currentPage = 1;
    pageTitle.textContent = currentPage;

    if (searchTerm !== '') {
        getMovies(`${tokenSearch}${searchTerm}`, currentPage);
    } else {
        getMovies(currentUrl, currentPage);
    }
});

filterBtn.addEventListener('click', () => {
    filterAndShowMovies();
});

categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let value = e.target.value;
        currentPage = 1;
        pageTitle.textContent = currentPage;
        searchInput.value = '';

        if (value === 'top_rated') {
            currentUrl = tokenTop;
        } else if (value === 'popular') {
            currentUrl = tokenPopular;
        } else if (value === 'upcoming') {
            currentUrl = tokenUpComing;
        }

        getMovies(currentUrl, currentPage);
    });
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    pageTitle.textContent = currentPage;
    
    let searchTerm = searchInput.value.trim();
    if (searchTerm !== '') {
        getMovies(`${tokenSearch}${searchTerm}`, currentPage);
    } else {
        getMovies(currentUrl, currentPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        pageTitle.textContent = currentPage;
        
        let searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            getMovies(`${tokenSearch}${searchTerm}`, currentPage);
        } else {
            getMovies(currentUrl, currentPage);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});