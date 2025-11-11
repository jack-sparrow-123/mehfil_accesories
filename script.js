// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalElement = document.querySelector('.subtotal');
    const totalPriceElement = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const allProductsGrid = document.querySelector('#all-products .product-grid');
    
    let cart = JSON.parse(localStorage.getItem('mehfilCart')) || [];
    const deliveryCharge = 60;
    
    // Initialize everything
    initializeAllProducts();
    createFloatingSparkles();
    updateCart();
    
    // Create floating sparkles in background
    function createFloatingSparkles() {
        const sparkleCount = 15;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'floating-sparkle';
            
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 3 + Math.random() * 2;
            
            sparkle.style.left = `${left}vw`;
            sparkle.style.top = `${top}vh`;
            sparkle.style.animationDelay = `${delay}s`;
            sparkle.style.animationDuration = `${duration}s`;
            
            document.body.appendChild(sparkle);
        }
    }
    
    // Enhanced sparkling effect
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        sparkle.style.left = `${x - 7.5}px`;
        sparkle.style.top = `${y - 7.5}px`;
        
        const size = 10 + Math.random() * 10;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1500);
    }
    
    // Add sparkle effect to all interactive elements
    document.addEventListener('click', function(e) {
        createSparkle(e.clientX, e.clientY);
        
        if (e.target.classList.contains('add-to-cart') || 
            e.target.classList.contains('checkout-btn')) {
            
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const offsetX = (Math.random() - 0.5) * 50;
                    const offsetY = (Math.random() - 0.5) * 50;
                    createSparkle(e.clientX + offsetX, e.clientY + offsetY);
                }, i * 100);
            }
        }
    });
    
    // Initialize All Products Section
    function initializeAllProducts() {
        // Clear existing content but keep the structure
        allProductsGrid.innerHTML = '';
        
        // Create a comprehensive list of all products
        const allProducts = [
            // Claws
            { id: '1', name: 'Large Rhinestone Claw Clip', price: 90, image: 'images/claw1.jpeg', category: 'claws' },
            { id: '2', name: 'Glass Flower Claws', price: 20, image: 'images/claw2.jpeg', category: 'claws' },
            { id: '3', name: 'Double Daisy Flower Claw', price: 40, image: 'images/claw3.jpeg', category: 'claws' },
            { id: '4', name: 'Flower Claws', price: 20, image: 'images/claw4.jpeg', category: 'claws' },
            { id: '5', name: 'Hair Claws', price: 34, image: 'images/claw5.jpeg', category: 'claws' },
            { id: '6', name: 'Pinterest Glossy Hair Claws', price: 30, image: 'images/claw6.jpeg', category: 'claws' },
            { id: '7', name: 'Trending Flower Claw', price: 30, image: 'images/claw7.jpeg', category: 'claws' },
            { id: '8', name: 'Medium Viral Flower Claws', price: 20, image: 'images/claw8.jpeg', category: 'claws' },
            
            // Headbands
            { id: '9', name: 'Bun Hair Ties (set of 6)', price: 10, image: 'images/head1.jpeg', category: 'headbands' },
            
            // Mini Claws
            { id: '10', name: 'Heart Mini Claws', price: 15, image: 'images/min1.jpeg', category: 'miniclaws' },
            { id: '11', name: 'Mini Butterfly Clips', price: 10, image: 'images/min2.jpeg', category: 'miniclaws' },
            { id: '12', name: 'Cute Flower Mini Claws', price: 15, image: 'images/min3.jpeg', category: 'miniclaws' },
            
            // Earrings
            { id: '13', name: 'Tear Drop Earrings (Green & Pink)', price: 40, image: 'images/ear1.jpeg', category: 'earrings' },
            { id: '14', name: 'Starfish Earrings', price: 40, image: 'images/ear2.jpeg', category: 'earrings' },
            { id: '15', name: 'Daisy Earrings (Multiple colours)', price: 40, image: 'images/ear3.jpeg', category: 'earrings' },
            { id: '16', name: 'Smiley Flower Earrings (Multiple colours)', price: 40, image: 'images/ear4.jpeg', category: 'earrings' },
            
            // Keychains
            { id: '17', name: 'Light & Image Reflection Charms', price: 99, image: 'images/key1.jpeg', category: 'keychains' },
            
            // Scrunchies
            { id: '18', name: 'Scrunchies (Blue, Yellow, Orange, Pink)', price: 12, image: 'images/scrunchie1.jpeg', category: 'scrunchies' },
            
            // Pendent
            { id: '19', name: 'Pendent', price: 40, image: 'images/pend1.jpeg', category: 'pendent' },
            
            // Hamper
            { id: '20', name: 'Gift Hamper', price: 99, image: 'images/hamper.jpeg', category: 'hamper' },
            
            // Bouquet
            { id: '21', name: 'Customizable Flower Claw Bouquet', price: 500, image: 'images/bouquet.jpeg', category: 'bouquet' }
        ];
        
        // Add all products to the all products section
        allProducts.forEach(product => {
            const productCard = createProductCard(product);
            allProductsGrid.appendChild(productCard);
        });
        
        console.log(`Loaded ${allProducts.length} products in All Products section`);
        
        // Initialize cart buttons after creating all products
        initializeCartButtons();
    }
    
    // Create product card HTML
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button class="add-to-cart" 
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-image="${product.image}">
                Add to Cart
            </button>
        `;
        return productCard;
    }
    
    // Initialize Cart Buttons - FIXED VERSION
    function initializeCartButtons() {
        // Use event delegation for better performance
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                e.stopPropagation();
                
                const button = e.target;
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseInt(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');
                
                console.log('Adding to cart:', {id, name, price, image});
                
                if (!id || !name || isNaN(price)) {
                    console.error('Invalid product data:', {id, name, price});
                    showNotification('Error adding product to cart', 'error');
                    return;
                }
                
                addToCart(id, name, price, image);
                
                // Button animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            }
        });
        
        console.log('Cart buttons initialized with event delegation');
    }
    
    // Toggle cart sidebar
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    overlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    function addToCart(id, name, price, image) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === id);
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to cart
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('mehfilCart', JSON.stringify(cart));
        
        updateCart();
        
        // Show cart sidebar when adding an item
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
        
        // Show success message
        showNotification(`${name} added to cart! ✨`);
    }
    
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #888;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Your cart is empty</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Add some beautiful accessories! 💖</p>
                </div>
            `;
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                count += item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23ff6b8b%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23ffffff%22 font-family=%22Arial%22 font-size=%2210%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage%3C/text%3E%3C/svg%3E'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                `;
                
                cartItemsContainer.appendChild(cartItem);
            });
        }
        
        // Update cart totals
        subtotalElement.textContent = total;
        totalPriceElement.textContent = total + deliveryCharge;
        cartCount.textContent = count;
        
        // Add event listeners to quantity buttons using event delegation
        cartItemsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('minus') || e.target.closest('.minus')) {
                const button = e.target.classList.contains('minus') ? e.target : e.target.closest('.minus');
                const id = button.getAttribute('data-id');
                decreaseQuantity(id);
            }
            
            if (e.target.classList.contains('plus') || e.target.closest('.plus')) {
                const button = e.target.classList.contains('plus') ? e.target : e.target.closest('.plus');
                const id = button.getAttribute('data-id');
                increaseQuantity(id);
            }
            
            if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
                const id = button.getAttribute('data-id');
                removeFromCart(id);
            }
        });
    }
    
    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += 1;
            localStorage.setItem('mehfilCart', JSON.stringify(cart));
            updateCart();
            showNotification(`Increased quantity of ${item.name}`);
        }
    }
    
    function decreaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('mehfilCart', JSON.stringify(cart));
                updateCart();
                showNotification(`Decreased quantity of ${item.name}`);
            } else {
                removeFromCart(id);
            }
        }
    }
    
    function removeFromCart(id) {
        const item = cart.find(item => item.id === id);
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('mehfilCart', JSON.stringify(cart));
        updateCart();
        if (item) {
            showNotification(`${item.name} removed from cart`);
        }
    }
    
    // WhatsApp checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty! Add some products first.', 'error');
            return;
        }
        
        let message = `🌟 *Mehfil Accessories Order* 🌟\n\n`;
        message += `Hello! I would like to place an order:\n\n`;
        
        cart.forEach(item => {
            message += `• ${item.name}\n`;
            message += `  Price: ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
        });
        
        message += `📦 *Order Summary:*\n`;
        message += `Subtotal: ₹${subtotalElement.textContent}\n`;
        message += `Delivery Charge: ₹${deliveryCharge}\n`;
        message += `*Total: ₹${totalPriceElement.textContent}*\n\n`;
        message += `Please confirm my order. Thank you! 💖`;
        
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "7902823605"; // Replace with your WhatsApp number
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    });
    
    // Enhanced notification system
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add sparkles to notification
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const rect = notification.getBoundingClientRect();
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                createSparkle(x, y);
            }, i * 200);
        }
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Add slideOutRight animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Mehfil Accessories website initialized successfully!');
});