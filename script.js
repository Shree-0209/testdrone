
// Initialize Feather icons
document.addEventListener('DOMContentLoaded', function() {
    feather.replace();
    
    // Initialize cart from local storage
    loadCart();
    
    // Set up event listeners
    setupEventListeners();
});

// Cart functionality
let cart = [];

function setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', toggleCart);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
}

function addToCart(itemId, itemName, itemPrice) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: parseFloat(itemPrice),
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity = parseInt(quantity);
        
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="text-center my-4">Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h5 class="mb-0">${item.name}</h5>
                        <p class="mb-0">₹${item.price.toFixed(2)}</p>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn btn-sm btn-danger ms-2" onclick="removeFromCart('${item.id}')">
                        <i data-feather="trash-2"></i>
                    </button>
                `;
                
                cartItems.appendChild(cartItemElement);
            });
            
            // Re-initialize feather icons
            feather.replace();
        }
    }
    
    // Update totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (cartSubtotal) {
        cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    }
    
    if (cartTotal) {
        cartTotal.textContent = `₹${subtotal.toFixed(2)}`;
    }
}

// Generate a random order ID
function generateOrderId() {
    return 'ORD-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
}
