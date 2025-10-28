// assets/theme.js (vanilla JS)
document.addEventListener('DOMContentLoaded', function () {
  // Add to cart handler (AJAX)
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', function () {
      const variantId = this.getAttribute('data-product-id');
      if (!variantId) return;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
      .then(r => r.json())
      .then(() => {
        // simple UI feedback
        btn.textContent = 'Added';
        setTimeout(()=> btn.textContent = 'Add to cart', 1500);
      })
      .catch(()=> alert('Error adding to cart'));
    });
  });

  // Buy now: add and redirect to checkout
  document.querySelectorAll('[data-buy-now]').forEach(btn => {
    btn.addEventListener('click', function () {
      const productId = this.getAttribute('data-product-id');
      if (!productId) return;
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, quantity: 1 })
      })
      .then(() => window.location.href = '/checkout')
      .catch(()=> alert('Error with buy now'));
    });
  });

  // Simple testimonial carousel
  document.querySelectorAll('.testimonial-track').forEach(track => {
    const items = Array.from(track.querySelectorAll('.testimonial-item'));
    if (!items.length) return;
    let idx = 0;
    const showIndex = (i) => {
      items.forEach((it, n) => {
        it.style.display = n === i ? 'block' : 'none';
      });
      const container = track.closest('section');
      container.querySelectorAll('.carousel-dots .dot').forEach((d, n) => {
        d.classList.toggle('bg-black', n === i);
      });
    };
    showIndex(0);

    const nextBtn = track.closest('section').querySelector('.carousel-arrow.next');
    const prevBtn = track.closest('section').querySelector('.carousel-arrow.prev');
    nextBtn && nextBtn.addEventListener('click', () => { idx = (idx+1) % items.length; showIndex(idx); });
    prevBtn && prevBtn.addEventListener('click', () => { idx = (idx-1 + items.length) % items.length; showIndex(idx); });
    track.closest('section').querySelectorAll('.carousel-dots .dot').forEach((dot, n) => {
      dot.addEventListener('click', () => { idx = n; showIndex(n); });
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', function () {
      const panel = this.closest('.faq-item').querySelector('.faq-panel');
      const chevron = this.querySelector('.faq-chevron');
      if (!panel) return;
      const isHidden = panel.classList.contains('hidden');
      if (isHidden) {
        panel.classList.remove('hidden');
        chevron.textContent = '-';
      } else {
        panel.classList.add('hidden');
        chevron.textContent = '+';
      }
    });
  });

  // Countdown timers
  document.querySelectorAll('[id^="promo-countdown-"]').forEach(el => {
    const end = el.dataset.endtime;
    if (!end) return;
    const endDate = new Date(end);
    const update = () => {
      const now = new Date();
      const diff = Math.max(0, endDate - now);
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff / (1000*60*60)) % 24);
      const mins = Math.floor((diff / (1000*60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      el.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
      if (diff <= 0) clearInterval(interval);
    };
    update();
    const interval = setInterval(update, 1000);
  });
});
