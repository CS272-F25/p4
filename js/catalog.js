const TMDB_API_KEY =
    (typeof window !== 'undefined' && window.__TMDB_API_KEY__) || '250cb10ecc022215191b2dd53fda1894';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

let currentPage = 1;
let allMovies = [];
let filteredMovies = [];
let searchQuery = '';
let selectedYear = '';
let minRating = '';
let sortBy = 'popularity';
let currentGenre = 'all';

const genreNames = {
    '28': 'Action',
    '35': 'Comedy',
    '18': 'Drama',
    '27': 'Horror',
    '878': 'Sci-Fi',
    '53': 'Thriller',
    '10749': 'Romance',
    '16': 'Animation',
    '80': 'Crime',
    'all': 'All Genres'
};

function showLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
}

function setEmptyStateMessage(message) {
    const emptyState = document.getElementById('empty-state');
    if (!emptyState) return;
    const messageNode = emptyState.querySelector('p');
    if (messageNode) messageNode.textContent = message;
}

async function fetchMovies(page = 1, genreId = 'all') {
    try {
        const apiKey = (TMDB_API_KEY || '').trim();
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            return { results: [], error: 'auth_failed' };
        }

        const params = new URLSearchParams({
            api_key: apiKey,
            language: 'en-US',
            include_adult: 'false',
            sort_by: 'popularity.desc',
            'vote_count.gte': '300',
            'primary_release_date.lte': '2005-12-31',
            page: page.toString()
        });

        if (genreId !== 'all') {
            params.append('with_genres', genreId);
        }

        const targetUrl = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
        const proxyUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;

        const response = await fetch(proxyUrl, { headers: { accept: 'application/json' } });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.success === false) {
            return { results: [], error: 'auth_failed' };
        }

        return { results: data.results || [] };
    } catch (error) {
        console.error('Error fetching movies:', error);
        return { results: [], error: 'fetch_failed' };
    }
}

function createMovieCard(movie) {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.setAttribute('role', 'listitem');

    const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';

    card.innerHTML = `
        <picture>
            <img src="${posterUrl}" 
                 alt="${movie.title} poster" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x450/333333/ffffff?text=No+Image'">
        </picture>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-year">${releaseYear}</p>
            <p class="movie-rating">★ ${movie.vote_average?.toFixed(1) || 'N/A'}</p>
            <p class="movie-overview">${movie.overview?.substring(0, 120) || 'No description available'}...</p>
            <button class="btn-add-to-cart" aria-label="Add ${movie.title} to cart">Add to Cart</button>
        </div>
    `;

    const addToCartBtn = card.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => addToCart(movie));
    }

    return card;
}

function addToCart(movie) {
    addMovieToCart({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
    });
}

function filterMovies() {
    const query = searchQuery.toLowerCase();
    const year = selectedYear ? Number(selectedYear) : null;
    const rating = minRating ? Number(minRating) : null;

    filteredMovies = allMovies.filter(movie => {
        if (query && !movie.title.toLowerCase().includes(query)) return false;
        if (year) {
            const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
            if (movieYear !== year) return false;
        }
        if (rating !== null && (movie.vote_average || 0) < rating) return false;
        return true;
    });

    sortMovies();
    displayMovies(filteredMovies);
}

function sortMovies() {
    const getYear = (movie) => (movie.release_date ? new Date(movie.release_date).getFullYear() : 0);

    switch (sortBy) {
        case 'rating':
            filteredMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
            break;
        case 'title':
            filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'year-desc':
            filteredMovies.sort((a, b) => getYear(b) - getYear(a));
            break;
        case 'year-asc':
            filteredMovies.sort((a, b) => getYear(a) - getYear(b));
            break;
        case 'popularity':
        default:
            break;
    }
}

function displayMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');
    const emptyState = document.getElementById('empty-state');
    if (!moviesGrid || !emptyState) return;

    moviesGrid.innerHTML = '';

    if (movies.length === 0) {
        emptyState.style.display = 'block';
        moviesGrid.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    moviesGrid.style.display = 'grid';
    movies.forEach(movie => moviesGrid.appendChild(createMovieCard(movie)));
}

async function loadMovies() {
    showLoading(true);

    try {
        setEmptyStateMessage('No movies found. Try adjusting your search or filters.');
        const data = await fetchMovies(currentPage, currentGenre);

        if (data.error === 'auth_failed') {
            setEmptyStateMessage('TMDB API key missing or invalid. Add it in catalog.js.');
        } else if (data.error === 'fetch_failed') {
            setEmptyStateMessage('Unable to load movies from TMDB right now. Please try again.');
        }

        allMovies = data.results;

        const selectedGenreDiv = document.getElementById('selected-genre');
        if (selectedGenreDiv) {
            selectedGenreDiv.textContent = `Showing: ${genreNames[currentGenre] || 'All Genres'}`;
        }

        filterMovies();
    } catch (error) {
        console.error('Error loading movies:', error);
        showNotification('Error loading movies. Please try again later.');
    } finally {
        showLoading(false);
    }
}

function initEventListeners() {
    const searchInput = document.getElementById('movie-search');
    const genreButtons = document.querySelectorAll('.genre-btn');
    const yearFilter = document.getElementById('year-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const sortFilter = document.getElementById('sort-filter');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const clearSearchBtn = document.getElementById('clear-search-btn');

    const resetFilters = () => {
        searchQuery = '';
        selectedYear = '';
        minRating = '';
        sortBy = 'popularity';
        currentGenre = 'all';
        currentPage = 1;

        genreButtons.forEach(btn => {
            const isAll = btn.getAttribute('data-genre') === 'all';
            btn.classList.toggle('active', isAll);
            btn.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        });

        if (searchInput) searchInput.value = '';
        if (yearFilter) yearFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';
        if (sortFilter) sortFilter.value = 'popularity';
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            filterMovies();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            resetFilters();
            loadMovies();
        });
    }

    genreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            genreButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            currentGenre = btn.getAttribute('data-genre');
            currentPage = 1;
            loadMovies();
        });
    });

    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            selectedYear = e.target.value;
            filterMovies();
        });
    }

    if (ratingFilter) {
        ratingFilter.addEventListener('change', (e) => {
            minRating = e.target.value;
            filterMovies();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            sortBy = e.target.value;
            filterMovies();
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                loadMovies();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            currentPage++;
            loadMovies();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadMovies();
});
