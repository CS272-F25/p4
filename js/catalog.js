const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

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

function updateCartCount() {
    const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const cartCount = cartItems.length;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function showLoading(show) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
}

async function fetchMovies(page = 1, genreId = 'all') {
    try {
        if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
            return getDemoMoviesData();
        }

        const endpoint = genreId === 'all' 
            ? `movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
            : `discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`;

        const response = await fetch(`${TMDB_BASE_URL}/${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return {
            results: data.results || [],
            totalPages: data.total_pages || 1,
            page: data.page || 1
        };
    } catch (error) {
        console.error('Error fetching movies:', error);
        return getDemoMoviesData();
    }
}

function getDemoMoviesData() {
    const demoMovies = [
        { id: 1, title: 'The Matrix', release_date: '1999-03-31', vote_average: 8.7, overview: 'A computer hacker learns about the true nature of reality.', poster_path: null },
        { id: 2, title: 'Pulp Fiction', release_date: '1994-10-14', vote_average: 8.9, overview: 'The lives of two mob hitmen, a boxer, and more intertwine.', poster_path: null },
        { id: 3, title: 'The Shawshank Redemption', release_date: '1994-09-23', vote_average: 9.3, overview: 'Two imprisoned men bond over a number of years.', poster_path: null },
        { id: 4, title: 'Inception', release_date: '2010-07-16', vote_average: 8.8, overview: 'A skilled thief enters people\'s dreams to steal secrets.', poster_path: null },
        { id: 5, title: 'Interstellar', release_date: '2014-11-07', vote_average: 8.6, overview: 'A team of explorers travel through a wormhole in space.', poster_path: null },
        { id: 6, title: 'Fight Club', release_date: '1999-10-15', vote_average: 8.8, overview: 'An insomniac office worker starts an underground fight club.', poster_path: null },
        { id: 7, title: 'The Dark Knight', release_date: '2008-07-18', vote_average: 9.0, overview: 'Batman faces the Joker in this epic crime thriller.', poster_path: null },
        { id: 8, title: 'Forrest Gump', release_date: '1994-07-06', vote_average: 8.8, overview: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.', poster_path: null },
        { id: 9, title: 'Goodfellas', release_date: '1990-09-21', vote_average: 8.7, overview: 'The story of Henry Hill and his life in the mob.', poster_path: null },
        { id: 10, title: 'The Godfather', release_date: '1972-03-24', vote_average: 9.2, overview: 'The aging patriarch of an organized crime dynasty transfers control to his son.', poster_path: null },
        { id: 11, title: 'Parasite', release_date: '2019-10-11', vote_average: 8.5, overview: 'A poor family schemes to become employed by a wealthy family.', poster_path: null },
        { id: 12, title: 'Whiplash', release_date: '2014-10-15', vote_average: 8.5, overview: 'A promising young drummer enrolls at a cut-throat music conservatory.', poster_path: null },
        { id: 13, title: 'The Prestige', release_date: '2006-10-20', vote_average: 8.5, overview: 'Two stage magicians engage in competitive one-upmanship.', poster_path: null },
        { id: 14, title: 'Django Unchained', release_date: '2012-12-25', vote_average: 8.4, overview: 'A freed slave teams up with a bounty hunter to rescue his wife.', poster_path: null },
        { id: 15, title: 'The Departed', release_date: '2006-10-06', vote_average: 8.5, overview: 'An undercover cop and a mob informant both try to identify each other.', poster_path: null },
        { id: 16, title: 'Gladiator', release_date: '2000-05-05', vote_average: 8.5, overview: 'A former Roman General seeks justice for his murdered family.', poster_path: null },
        { id: 17, title: 'The Lord of the Rings: The Return of the King', release_date: '2003-12-17', vote_average: 8.9, overview: 'Gandalf and Aragorn lead the World of Men against Sauron.', poster_path: null },
        { id: 18, title: 'The Green Mile', release_date: '1999-12-10', vote_average: 8.6, overview: 'The lives of guards on Death Row are affected by one of their charges.', poster_path: null },
        { id: 19, title: 'Se7en', release_date: '1995-09-22', vote_average: 8.6, overview: 'Two detectives hunt a serial killer who uses the seven deadly sins.', poster_path: null },
        { id: 20, title: 'The Lion King', release_date: '1994-06-24', vote_average: 8.5, overview: 'Lion prince Simba must overcome betrayal and tragedy to assume his rightful place.', poster_path: null }
    ];
    
    return {
        results: demoMovies,
        totalPages: 1,
        page: 1
    };
}

function createMovieCard(movie) {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.setAttribute('role', 'listitem');
    
    const posterUrl = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
    
    const releaseYear = movie.release_date 
        ? new Date(movie.release_date).getFullYear()
        : 'Unknown';
    
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
            <p class="movie-rating">⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}</p>
            <p class="movie-overview">${movie.overview?.substring(0, 120) || 'No description available'}...</p>
            <button class="btn-add-to-cart" 
                    data-movie-id="${movie.id}" 
                    data-movie-title="${movie.title}"
                    aria-label="Add ${movie.title} to cart">
                Add to Cart
            </button>
        </div>
    `;
    const addToCartBtn = card.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(movie);
        });
    }
    
    return card;
}

function addToCart(movie) {
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    
    const existingIndex = cart.findIndex(item => item.id === movie.id);
    if (existingIndex === -1) {
        cart.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            price: 4.99
        });
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${movie.title} added to cart!`);
    } else {
        showNotification(`${movie.title} is already in your cart.`);
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function filterMovies() {
    filteredMovies = allMovies.filter(movie => {
        if (searchQuery) {
            const titleMatch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
            if (!titleMatch) return false;
        }
        
        if (selectedYear) {
            const movieYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
            if (movieYear !== parseInt(selectedYear)) return false;
        }
        
        if (minRating) {
            if (!movie.vote_average || movie.vote_average < parseFloat(minRating)) {
                return false;
            }
        }
        
        return true;
    });
    sortMovies();
    displayMovies(filteredMovies);
}

function sortMovies() {
    switch (sortBy) {
        case 'rating':
            filteredMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
            break;
        case 'title':
            filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'year-desc':
            filteredMovies.sort((a, b) => {
                const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
                const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
                return yearB - yearA;
            });
            break;
        case 'year-asc':
            filteredMovies.sort((a, b) => {
                const yearA = a.release_date ? new Date(a.release_date).getFullYear() : 0;
                const yearB = b.release_date ? new Date(b.release_date).getFullYear() : 0;
                return yearA - yearB;
            });
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
    } else {
        emptyState.style.display = 'none';
        moviesGrid.style.display = 'grid';
        
        movies.forEach(movie => {
            const card = createMovieCard(movie);
            moviesGrid.appendChild(card);
        });
    }
}

async function loadMovies() {
    showLoading(true);
    
    try {
        const data = await fetchMovies(currentPage, currentGenre);
        allMovies = data.results;
        filteredMovies = [...allMovies];
        
        const genreName = genreNames[currentGenre] || 'All Genres';
        const selectedGenreDiv = document.getElementById('selected-genre');
        if (selectedGenreDiv) {
            selectedGenreDiv.textContent = `Showing: ${genreName}`;
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
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            filterMovies();
        });
    }
    
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) {
                searchQuery = searchInput.value.trim();
                filterMovies();
            }
        });
    }
    
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchQuery = '';
            selectedYear = '';
            minRating = '';
            sortBy = 'popularity';
            currentGenre = 'all';
            currentPage = 1;
            
            genreButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
                if (btn.getAttribute('data-genre') === 'all') {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                }
            });
            
            if (searchInput) searchInput.value = '';
            if (yearFilter) yearFilter.value = '';
            if (ratingFilter) ratingFilter.value = '';
            if (sortFilter) sortFilter.value = 'popularity';
            
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
    updateCartCount();
    initEventListeners();
    loadMovies();
});
