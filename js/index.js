const featuredMovies = [
    {
        id: 1,
        title: 'The Matrix',
        year: 1999,
        youtubeId: 'vKQi3bBA1y8',
        poster: '/kgrLpJcLBbyhWIkK7fx1fom4S6s.jpg',
        overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
    },
    {
        id: 2,
        title: 'Blade Runner',
        year: 1982,
        youtubeId: 'eogpIG53Cis',
        poster: '/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
        overview: 'A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.'
    },
    {
        id: 3,
        title: 'Pulp Fiction',
        year: 1994,
        youtubeId: 's7EdQ4FqbhY',
        poster: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
    },
    {
        id: 4,
        title: 'The Godfather',
        year: 1972,
        youtubeId: 'UaVTIH8mujA',
        poster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
    },
    {
        id: 5,
        title: 'Star Wars',
        year: 1977,
        youtubeId: 'vZ734NWnAHA',
        poster: '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
        overview: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station.'
    },
    {
        id: 6,
        title: 'Back to the Future',
        year: 1985,
        youtubeId: 'qvsgGtivCgs',
        poster: '/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
        overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend.'
    },
    {
        id: 7,
        title: 'The Terminator',
        year: 1984,
        youtubeId: 'k64P4l2Wmeg',
        poster: '/qvktm0BHcnmDpul4Hz01GIazWPr.jpg',
        overview: 'A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine from assassinating a young woman.'
    }
];

let currentMovieIndex = 0;
let tvIsOn = false;
let currentChannel = 3;

const TMDB_API_KEY = 'YOUR_API_KEY_HERE';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function updateCartCount() {
    const cartItems = JSON.parse(sessionStorage.getItem('cart') || '[]');
    const cartCount = cartItems.length;
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

async function fetchMovies(endpoint) {
    try {
        if (TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
            return getDemoMovies();
        }

        const response = await fetch(
            `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return getDemoMovies();
    }
}

function getDemoMovies() {
    return [
        {
            id: 1,
            title: 'The Matrix',
            poster_path: null,
            overview: 'A computer hacker learns about the true nature of reality.',
            release_date: '1999-03-31',
            vote_average: 8.7
        },
        {
            id: 2,
            title: 'Pulp Fiction',
            poster_path: null,
            overview: 'The lives of two mob hitmen, a boxer, and more intertwine.',
            release_date: '1994-10-14',
            vote_average: 8.9
        },
        {
            id: 3,
            title: 'The Shawshank Redemption',
            poster_path: null,
            overview: 'Two imprisoned men bond over a number of years.',
            release_date: '1994-09-23',
            vote_average: 9.3
        },
        {
            id: 4,
            title: 'Inception',
            poster_path: null,
            overview: 'A skilled thief enters people\'s dreams to steal secrets.',
            release_date: '2010-07-16',
            vote_average: 8.8
        },
        {
            id: 5,
            title: 'Interstellar',
            poster_path: null,
            overview: 'A team of explorers travel through a wormhole in space.',
            release_date: '2014-11-07',
            vote_average: 8.6
        },
        {
            id: 6,
            title: 'Fight Club',
            poster_path: null,
            overview: 'An insomniac office worker starts an underground fight club.',
            release_date: '1999-10-15',
            vote_average: 8.8
        }
    ];
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
            <p class="movie-overview">${movie.overview?.substring(0, 100)}...</p>
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

    if (cart.some(item => item.id === movie.id)) {
        showNotification(`${movie.title} is already in your cart.`);
        return;
    }

    cart.push({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        price: 4.99
    });
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${movie.title} added to cart!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => notification.classList.add('show'));
    setTimeout(() => notification.classList.remove('show'), 3000);
    setTimeout(() => notification.remove(), 3300);
}

async function renderMoviesSection(containerId, endpoint) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const movies = (await fetchMovies(endpoint)).slice(0, 6);
    const fragment = document.createDocumentFragment();
    movies.forEach(movie => fragment.appendChild(createMovieCard(movie)));
    container.replaceChildren(fragment);
}

function initRetroTV() {
    const powerBtn = document.getElementById('tv-power-btn');
    const tvScreen = document.getElementById('tv-screen');
    const tvStatic = document.getElementById('tv-static');
    const prevBtn = document.getElementById('prev-movie-btn');
    const nextBtn = document.getElementById('next-movie-btn');
    const shutdownMessage = document.getElementById('tv-shutdown-message');
    
    const setPowerState = (on) => {
        if (!powerBtn || !tvScreen) return;

        if (!on) {
            tvScreen.classList.add('shutting-down');
            tvScreen.classList.remove('on');
            powerBtn.classList.remove('on');
            powerBtn.innerHTML = '<span class="power-indicator"></span>OFF';
            if (shutdownMessage) shutdownMessage.classList.add('show');

            stopTV();
            stopAutoRotate();

            setTimeout(() => {
                tvScreen.classList.remove('shutting-down');
                if (shutdownMessage) shutdownMessage.classList.remove('show');
                if (tvStatic) tvStatic.style.display = 'block';
            }, 1500);

            tvIsOn = false;
            return;
        }

        tvScreen.classList.remove('shutting-down');
        if (shutdownMessage) shutdownMessage.classList.remove('show');
        tvScreen.classList.add('on');
        powerBtn.classList.add('on');
        powerBtn.innerHTML = '<span class="power-indicator"></span>ON';

            setTimeout(() => {
                if (tvStatic) tvStatic.style.display = 'none';
                loadMovieOnTV(currentMovieIndex);
                startAutoRotate();
            }, 1000);

        tvIsOn = true;
    };

    if (powerBtn) {
        powerBtn.addEventListener('click', () => setPowerState(!tvIsOn));
    }
    
    const channelDial = document.querySelector('.channel-dial');
    if (channelDial) {
        channelDial.addEventListener('click', () => {
            if (tvIsOn) {
                currentChannel = (currentChannel % 5) + 1;
                channelDial.querySelector('.dial-indicator').textContent = currentChannel;
                currentMovieIndex = (currentMovieIndex + 1) % featuredMovies.length;
                loadMovieOnTV(currentMovieIndex);
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (tvIsOn) {
                currentMovieIndex = (currentMovieIndex - 1 + featuredMovies.length) % featuredMovies.length;
                loadMovieOnTV(currentMovieIndex);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (tvIsOn) {
                currentMovieIndex = (currentMovieIndex + 1) % featuredMovies.length;
                loadMovieOnTV(currentMovieIndex);
            }
        });
    }
    
    let autoRotateInterval = null;
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            if (tvIsOn && document.visibilityState === 'visible') {
                currentMovieIndex = (currentMovieIndex + 1) % featuredMovies.length;
                loadMovieOnTV(currentMovieIndex);
            }
        }, 45000);
    }
    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }
    
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            stopAutoRotate();
        } else if (tvIsOn) {
            startAutoRotate();
        }
    });
}

/**
 * Creates YouTube iframe dynamically (lazy loading)
 * @returns {HTMLElement} YouTube iframe element
 */
function createYouTubeIframe() {
    const placeholder = document.getElementById('youtube-iframe-placeholder');
    if (!placeholder) return null;
    
    let iframe = document.getElementById('youtube-iframe');
    if (iframe) return iframe;
    
    iframe = document.createElement('iframe');
    iframe.id = 'youtube-iframe';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.display = 'none';
    
    placeholder.appendChild(iframe);
    return iframe;
}

/**
 * Loads a movie on the TV screen
 * @param {number} index - Index of movie in featuredMovies array
 */
function loadMovieOnTV(index) {
    const movie = featuredMovies[index];
    const posterDisplay = document.getElementById('tv-poster-display');
    const posterImg = document.getElementById('tv-poster-img');
    const movieTitle = document.getElementById('tv-movie-title');
    const movieDescription = document.getElementById('tv-movie-description');
    
    if (!movie) return;
    
    requestAnimationFrame(() => {
        if (movieTitle) {
            movieTitle.textContent = `${movie.title} (${movie.year})`;
        }
        if (movieDescription) {
            movieDescription.textContent = movie.overview || 'Watch now on CineRewind!';
        }
        
        const tvStatic = document.getElementById('tv-static');
        if (tvStatic) {
            tvStatic.style.display = 'block';
        }
        
        setTimeout(() => {
            if (tvStatic) {
                tvStatic.style.display = 'none';
            }

            const iframe = movie.youtubeId && tvIsOn ? createYouTubeIframe() : null;
            if (iframe) {
                const currentSrc = iframe.src;
                const newSrc = `https://www.youtube.com/embed/${movie.youtubeId}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&enablejsapi=1&origin=${window.location.origin}`;
                if (!currentSrc || !currentSrc.includes(movie.youtubeId)) {
                    iframe.src = newSrc;
                }
                iframe.style.display = 'block';
                iframe.style.zIndex = '3';
                if (posterDisplay) {
                    posterDisplay.style.display = 'none';
                }
                return;
            }

            const youtubeIframe = document.getElementById('youtube-iframe');
            if (youtubeIframe) {
                youtubeIframe.src = '';
                youtubeIframe.style.display = 'none';
            }
            if (posterDisplay && posterImg) {
                const posterUrl = movie.poster 
                    ? `${TMDB_IMAGE_BASE_URL}${movie.poster}`
                    : 'https://via.placeholder.com/640x480/333333/ffffff?text=' + encodeURIComponent(movie.title);
                posterImg.src = posterUrl;
                posterImg.onerror = function() {
                    this.src = 'https://via.placeholder.com/640x480/333333/ffffff?text=' + encodeURIComponent(movie.title);
                };
                posterDisplay.style.display = 'block';
            }
        }, 500);
    });
}

/**
 * Stops TV playback
 */
function stopTV() {
    const youtubeIframe = document.getElementById('youtube-iframe');
    const posterDisplay = document.getElementById('tv-poster-display');
    
    if (youtubeIframe) {
        youtubeIframe.src = '';
        youtubeIframe.style.display = 'none';
        const placeholder = document.getElementById('youtube-iframe-placeholder');
        if (placeholder && youtubeIframe.parentNode === placeholder) {
            placeholder.removeChild(youtubeIframe);
        }
    }
    if (posterDisplay) {
        posterDisplay.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initRetroTV();
    
    requestAnimationFrame(() => {
        renderMoviesSection('featured-movies', 'movie/now_playing');
        setTimeout(() => renderMoviesSection('top-rated-movies', 'movie/top_rated'), 100);
    });
});
