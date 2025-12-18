const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const ITEM_PRICE = 1;

function getCartItems() {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
    sessionStorage.setItem('cart', JSON.stringify(items));
    updateCartCount();
}

function removeFromCart(movieId) {
    saveCartItems(getCartItems().filter(item => item.id !== movieId));
    displayCartItems();
    showNotification('Item removed from cart');
}

function createCartItemCard(item) {
    const card = document.createElement('article');
    card.className = 'cart-item';
    card.setAttribute('role', 'listitem');
    
    const posterUrl = item.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
        : 'https://via.placeholder.com/150x225/333333/ffffff?text=No+Image';

    card.innerHTML = `
        <picture class="cart-item-poster">
            <img src="${posterUrl}" 
                 alt="${item.title} poster" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/150x225/333333/ffffff?text=No+Image'">
        </picture>
        <div class="cart-item-info">
            <h3 class="cart-item-title">${item.title}</h3>
            <p class="cart-item-price">$${ITEM_PRICE.toFixed(2)}</p>
        </div>
        <button class="btn-remove" 
                data-movie-id="${item.id}" 
                aria-label="Remove ${item.title} from cart">
            ✕ Remove
        </button>
    `;
    const removeBtn = card.querySelector('.btn-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removeFromCart(item.id));
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
        const disabled = !hasItems;
        checkoutBtn.classList.toggle('disabled', disabled);
        checkoutBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
        checkoutBtn.tabIndex = disabled ? -1 : 0;
    }

    cartItems.forEach(item => {
        const card = createCartItemCard(item);
        cartItemsContainer.appendChild(card);
        cartItemsContainer.appendChild(document.createElement('br'));
    });
    updateCartTotals();
}

function updateCartTotals() {
    const totalElement = document.getElementById('cartTotal');
    if (!totalElement) return;

    const total = getCartItems().length * ITEM_PRICE;
    
    totalElement.textContent = `$${total.toFixed(2)}`;
} 

function handleCheckout(event) {
    if (getCartItems().length > 0) return;
    event.preventDefault();
    showNotification('Your cart is empty!');
}

function initEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    displayCartItems();
});
