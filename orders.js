
document.addEventListener('DOMContentLoaded', function() {
    // Load orders from local storage
    loadOrders();
});

function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (!ordersList) return;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="text-center">
                <p class="lead">No orders found</p>
                <a href="menu.html" class="btn btn-primary">Browse Menu</a>
            </div>
        `;
        return;
    }
    
    // Display orders
    ordersList.innerHTML = `<div class="row"></div>`;
    const ordersRow = ordersList.querySelector('.row');
    
    orders.forEach((order, index) => {
        const orderElement = document.createElement('div');
        orderElement.className = 'col-12 mb-4';
        orderElement.id = `order-container-${order.id}`;
        
        // Calculate the total with delivery fee
        const subtotal = order.total;
        const deliveryFee = subtotal >= 300 ? 0 : 50;
        const total = subtotal + deliveryFee;
        
        orderElement.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <button class="btn btn-link text-decoration-none" type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#order-${order.id}" 
                            aria-expanded="${index === 0 ? 'true' : 'false'}">
                        <span>Order #${order.id}</span>
                    </button>
                    <div>
                        <small class="text-muted me-3">${order.timestamp}</small>
                        <button class="btn btn-sm btn-outline-danger delete-order" 
                                data-order-id="${order.id}"
                                onclick="deleteOrder('${order.id}')">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </div>
                <div class="collapse ${index === 0 ? 'show' : ''}" id="order-${order.id}">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-9">
                                <h5 class="card-title">Order Details</h5>
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${order.items.map(item => `
                                                <tr>
                                                    <td>${item.name}</td>
                                                    <td>${item.quantity}</td>
                                                    <td>₹${item.price.toFixed(2)}</td>
                                                    <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                                                <td><strong>₹${subtotal.toFixed(2)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" class="text-end"><strong>Delivery Fee:</strong></td>
                                                <td><strong>${deliveryFee === 0 ? 'Free' : '₹' + deliveryFee.toFixed(2)}</strong></td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                                <td><strong>₹${total.toFixed(2)}</strong></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-center">
                                    <h6 class="mb-3">Order QR Code</h6>
                                    <canvas id="qr-${order.id}" class="mb-2"></canvas>
                                    <small class="d-block text-muted">Scan to view order details</small>
                                </div>
                            </div>
                        </div>

                        <div class="mt-3">
                            <h6>Delivery Information</h6>
                            <p class="mb-1">Name: ${order.customer_info.name}</p>
                            <p class="mb-1">Email: ${order.customer_info.email}</p>
                            <p class="mb-1">Phone: ${order.customer_info.phone}</p>
                            <p class="mb-1">Address: ${order.customer_info.address}</p>
                            <p class="mb-1">Pincode: ${order.customer_info.pincode}</p>
                            ${order.customer_info.notes ? `<p class="mb-1">Notes: ${order.customer_info.notes}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        ordersRow.appendChild(orderElement);
        
        // Generate QR code after the element is added to the DOM
        setTimeout(() => {
            new QRious({
                element: document.getElementById(`qr-${order.id}`),
                value: order.id,
                size: 128,
                background: '#ffffff',
                foreground: '#000000',
                level: 'H'
            });
        }, 0);
    });
    
    // Initialize feather icons
    feather.replace();
}

function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const updatedOrders = orders.filter(order => order.id !== orderId);
        
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        const orderElement = document.getElementById(`order-container-${orderId}`);
        if (orderElement) {
            orderElement.remove();
        }
        
        // Reload if no orders left
        if (updatedOrders.length === 0) {
            loadOrders();
        }
    }
}
