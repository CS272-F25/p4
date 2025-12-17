/**
 * Get reviews
 * @returns {Array}
 */
function getReviews() {
  const reviews = localStorage.getItem('movieReviews');
  return reviews ? JSON.parse(reviews) : [];
}

function saveReviews(reviews) {
  localStorage.setItem('movieReviews', JSON.stringify(reviews));
}

function addReview(reviewData) {
  const reviews = getReviews();
  const newReview = Object.assign(
    { id: Date.now(), date: new Date().toISOString() },
    reviewData
  );

  reviews.unshift(newReview);
  saveReviews(reviews);
  displayReviews();
}

function createStarRating(rating) {
  const fullStars = '⭐'.repeat(rating);
  const emptyStars = '☆'.repeat(5 - rating);
  return fullStars + emptyStars;
}

function createReviewCard(review) {
  const card = document.createElement('article');
  card.className = 'review-card';
  card.setAttribute('role', 'listitem');

  const reviewDate = new Date(review.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const rating = parseInt(review.rating) || 5;
  const stars = createStarRating(rating);

  card.innerHTML = `
    <div class="review-card-header">
      <div class="review-meta">
        <h3 class="review-movie-title">${review['movie-title']}</h3>
        ${review['reviewer-name'] ? `<p class="review-reviewer">By ${escapeHtml(review['reviewer-name'])}</p>` : ''}
      </div>
      <div class="review-rating">
        <span class="stars" aria-label="${rating} out of 5 stars">${stars}</span>
        <span class="rating-number">${rating}/5</span>
      </div>
    </div>
    <div class="review-card-body">
      <p class="review-text">${escapeHtml(review['review-text'])}</p>
    </div>
    <div class="review-card-footer">
      <time datetime="${review.date}" class="review-date">${reviewDate}</time>
    </div>
  `;

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function displayReviews() {
  const reviews = getReviews();
  const reviewsContainer = document.getElementById('reviews-container');
  const noReviewsDiv = document.getElementById('no-reviews');

  if (!reviewsContainer || !noReviewsDiv) return;

  reviewsContainer.innerHTML = '';

  if (reviews.length === 0) {
    reviewsContainer.style.display = 'none';
    noReviewsDiv.style.display = 'block';
  } else {
    reviewsContainer.style.display = 'block';
    noReviewsDiv.style.display = 'none';

    const sortedReviews = [...reviews].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedReviews.forEach(review => {
      const card = createReviewCard(review);
      reviewsContainer.appendChild(card);
    });
  }
}

function updateCharCount() {
  const reviewText = document.getElementById('review-text');
  const charCount = document.getElementById('char-count');

  if (reviewText && charCount) {
    reviewText.addEventListener('input', () => {
      const length = reviewText.value.length;
      charCount.textContent = length;

      if (length > 900) {
        charCount.parentElement.style.color = 'var(--retro-orange)';
      } else {
        charCount.parentElement.style.color = '#999';
      }
    });
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const form = document.getElementById('review-form');

  const formData = new FormData(form);
  const reviewData = Object.fromEntries(formData);

  addReview(reviewData);

  form.reset();
  document.getElementById('char-count').textContent = '0';
}

function initFormListeners() {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', handleFormSubmit);

  updateCharCount();

  const ratingInputs = document.getElementsByName('rating');
  ratingInputs.forEach(input => {
    input.addEventListener('change', () => {
      const errorElement = document.getElementById('rating-error');
      if (errorElement) errorElement.textContent = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount(); // assuming you have this defined elsewhere
  initFormListeners();
  displayReviews();
});
