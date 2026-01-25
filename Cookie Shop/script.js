// Cookie Shop JavaScript

// Product data
const products = [
    {
        id: 1,
        name: 'Classic Chocolate Chip',
        description: 'Our signature cookie with premium chocolate chips',
        price: 2.50,
        category: 'classic',
        icon: 'fa-cookie'
    },
    {
        id: 2,
        name: 'Double Chocolate Chunk',
        description: 'Rich cocoa dough with dark chocolate chunks',
        price: 3.00,
        category: 'chocolate',
        icon: 'fa-cookie-bite'
    },
    {
        id: 3,
        name: 'Snickerdoodle',
        description: 'Soft and chewy with cinnamon sugar coating',
        price: 2.25,
        category: 'classic',
        icon: 'fa-cookie'
    },
    {
        id: 4,
        name: 'Peanut Butter Bliss',
        description: 'Creamy peanut butter with a soft center',
        price: 2.75,
        category: 'classic',
        icon: 'fa-cookie-bite'
    },
    {
        id: 5,
        name: 'White Chocolate Macadamia',
        description: 'Sweet white chocolate with crunchy macadamia nuts',
        price: 3.50,
        category: 'specialty',
        icon: 'fa-cookie'
    },
    {
        id: 6,
        name: 'Oatmeal Raisin',
        description: 'Hearty oats with plump raisins and brown sugar',
        price: 2.25,
        category: 'classic',
        icon: 'fa-cookie'
    },
    {
        id: 7,
        name: 'Red Velvet',
        description: 'Rich red velvet with cream cheese swirl',
        price: 3.25,
        category: 'specialty',
        icon: 'fa-cookie-bite'
    },
    {
        id: 8,
        name: 'S\'mores Cookie',
        description: 'Graham, chocolate, and toasted marshmallow',
        price: 3.50,
        category: 'specialty',
        icon: 'fa-cookie-bite'
    },
    {
        id: 9,
        name: 'Pumpkin Spice',
        description: 'Seasonal favorite with warm fall spices',
        price: 3.00,
        category: 'seasonal',
        icon: 'fa-cookie'
    },
    {
        id: 10,
        name: 'Triple Chocolate',
        description: 'Dark, milk, and white chocolate in every bite',
        price: 3.75,
        category: 'chocolate',
        icon: 'fa-cookie-bite'
    },
    {
        id: 11,
        name: 'Gingerbread',
        description: 'Classic holiday spiced cookie',
        price: 2.75,
        category: 'seasonal',
        icon: 'fa-cookie'
    },
    {
        id: 12,
        name: 'Chocolate Peanut Butter',
        description: 'The perfect combo of chocolate and PB',
        price: 3.25,
        category: 'chocolate',
        icon: 'fa-cookie-bite'
    }
];

// Shopping cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const categoryBtns = document.querySelectorAll('.category-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    updateStoreStatus();
    initEventListeners();

    // Update store status every minute
    setInterval(updateStoreStatus, 60000);
});

// Render products
function renderProducts(category) {
    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-icon">
                <i class="fa-solid ${product.icon}"></i>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-desc">${product.description}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showToast(`${product.name} added to cart!`, 'success');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Update cart display
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCount.textContent = '0';
        cartTotal.textContent = '$0.00';
        checkoutBtn.disabled = true;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)} each</span>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    checkoutBtn.disabled = false;
}

// Initialize event listeners
function initEventListeners() {
    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        showToast(`Order placed! ${itemCount} cookies for $${total.toFixed(2)}`, 'success');
        cart = [];
        updateCart();
    });

    // Featured banner button
    document.querySelector('.featured-btn')?.addEventListener('click', () => {
        addToCart(2); // Double Chocolate Chunk
    });

    // Newsletter form
    document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        if (email) {
            showToast('Thanks for subscribing! Check your email for 10% off.', 'success');
            e.target.reset();
        }
    });
}

// Update store status based on current time
function updateStoreStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();

    let isOpen = false;
    let openTime, closeTime;

    if (day >= 1 && day <= 5) {
        // Monday - Friday: 7AM - 9PM
        openTime = 7;
        closeTime = 21;
    } else if (day === 6) {
        // Saturday: 8AM - 10PM
        openTime = 8;
        closeTime = 22;
    } else {
        // Sunday: 9AM - 6PM
        openTime = 9;
        closeTime = 18;
    }

    isOpen = hour >= openTime && hour < closeTime;

    const statusEl = document.getElementById('store-status');
    if (statusEl) {
        if (isOpen) {
            statusEl.className = 'hours-status open';
            statusEl.innerHTML = '<i class="fa-solid fa-door-open"></i><span>Open Now</span>';
        } else {
            statusEl.className = 'hours-status closed';
            statusEl.innerHTML = '<i class="fa-solid fa-door-closed"></i><span>Closed</span>';
        }
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Update stats periodically (simulated)
function updateStats() {
    const soldEl = document.querySelector('.stat-value');
    if (soldEl) {
        const currentSold = parseInt(soldEl.textContent);
        const newSold = currentSold + Math.floor(Math.random() * 3);
        soldEl.textContent = newSold;
    }
}

// Simulate sales every 30 seconds
setInterval(updateStats, 30000);

console.log('Sweet Crumbs Cookie Shop initialized');
