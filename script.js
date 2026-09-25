const productData = [
  {
    id: 1,
    name: 'T-shirt Essential',
    category: 'T-shirt',
    color: 'Noir / Blanc',
    price: 19000,
    badge: 'Nouveauté',
    image: 'assets/products/tshirt_essentials.svg'
  },
  {
    id: 2,
    name: 'T-shirt Signature',
    category: 'T-shirt',
    color: 'Blanc / Noir',
    price: 19000,
    badge: 'Best seller',
    image: 'assets/products/tshirt_signature.svg'
  },
  {
    id: 3,
    name: 'T-shirt Noir Luxe',
    category: 'T-shirt',
    color: 'Noir profond',
    price: 21000,
    badge: 'Edition',
    image: 'assets/products/tshirt_luxe.svg'
  },
  {
    id: 4,
    name: 'Pull Hiver',
    category: 'Pull',
    color: 'Noir / Beige',
    price: 35000,
    badge: 'Hiver',
    image: 'assets/products/pull_hiver.svg'
  },
  {
    id: 5,
    name: 'Pull Signature',
    category: 'Pull',
    color: 'Sable / Noir',
    price: 35000,
    badge: 'Classique',
    image: 'assets/products/pull_signature.svg'
  },
  {
    id: 6,
    name: 'Pull Street',
    category: 'Pull',
    color: 'Noir / Gris',
    price: 38000,
    badge: 'Street',
    image: 'assets/products/pull_street.svg'
  },
  {
    id: 7,
    name: 'Short Urbain',
    category: 'Short',
    color: 'Noir / Beige',
    price: 22000,
    badge: 'Urban',
    image: 'assets/products/short_urbain.svg'
  },
  {
    id: 8,
    name: 'Casquette Premium',
    category: 'Casquette',
    color: 'Noir / Blanc',
    price: 17000,
    badge: 'Signature',
    image: 'assets/products/cap_premium.svg'
  }
];

const accessoryData = [
  {
    id: 101,
    name: 'Rolex Submariner',
    category: 'Montres',
    price: 1450000,
    image: 'assets/accessories/watch_rolex.svg',
    art: 'watch'
  },
  {
    id: 102,
    name: 'Ceinture Prada',
    category: 'Ceintures',
    price: 82000,
    image: 'assets/accessories/belt_prada.svg',
    art: 'belt'
  },
  {
    id: 103,
    name: 'Lunettes Boss',
    category: 'Lunettes',
    price: 96000,
    image: 'assets/accessories/glasses_boss.svg',
    art: 'glasses'
  },
  {
    id: 104,
    name: 'Chaussures premium',
    category: 'Accessoires',
    price: 215000,
    image: 'assets/accessories/shoes_premium.svg',
    art: 'shoe'
  },
  {
    id: 105,
    name: 'Chaine en or',
    category: 'Colliers',
    price: 178000,
    image: 'assets/accessories/chain_gold.svg',
    art: 'chain'
  },
  {
    id: 106,
    name: 'Protecteur iPhone',
    category: 'Protection',
    price: 12000,
    image: 'assets/accessories/phone_case.svg',
    art: 'phone'
  }
];

const cart = [];
const currencyFormatter = new Intl.NumberFormat('fr-SN', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0
});

const productGrid = document.getElementById('productGrid');
const accessoryGrid = document.getElementById('accessoryGrid');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

function formatPrice(value) {
  return currencyFormatter.format(value);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 1800);
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderProducts(filter = 'all') {
  const filteredProducts =
    filter === 'all'
      ? productData
      : productData.filter((product) => product.category === filter);

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <span class="tag">${product.badge}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <div class="product-topline">
              <h3 class="product-title">${product.name}</h3>
              <span class="product-price">${formatPrice(product.price)}</span>
            </div>
            <p class="product-meta">${product.color}</p>
            <div class="card-actions">
              <button type="button" data-add="${product.id}">Ajouter</button>
              <button class="mini-btn" type="button" aria-label="Favoris">♥</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function renderAccessories() {
  accessoryGrid.innerHTML = accessoryData
    .map(
      (item) => `
        <article class="accessory-card">
          <div class="accessory-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="accessory-info">
            <div class="accessory-topline">
              <h3 class="accessory-title">${item.name}</h3>
              <span class="accessory-price">${formatPrice(item.price)}</span>
            </div>
            <p class="accessory-meta">${item.category}</p>
            <div class="card-actions">
              <button type="button" data-accessory="${item.id}">Ajouter</button>
              <button class="mini-btn" type="button" aria-label="Ajouter aux favoris">★</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
}

function addToCart(item) {
  const existing = cart.find((entry) => entry.id === item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
  showToast(`${item.name} ajouté au panier`);
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p style="color: rgba(255,255,255,0.7);">Votre panier est vide.</p>';
    cartCount.textContent = '0';
    const total = 0;
    cartSubtotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-thumb ${item.art || 'tee'}">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : '<span class="logo-mark-mini">WN</span>'}
          </div>
          <div>
            <h4>${item.name}</h4>
            <p>${item.category}</p>
          </div>
          <div class="cart-price">
            <strong>${formatPrice(item.price * item.quantity)}</strong>
            <div class="quantity-box">
              <button type="button" data-qty="decrease" data-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty="increase" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    )
    .join('');

  const total = getCartTotal();
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartSubtotal.textContent = formatPrice(total);
  cartTotal.textContent = formatPrice(total);
}

function updateQuantity(id, action) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  if (action === 'increase') item.quantity += 1;
  if (action === 'decrease') item.quantity -= 1;

  if (item.quantity <= 0) {
    const index = cart.findIndex((entry) => entry.id === id);
    cart.splice(index, 1);
  }

  renderCart();
}

function handleProductEvents(event) {
  const addButton = event.target.closest('[data-add]');
  if (!addButton) return;

  const product = productData.find((item) => item.id === Number(addButton.dataset.add));
  if (product) addToCart(product);
}

function handleAccessoryEvents(event) {
  const addButton = event.target.closest('[data-accessory]');
  if (!addButton) return;

  const accessory = accessoryData.find((item) => item.id === Number(addButton.dataset.accessory));
  if (accessory) addToCart(accessory);
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.dataset.filter);
    });
  });
}

function setupCartPanel() {
  const cartPanel = document.getElementById('cartPanel');
  document.getElementById('toggleCart').addEventListener('click', () => {
    cartPanel.classList.toggle('open');
  });

  document.getElementById('closeCart').addEventListener('click', () => {
    cartPanel.classList.remove('open');
  });

  document.getElementById('checkoutButton').addEventListener('click', () => {
    cartPanel.classList.remove('open');
    showToast('Paiement sécurisé prêt à être validé');
  });

  cartItems.addEventListener('click', (event) => {
    const qtyButton = event.target.closest('[data-qty]');
    if (!qtyButton) return;

    updateQuantity(Number(qtyButton.dataset.id), qtyButton.dataset.qty);
  });
}

function setupPromoForm() {
  document.getElementById('promoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = event.currentTarget.querySelector('input');
    const email = emailInput.value.trim();
    if (!email) return;

    emailInput.value = '';
    showToast('Inscription réussie — promos & nouveautés activées');
  });
}

function setupPaymentForm() {
  document.getElementById('paymentForm').addEventListener('submit', (event) => {
    event.preventDefault();
    showToast('Paiement sécurisé validé avec succès');
  });
}

function setupChat() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatWindow = document.querySelector('.chat-window');

  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user';
    userMessage.textContent = message;
    chatWindow.appendChild(userMessage);
    chatInput.value = '';

    const response = document.createElement('div');
    response.className = 'chat-message assistant';
    response.textContent = generateReply(message);
    chatWindow.appendChild(response);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
}

function generateReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes('livraison')) return 'La livraison partout au Sénégal est disponible, avec un suivi en temps réel dès validation de la commande.';
  if (lower.includes('taille')) return 'Nos produits sont conçus pour un fit moderne. Vous pouvez choisir la taille la plus proche de votre tenue habituelle.';
  if (lower.includes('paiement')) return 'Le paiement est entièrement sécurisé et protégé. Vous pouvez régler par carte bancaire ou paiement mobile.';
  if (lower.includes('promo')) return 'Les promotions sont envoyées par e-mail et reflètent les nouvelles arrivées et offres exclusives Why Not.';

  return 'Merci pour votre message. Notre équipe va vous répondre rapidement avec les détails de votre commande et le meilleur conseil style.';
}

renderProducts();
renderAccessories();
renderCart();
setupFilters();
setupCartPanel();
setupPromoForm();
setupPaymentForm();
setupChat();
productGrid.addEventListener('click', handleProductEvents);
accessoryGrid.addEventListener('click', handleAccessoryEvents);
