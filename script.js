
class NavigationManager {
    constructor() {
        this.currentPage = 'home';
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        this.currentPage = pageId;

        if (pageId === 'products') {
            productManager.loadProducts();
        } else if (pageId === 'cart') {
            cartManager.displayCartItems();
        }
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.currentCategory = 'all';
        this.apiKey = 'ousfdn+3CueqczfhrDDi1g==DS95qUXFKfdxTvm4';
        this.productData = [
            { name: 'apple', displayName: 'Fresh Apple', category: 'fruits', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop', basePrice: 0.99 },
            { name: 'banana', displayName: 'Ripe Banana', category: 'fruits', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop', basePrice: 0.49 },
            { name: 'orange', displayName: 'Juicy Orange', category: 'fruits', image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=300&h=200&fit=crop', basePrice: 0.79 },
            { name: 'strawberry', displayName: 'Sweet Strawberry', category: 'fruits', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=200&fit=crop', basePrice: 3.99 },
            { name: 'carrot', displayName: 'Fresh Carrot', category: 'vegetables', image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=300&h=200&fit=crop', basePrice: 0.29 },
            { name: 'broccoli', displayName: 'Organic Broccoli', category: 'vegetables', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=300&h=200&fit=crop', basePrice: 1.49 },
            { name: 'potato', displayName: 'Russet Potato', category: 'vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop', basePrice: 0.39 },
            { name: 'milk', displayName: 'Whole Milk', category: 'dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop', basePrice: 2.99 },
            { name: 'egg', displayName: 'Farm Eggs (12pk)', category: 'dairy', image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&h=200&fit=crop', basePrice: 3.49 },
            { name: 'chicken', displayName: 'Chicken Breast', category: 'meat', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300&h=200&fit=crop', basePrice: 5.99 },
            { name: 'bread', displayName: 'Whole Wheat Bread', category: 'bakery', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=200&fit=crop', basePrice: 2.49 },
            { name: 'orange juice', displayName: 'Fresh Orange Juice', category: 'beverages', image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=300&h=200&fit=crop', basePrice: 3.99 }
        ];
    }

    async loadProducts() {
        this.showLoading();
        try {
            // Get nutrition data from API
            const response = await fetch(
                `https://api.api-ninjas.com/v1/nutrition?query=${this.productData.map(p => p.name).join(',')}`,
                { headers: { 'X-Api-Key': this.apiKey } }
            );
            
            if (!response.ok) throw new Error('API request failed');
            
            const nutritionData = await response.json();
            this.createProducts(nutritionData);
            
        } catch (error) {
            console.error("API Error:", error);
            this.showAlert("Failed to load nutrition data. Using standard pricing.", "warning");
            this.createProducts([]); // Fallback without API data
        } finally {
            this.hideLoading();
        }
    }

    createProducts(nutritionData) {
        this.products = this.productData.map(product => {
            // Find matching nutrition data
            const nutrition = nutritionData.find(item => 
                item.name.toLowerCase() === product.name.toLowerCase());
            
            // Calculate dynamic price based on nutrition or use base price
            const price = nutrition ? 
                (nutrition.calories * 0.015).toFixed(2) : // $0.015 per calorie
                product.basePrice;
            
            return {
                name: product.displayName,
                category: product.category,
                price: parseFloat(price),
                calories: nutrition?.calories || 0,
                image: product.image,
                nutritionInfo: nutrition || null
            };
        });

        if (this.currentPage === 'products') {
            this.displayAllProducts(this.products);
        } else {
            this.displayFeaturedProducts(this.products.slice(0, 4));
        }
    }

    displayFeaturedProducts(products) {
        const container = document.getElementById('featuredProducts');
        container.innerHTML = '';
        products.forEach(product => {
            container.appendChild(this.createProductCard(product));
        });
    }

    displayAllProducts(products) {
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';
        const filteredProducts = this.currentCategory === 'all' 
            ? products 
            : products.filter(p => p.category === this.currentCategory);
        filteredProducts.forEach(product => {
            container.appendChild(this.createProductCard(product));
        });
    }

    createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3 mb-4';
        col.innerHTML = `
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    ${product.calories ? `<p class="text-muted small">${product.calories} calories</p>` : ''}
                    <button class="btn btn-success w-100 add-to-cart">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        `;
        col.querySelector('.add-to-cart').addEventListener('click', () => {
            cartManager.addToCart(product);
        });
        return col;
    }

    filterProducts(category) {
        this.currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        this.displayAllProducts(this.products);
    }

    showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        this.saveCart();
        productManager.showAlert(`${product.name} added to cart!`, 'success');
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.saveCart();
        this.displayCartItems();
    }

    updateQuantity(index, newQuantity) {
        if (newQuantity > 0) {
            this.cart[index].quantity = newQuantity;
        } else {
            this.cart.splice(index, 1);
        }
        this.saveCart();
        this.displayCartItems();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    displayCartItems() {
        const container = document.getElementById('cartItemsContainer');
        const emptyMessage = document.getElementById('emptyCartMessage');
        
        if (this.cart.length === 0) {
            container.innerHTML = '';
            emptyMessage.style.display = 'block';
            this.updateCartTotal();
            return;
        }

        emptyMessage.style.display = 'none';
        container.innerHTML = '';

        this.cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h5>${item.name}</h5>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus">+</button>
                        <span class="remove-item">
                            <i class="fas fa-trash"></i> Remove
                        </span>
                    </div>
                </div>
            `;
            
            // Add event listeners
            cartItem.querySelector('.minus').addEventListener('click', () => {
                this.updateQuantity(index, item.quantity - 1);
            });
            
            cartItem.querySelector('.plus').addEventListener('click', () => {
                this.updateQuantity(index, item.quantity + 1);
            });
            
            cartItem.querySelector('.quantity-input').addEventListener('change', (e) => {
                this.updateQuantity(index, parseInt(e.target.value));
            });
            
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                this.removeFromCart(index);
            });
            
            container.appendChild(cartItem);
        });

        this.updateCartTotal();
    }

    updateCartTotal() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = 2.99;
        const total = subtotal + deliveryFee;
        
        document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.displayCartItems();
    }
}

class FormValidator {
    constructor() {
        this.setupContactForm();
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (form.checkValidity()) {
                this.submitForm();
            } else {
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });
        });
    }

    submitForm() {
        const form = document.getElementById('contactForm');
        productManager.showAlert('Message sent successfully!', 'success');
        form.reset();
        form.classList.remove('was-validated');
        form.querySelectorAll('input, textarea').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }
}

// Initialize all components
const navigationManager = new NavigationManager();
const productManager = new ProductManager();
const cartManager = new CartManager();
const formValidator = new FormValidator();

// Global functions for HTML event handlers
function showPage(pageId) {
    navigationManager.showPage(pageId);
}

function filterProducts(category) {
    productManager.filterProducts(category);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    productManager.loadProducts();
    
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        cartManager.clearCart();
        productManager.showAlert('Order placed successfully!', 'success');
        showPage('home');
    });
});