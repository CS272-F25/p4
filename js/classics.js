const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const classicMovies = {
    'all': [
        { id: 238, title: 'The Godfather', year: 1972, era: '1970s', poster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', overview: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.' },
        { id: 278, title: 'The Shawshank Redemption', year: 1994, era: '1990s', poster: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.' },
        { id: 424, title: 'Schindler\'s List', year: 1993, era: '1990s', poster: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', overview: 'In German-occupied Poland, Oskar Schindler gradually becomes concerned for his Jewish workforce.' },
        { id: 240, title: 'The Godfather Part II', year: 1974, era: '1970s', poster: '/hek3koDUyRQk7FhF1oVEeCyBmPS.jpg', overview: 'The early life and career of Vito Corleone in 1920s New York is shown.' },
        { id: 13, title: 'Forrest Gump', year: 1994, era: '1990s', poster: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', overview: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.' },
        { id: 550, title: 'Fight Club', year: 1999, era: '1990s', poster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.' },
        { id: 680, title: 'Pulp Fiction', year: 1994, era: '1990s', poster: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.' },
        { id: 155, title: 'The Dark Knight', year: 2008, era: '1990s', poster: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', overview: 'Batman faces the Joker in this epic crime thriller.' },
        { id: 429, title: 'The Good, the Bad and the Ugly', year: 1966, era: '1960s', poster: '/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg', overview: 'A bounty hunting scam joins two men in an uneasy alliance against a third.' },
        { id: 11216, title: 'Cinema Paradiso', year: 1988, era: '1980s', poster: '/8SRUfRUi6x4O68n0VCbDNRa6iGL.jpg', overview: 'A filmmaker recalls his childhood when falling in love with the pictures at the cinema.' },
        { id: 346, title: 'Seven Samurai', year: 1954, era: '1950s', poster: '/8OKmBV5BUFzmozIC3pPWKCr17kg.jpg', overview: 'A poor village under attack by bandits recruits seven unemployed samurai.' },
        { id: 15, title: 'Casablanca', year: 1942, era: '1940s', poster: '/5K58Sa3mv4lgj6i2f4l3l1kXitP.jpg', overview: 'A cynical expatriate American cafe owner struggles to decide whether to help his former lover.' }
    ],
    '1940s': [
        { id: 15, title: 'Casablanca', year: 1942, era: '1940s', poster: '/5K58Sa3mv4lgj6i2f4l3l1kXitP.jpg', overview: 'A cynical expatriate American cafe owner struggles to decide whether to help his former lover.' },
        { id: 1422, title: 'The Great Dictator', year: 1940, era: '1940s', poster: '/1M876KPjulVwppEpldhdc8V4o68.jpg', overview: 'Dictator Adenoid Hynkel tries to expand his empire while a poor Jewish barber tries to avoid persecution.' }
    ],
    '1950s': [
        { id: 346, title: 'Seven Samurai', year: 1954, era: '1950s', poster: '/8OKmBV5BUFzmozIC3pPWKCr17kg.jpg', overview: 'A poor village under attack by bandits recruits seven unemployed samurai.' },
        { id: 429, title: 'The Good, the Bad and the Ugly', year: 1966, era: '1960s', poster: '/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg', overview: 'A bounty hunting scam joins two men in an uneasy alliance against a third.' }
    ],
    '1960s': [
        { id: 429, title: 'The Good, the Bad and the Ugly', year: 1966, era: '1960s', poster: '/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg', overview: 'A bounty hunting scam joins two men in an uneasy alliance against a third.' }
    ],
    '1970s': [
        { id: 238, title: 'The Godfather', year: 1972, era: '1970s', poster: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', overview: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.' },
        { id: 240, title: 'The Godfather Part II', year: 1974, era: '1970s', poster: '/hek3koDUyRQk7FhF1oVEeCyBmPS.jpg', overview: 'The early life and career of Vito Corleone in 1920s New York is shown.' }
    ],
    '1980s': [
        { id: 11216, title: 'Cinema Paradiso', year: 1988, era: '1980s', poster: '/8SRUfRUi6x4O68n0VCbDNRa6iGL.jpg', overview: 'A filmmaker recalls his childhood when falling in love with the pictures at the cinema.' }
    ],
    '1990s': [
        { id: 278, title: 'The Shawshank Redemption', year: 1994, era: '1990s', poster: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.' },
        { id: 424, title: 'Schindler\'s List', year: 1993, era: '1990s', poster: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', overview: 'In German-occupied Poland, Oskar Schindler gradually becomes concerned for his Jewish workforce.' },
        { id: 13, title: 'Forrest Gump', year: 1994, era: '1990s', poster: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', overview: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.' },
        { id: 550, title: 'Fight Club', year: 1999, era: '1990s', poster: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club.' },
        { id: 680, title: 'Pulp Fiction', year: 1994, era: '1990s', poster: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine.' }
    ]
};

function createClassicCard(movie) {
    const card = document.createElement('article');
    card.className = 'classic-card';
    card.setAttribute('role', 'listitem');
    
    const posterUrl = movie.poster 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster}`
        : 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
    
    card.innerHTML = `
        <div class="classic-card-inner">
            <picture class="classic-poster">
                <img src="${posterUrl}" 
                     alt="${movie.title} poster" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/300x450/333333/ffffff?text=No+Image'">
                <div class="vhs-label">VHS</div>
            </picture>
            <div class="classic-info">
                <h3 class="classic-title">${movie.title}</h3>
                <p class="classic-year">${movie.year} • ${movie.era}</p>
                <p class="classic-overview">${movie.overview?.substring(0, 120) || 'A timeless classic.'}...</p>
                <button class="btn-add-to-cart" aria-label="Add ${movie.title} to cart">
                    Add to Cart
                </button>
            </div>
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
        poster_path: movie.poster
    });
}

function displayClassics(era = 'all') {
    const classicsGrid = document.getElementById('classics-grid');
    if (!classicsGrid) return;
    
    classicsGrid.innerHTML = '';
    
    (classicMovies[era] || classicMovies['all']).forEach(movie => {
        classicsGrid.appendChild(createClassicCard(movie));
    });
}

function initEraButtons() {
    const eraButtons = document.querySelectorAll('.era-btn');
    eraButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            eraButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            
            displayClassics(btn.getAttribute('data-era'));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initEraButtons();
    displayClassics('all');
});
