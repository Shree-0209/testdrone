
document.addEventListener('DOMContentLoaded', function() {
    // Load cart data for checkout
    loadCheckoutData();
    
    // Setup event listeners for checkout page
    setupCheckoutEventListeners();
});

function loadCheckoutData() {
    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const totalElement = document.getElementById('total');
    
    if (!orderItems) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        // Redirect to menu if cart is empty
        window.location.href = 'menu.html';
        return;
    }
    
    // Display cart items
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        
        itemElement.innerHTML = `
            <div>
                <strong>${item.name}</strong> x ${item.quantity}
            </div>
            <div>₹${(item.price * item.quantity).toFixed(2)}</div>
        `;
        
        orderItems.appendChild(itemElement);
    });
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 300 ? 0 : 50; // Free delivery for orders over ₹300
    const total = subtotal + deliveryFee;
    
    // Update displays
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    deliveryFeeElement.textContent = subtotal >= 300 ? 'Free' : `₹${deliveryFee.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
}

function setupCheckoutEventListeners() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const checkoutForm = document.getElementById('checkoutForm');
    
    if (!placeOrderBtn || !checkoutForm) return;
    
    placeOrderBtn.addEventListener('click', function() {
        // Validate form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const pincode = document.getElementById('pincode').value;
        const address = document.getElementById('address').value;
        
        if (!name || !email || !phone || !pincode || !address) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate pincode
        const validPincodes = ['591143', '591153', '590018', '590006', '590008'];
        
        if (!validPincodes.includes(pincode)) {
            document.getElementById('pincode').classList.add('is-invalid');
            document.getElementById('pincodeError').style.display = 'block';
            return;
        }
        
        // Save order information
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderId = generateOrderId();
        
        const order = {
            id: orderId,
            items: cart,
            total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
            customer_info: {
                name: name,
                email: email,
                phone: phone,
                pincode: pincode,
                address: address,
                notes: document.getElementById('notes').value
            },
            timestamp: new Date().toLocaleString()
        };
        
        // Save to order history
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        
        // Save order ID for confirmation page
        localStorage.setItem('lastOrderId', orderId);
        
        // Redirect to confirmation page
        window.location.href = 'confirmation.html';
    });
    
    // Validate pincode on change
    const pincodeSelect = document.getElementById('pincode');
    
    if (pincodeSelect) {
        pincodeSelect.addEventListener('change', function() {
            const validPincodes = ['591143', '591153', '590018', '590006', '590008'];
            
            if (this.value && !validPincodes.includes(this.value)) {
                this.classList.add('is-invalid');
                document.getElementById('pincodeError').style.display = 'block';
            } else {
                this.classList.remove('is-invalid');
                document.getElementById('pincodeError').style.display = 'none';
            }
        });
    }
}
