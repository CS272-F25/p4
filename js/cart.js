const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function getCartItems() {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
    sessionStorage.setItem('cart', JSON.stringify(items));
    updateCartCount();
}

function updateCartCount() {
    const cartItems = getCartItems();
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length;
    }
}

function removeFromCart(movieId) {
    const cartItems = getCartItems();
    const updatedCart = cartItems.filter(item => item.id !== movieId);
    saveCartItems(updatedCart);
    displayCartItems();
    showNotification('Item removed from cart');
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

function createCartItemCard(item) {
    const card = document.createElement('article');
    card.className = 'cart-item';
    card.setAttribute('role', 'listitem');
    card.setAttribute('data-movie-id', item.id);
    
    const posterUrl = item.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
        : 'https://via.placeholder.com/150x225/333333/ffffff?text=No+Image';
    
    const price = 1;
    
    card.innerHTML = `
        <picture class="cart-item-poster">
            <img src="${posterUrl}" 
                 alt="${item.title} poster" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/150x225/333333/ffffff?text=No+Image'">
        </picture>
        <div class="cart-item-info">
            <h3 class="cart-item-title">${item.title}</h3>
            <p class="cart-item-price">$${price.toFixed(2)}</p>
        </div>
        <button class="btn-remove" 
                data-movie-id="${item.id}" 
                aria-label="Remove ${item.title} from cart">
            ✕ Remove
        </button>
    `;
    const removeBtn = card.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeFromCart(item.id);
        });
    }
    
    return card;
}

function displayCartItems() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!cartItemsContainer || !emptyCartDiv) return;
    
    cartItemsContainer.innerHTML = '';

    const hasItems = cartItems.length > 0;
    cartItemsContainer.style.display = hasItems ? 'block' : 'none';
    emptyCartDiv.style.display = hasItems ? 'none' : 'block';
    if (checkoutBtn) {
        checkoutBtn.disabled = !hasItems;
    }

    cartItems.forEach(item => {
        const card = createCartItemCard(item);
        cartItemsContainer.appendChild(card);
        cartItemsContainer.appendChild(document.createElement('br'));
    });
    updateCartTotals();
}

function updateCartTotals() {
    const cartItems = getCartItems();
    const totalElement = document.getElementById('cartTotal');
    
    const total = cartItems.reduce((sum, item) => {
        return sum + (1);
    }, 0);
    
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
} 

function handleCheckout() {
    const cartItems = getCartItems();
    
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    window.location.href = 'rent.html';
}

function initEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initEventListeners();
    displayCartItems();
});