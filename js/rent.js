function getCartItems() {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function displayRentMovies() {
    const cartItems = getCartItems();
    const moviesContainer = document.getElementById('rent-movies');
    const noMoviesMessage = document.getElementById('no-movies-message');
    
    if (!moviesContainer || !noMoviesMessage) return;
    
    moviesContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        moviesContainer.style.display = 'none';
        noMoviesMessage.style.display = 'block';
        return;
    }
    
    moviesContainer.style.display = 'grid';
    noMoviesMessage.style.display = 'none';
    

    cartItems.forEach(item => {
        const movieCard = document.createElement('div');
        movieCard.className = 'rent-movie-card';
        
        const posterUrl = item.poster_path 
            ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
            : 'https://via.placeholder.com/200x300/333333/ffffff?text=No+Image';
        
        const price = 1;
        
        movieCard.innerHTML = `
            <picture class="rent-movie-poster">
                <img src="${posterUrl}" 
                     alt="${item.title} poster" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/200x300/333333/ffffff?text=No+Image'">
            </picture>
            <div class="rent-movie-info">
                <h3 class="rent-movie-title">${item.title}</h3>
                <p class="rent-movie-price">$${price.toFixed(2)}</p>
            </div>
        `;
        
        moviesContainer.appendChild(movieCard);
    });
}

function handleCheckout() {
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    window.location.href = 'rent.html';
}

function initFormListeners() {
    const form = document.getElementById('rental-form');
    if (!form) return;
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation on blur
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    // Update price display
    updatePrice();
}

function updatePrice() {
    const periodSelect = document.getElementById('rentPeriod');
    const priceDisplay = document.getElementById('price-display');
    
    if (periodSelect && priceDisplay) {
        periodSelect.addEventListener('change', (e) => {
            const period = e.target.value;
            const prices = {
                '1': '$1',
                '2': '$2',
                '4': '$4',
                '10': '$10'
            };
            priceDisplay.textContent = prices[period] || '';
        });
    }
}

function updateCartCount() {
    const cartItems = getCartItems();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length;
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${field.labels[0].textContent.replace('*', '').trim()} is required.`;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (fieldName === 'phoneNumber' && value) {
        const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter phone in format: 123-456-7890';
        }
    }
    
    // Date validation 
    if (fieldName === 'dateRented' && value) {
        const dateRegex = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
        if (!dateRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter date in format: mm/dd/yyyy';
        }
    }
    
    // Update error display
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = isValid ? 'none' : 'block';
    }
    
    // Update field styling
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
    }
    
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    // console.log(fields);

    let isFormValid = true;
    
    // Validate all required fields
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    if (isFormValid) {
        // Get cart items
        const cartItems = getCartItems();
        
        if (cartItems.length === 0) {
            showNotification('Please add movies to cart first!');
            return;
        }
        
        // Get form data
        const formData = new FormData(form);
        const rentalData = {};
        
        for (const [key, value] of formData.entries()) {
            rentalData[key] = value;
        }
        
        // Add movies and total to rental data
        rentalData.movies = cartItems;
        rentalData.total = cartItems.reduce((sum, item) => sum + (1), 0);
        
        // Add to rental history
        addToRentalHistory(rentalData);
        
        // Clear cart
        sessionStorage.removeItem('cart');
        updateCartCount();
        displayRentMovies();
        
        // Reset form
        form.reset()
        
        // Remove validation classes
        form.querySelectorAll('.error, .valid').forEach(el => {
            el.classList.remove('error', 'valid');
        });
        
        // Clear error messages
        form.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    } else {
        // Focus on first invalid field
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function getRentalHistory() {
    const history = localStorage.getItem('rentalHistory');
    return history ? JSON.parse(history) : [];
}

function saveRentalHistory(history) {
    localStorage.setItem('rentalHistory', JSON.stringify(history));
}

function addToRentalHistory(rentalData) {
    const history = getRentalHistory();
    const newRental = {
        id: Date.now(),
        ...rentalData,
        date: new Date().toISOString()
    };
    history.unshift(newRental); // Add to beginning
    saveRentalHistory(history);
    displayRentalHistory();
}

function displayRentalHistory() {
    const history = getRentalHistory();
    const historyContainer = document.getElementById('rental-history');
    
    if (!historyContainer) return;
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="empty-history">No rental history yet. Complete a rental to see it here!</p>';
        return;
    }
    
    historyContainer.innerHTML = '';
    
    history.slice(0, 5).forEach(rental => {
        const receiptCard = document.createElement('article');
        receiptCard.className = 'rental-receipt';
        receiptCard.setAttribute('role', 'listitem');
        
        // Get movies for this rental
        const movies = rental.movies || [];
        
        let moviesHTML = '';
        if (movies.length > 0) {
            moviesHTML = '<div class="receipt-movies">';
            movies.forEach(movie => {
                const posterUrl = movie.poster_path 
                    ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
                    : 'https://via.placeholder.com/80x120/333333/ffffff?text=No+Image';
                
                moviesHTML += `
                    <div class="receipt-movie-item">
                        <picture class="receipt-movie-poster">
                            <img src="${posterUrl}" 
                                 alt="${movie.title} poster" 
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/80x120/333333/ffffff?text=No+Image'">
                        </picture>
                        <div class="receipt-movie-details">
                            <p class="receipt-movie-title">${movie.title}</p>
                            <p class="receipt-movie-price">$${(1).toFixed(2)}</p>
                        </div>
                    </div>
                `;
            });
            moviesHTML += '</div>';
        }
        
        const total = movies.reduce((sum, m) => sum + (1), 0);
        // console.log(rental);
        
        receiptCard.innerHTML = `
            <div class="receipt-header">
                <div class="receipt-title-section">
                    <h3>RENTAL RECEIPT</h3>
                </div>
            </div>
            <div class="receipt-divider"></div>
            ${moviesHTML}
            <div class="receipt-customer-info">
                <p><strong>Email:</strong> ${rental.email}</p>
                ${rental.phoneNumber ? `<p><strong>Phone:</strong> ${rental.phoneNumber}</p>` : ''}
                <p><strong>Rental Period:</strong> ${rental['rentPeriod']} Days</p>
                <p><strong>Start Date:</strong> ${rental.dateRented}</p>
                <p><strong>Payment Method:</strong> ${rental['paymentMethod']}</p>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-total">
                <p class="receipt-total-label">TOTAL</p>
                <p class="receipt-total-amount">$${total.toFixed(2)}</p>
            </div>
        `;
        
        historyContainer.appendChild(receiptCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initFormListeners();
    displayRentMovies();
    displayRentalHistory();
});
