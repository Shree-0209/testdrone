
document.addEventListener('DOMContentLoaded', function() {
    // Display order number
    const orderNumberElement = document.getElementById('orderNumber');
    const lastOrderId = localStorage.getItem('lastOrderId');
    
    if (orderNumberElement && lastOrderId) {
        orderNumberElement.textContent = lastOrderId;
    } else if (orderNumberElement) {
        // If no order ID found, generate a random one for display
        orderNumberElement.textContent = generateOrderId();
    }
});
