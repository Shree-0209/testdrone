
document.addEventListener('DOMContentLoaded', function() {
    // Load menu data
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            displayMenu(data);
            setupSearchFunctionality();
        })
        .catch(error => console.error('Error loading menu:', error));
    
    // Setup event listeners for menu page
    setupMenuEventListeners();
});

function displayMenu(menuData) {
    const menuContainer = document.getElementById('menuContainer');
    
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    menuData.categories.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'category-section mb-5';
        
        categorySection.innerHTML = `
            <h2 class="category-title mb-4">${category.name}</h2>
            <div class="row" id="category-${category.name.toLowerCase().replace(/\s+/g, '-')}">
            </div>
        `;
        
        menuContainer.appendChild(categorySection);
        
        const categoryItemsContainer = document.getElementById(`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`);
        
        category.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'col-md-6 col-lg-4 mb-4 menu-item';
            itemElement.setAttribute('data-name', item.name.toLowerCase());
            
            itemElement.innerHTML = `
                <div class="card h-100">
                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="price">₹${item.price.toFixed(2)}</span>
                            <button class="btn btn-primary add-to-cart" 
                                    data-id="${item.id}"
                                    data-name="${item.name}"
                                    data-price="${item.price}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            categoryItemsContainer.appendChild(itemElement);
        });
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            const itemName = this.getAttribute('data-name');
            const itemPrice = this.getAttribute('data-price');
            
            addToCart(itemId, itemName, itemPrice);
            
            // Show a brief "Added to cart" message
            const originalText = this.textContent;
            this.textContent = "Added!";
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (!searchInput || !searchButton) return;
    
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemName = item.getAttribute('data-name');
            
            if (itemName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide category titles based on visible items
        document.querySelectorAll('.category-section').forEach(category => {
            const items = category.querySelectorAll('.menu-item');
            const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');
            
            if (visibleItems.length === 0) {
                category.querySelector('h2').style.display = 'none';
            } else {
                category.querySelector('h2').style.display = 'block';
            }
        });
    };
    
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function setupMenuEventListeners() {
    // Any additional event listeners for the menu page
}
