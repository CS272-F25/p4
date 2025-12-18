const featuredMovies = [
    {
        title: 'The Matrix',
        year: 1999,
        youtubeId: 'vKQi3bBA1y8',
        poster: '/kgrLpJcLBbyhWIkK7fx1fom4S6s.jpg',
        overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
    },
    {
        title: 'Blade Runner',
        year: 1982,
        youtubeId: 'eogpIG53Cis',
        poster: '/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
        overview: 'A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.'
    },
    {
        title: 'Pulp Fiction',
        year: 1994,
        youtubeId: 's7EdQ4FqbhY',
        poster: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
    },
    {
        title: 'The Godfather',
        year: 1972,
        youtubeId: 'UaVTIH8mujA',
        poster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
    },
    {
        title: 'Star Wars',
        year: 1977,
        youtubeId: 'vZ734NWnAHA',
        poster: '/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
        overview: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station.'
    },
    {
        title: 'Back to the Future',
        year: 1985,
        youtubeId: 'qvsgGtivCgs',
        poster: '/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
        overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend.'
    },
    {
        title: 'The Terminator',
        year: 1984,
        youtubeId: 'k64P4l2Wmeg',
        poster: '/qvktm0BHcnmDpul4Hz01GIazWPr.jpg',
        overview: 'A human soldier is sent from 2029 to 1984 to stop an almost indestructible cyborg killing machine from assassinating a young woman.'
    }
];

let currentMovieIndex = 0;
let tvIsOn = false;

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function initRetroTV() {
    const powerBtn = document.getElementById('tv-power-btn');
    const tvScreen = document.getElementById('tv-screen');
    const tvStatic = document.getElementById('tv-static');
    const prevBtn = document.getElementById('prev-movie-btn');
    const nextBtn = document.getElementById('rent-movie-btn');
    const changeMovie = (delta) => {
        currentMovieIndex = (currentMovieIndex + delta + featuredMovies.length) % featuredMovies.length;
        loadMovieOnTV(currentMovieIndex);
    };
    
    const setPowerState = (on) => {
        if (!powerBtn || !tvScreen) return;

        if (!on) {
            tvScreen.classList.add('shutting-down');
            tvScreen.classList.remove('on');
            powerBtn.classList.remove('on');
            powerBtn.innerHTML = '<span class="power-indicator"></span>OFF';

            stopTV();
            stopAutoRotate();

            setTimeout(() => {
                tvScreen.classList.remove('shutting-down');
                if (tvStatic) tvStatic.style.display = 'block';
            }, 1500);

            tvIsOn = false;
            return;
        }

        tvScreen.classList.remove('shutting-down');
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
            if (!tvIsOn) return;
            const indicator = channelDial.querySelector('.dial-indicator');
            if (indicator) {
                const current = parseInt(indicator.textContent, 10) || 0;
                indicator.textContent = ((current % 5) + 1).toString();
            }
            changeMovie(1);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!tvIsOn) return;
            changeMovie(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!tvIsOn) return;
            changeMovie(1);
        });
    }
    
    let autoRotateInterval = null;
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            if (tvIsOn && document.visibilityState === 'visible') {
                changeMovie(1);
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
    initRetroTV();
});
