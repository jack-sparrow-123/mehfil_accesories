// Production Ready JavaScript for Mehfil Accessories
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const RAZORPAY_KEY = 'rzp_live_RgpnRGCoR6wfMo';
    const WHATSAPP_NUMBER = '7902823605';
    const deliveryCharges = {
        under200: 45,
        under500: 35,
        over500: 0
    };

    // State
    let cart = JSON.parse(localStorage.getItem('mehfilCart')) || [];
    let currentZoom = 1;
    const zoomStep = 0.2;
    const maxZoom = 3;
    const minZoom = 0.5;

    // DOM Elements
    const elements = {
        cartIcon: document.querySelector('.cart-icon'),
        cartSidebar: document.querySelector('.cart-sidebar'),
        closeCart: document.querySelector('.close-cart'),
        overlay: document.querySelector('.overlay'),
        cartItemsContainer: document.querySelector('.cart-items'),
        cartCount: document.querySelector('.cart-count'),
        subtotalElement: document.querySelector('.subtotal'),
        totalPriceElement: document.querySelector('.total-price'),
        deliveryChargeElement: document.querySelector('.delivery-charge'),
        checkoutBtn: document.querySelector('.checkout-btn'),
        categoryPopup: document.querySelector('.category-popup'),
        closeCategoryPopup: document.querySelector('.close-category-popup'),
        popupCategoryTitle: document.getElementById('popup-category-title'),
        popupProductGrid: document.getElementById('popup-product-grid'),
        allProductsGrid: document.getElementById('all-products-grid'),
        zoomModal: document.querySelector('.zoom-modal'),
        zoomImage: document.querySelector('.zoom-content img'),
        closeZoom: document.querySelector('.close-zoom'),
        zoomInBtn: document.getElementById('zoom-in'),
        zoomOutBtn: document.getElementById('zoom-out'),
        resetZoomBtn: document.getElementById('reset-zoom')
    };

    // Product Data with CORRECT image paths
    const categoryProducts = {
        claws: [
            { 
                id: '1', 
                name: 'Large Rhinestone Claw Clip', 
                price: 90, 
                image: 'images/claw1.jpeg',
                images: ['images/claw1.jpeg', 'images/large1.jpeg', 'images/large2.jpeg', 'images/large4.jpeg']
            },
            { 
                id: '2', 
                name: 'Glass Flower Claws', 
                price: 20, 
                image: 'images/claw2.jpeg',
                images: ['images/claw2.jpeg', 'images/glass1.jpeg', 'images/glass2.jpeg']
            },
            { 
                id: '3', 
                name: 'Double Daisy Flower Claw', 
                price: 40, 
                image: 'images/claw3.jpeg',
                images: ['images/claw3.jpeg']
            },
            { 
                id: '4', 
                name: 'Flower Claws', 
                price: 20, 
                image: 'images/claw4.jpeg',
                images: ['images/claw4.jpeg']
            },
            { 
                id: '5', 
                name: 'Hair Claws', 
                price: 34, 
                image: 'images/claw5.jpeg',
                images: ['images/claw5.jpeg', 'images/hair2.jpeg', 'images/hair5.jpeg']
            },
            { 
                id: '6', 
                name: 'Pinterest Glossy Hair Claws', 
                price: 30, 
                image: 'images/claw6.jpeg',
                images: ['images/claw6.jpeg']
            },
            { 
                id: '7', 
                name: 'Trending Flower Claw', 
                price: 30, 
                image: 'images/claw7.jpeg',
                images: ['images/claw7.jpeg', 'images/trending1.jpeg']
            },
            { 
                id: '8', 
                name: 'Medium Viral Flower Claws', 
                price: 20, 
                image: 'images/claw8.jpeg',
                images: ['images/claw8.jpeg']
            }
        ],
        headbands: [
            { 
                id: '9', 
                name: 'Bun Hair Ties (set of 6)', 
                price: 10, 
                image: 'images/head1.jpeg',
                images: ['images/head1.jpeg']
            }
        ],
        miniclaws: [
            { 
                id: '10', 
                name: 'Heart Mini Claws', 
                price: 15, 
                image: 'images/min1.jpeg',
                images: ['images/min1.jpeg']
            },
            { 
                id: '11', 
                name: 'Mini Butterfly Clips', 
                price: 10, 
                image: 'images/min2.jpeg',
                images: ['images/min2.jpeg']
            },
            { 
                id: '12', 
                name: 'Cute Flower Mini Claws', 
                price: 15, 
                image: 'images/min3.jpeg',
                images: ['images/min3.jpeg', 'images/flower6.jpeg']
            }
        ],
        earrings: [
            { 
                id: '13', 
                name: 'Tear Drop Earrings', 
                price: 40, 
                image: 'images/ear1.jpeg',
                images: ['images/ear1.jpeg', 'images/ear5.jpeg'],
                colors: ['Green', 'Pink']
            },
            { 
                id: '14', 
                name: 'Starfish Earrings', 
                price: 40, 
                image: 'images/ear2.jpeg',
                images: ['images/ear2.jpeg'],
                colors: ['Dark Green', 'Black', 'Light Green/Mint', 'Hot Pink/Fuchsia', 'Red/Orange-Red', 'Light Pink/Blush']
            },
            { 
                id: '15', 
                name: 'Daisy Earrings', 
                price: 40, 
                image: 'images/ear3.jpeg',
                images: ['images/ear3.jpeg'],
                colors: ['Dark Green', 'Black', 'Light Green/Mint', 'Hot Pink/Fuchsia', 'Red/Orange-Red', 'Light Pink/Blush']
            },
            { 
                id: '16', 
                name: 'Smiley Flower Earrings', 
                price: 40, 
                image: 'images/ear4.jpeg',
                images: ['images/ear4.jpeg'],
                colors: ['Dark Red/Maroon', 'Orange/Red-Orange', 'White/Yellow', 'Yellow', 'Purple/Lavender', 'Black', 'Light Blue/Cyan', 'Pink/Light Pink']
            }
        ],
        scrunchies: [
            { 
                id: '18', 
                name: 'Scrunchies', 
                price: 12, 
                image: 'images/scrunchie1.jpeg',
                images: ['images/scrunchie1.jpeg'],
                colors: ['Blue', 'Yellow', 'Orange', 'Pink']
            }
        ],
        keychains: [
            { 
                id: '17', 
                name: 'Light & Image Reflection Charms', 
                price: 99, 
                image: 'images/key1.jpeg',
                images: ['images/key1.jpeg', 'images/chain1.jpeg', 'images/chain2.jpeg', 'images/chain4.jpeg', 'images/chain5.jpeg', 'images/chain6.jpeg', 'images/chain7.jpeg']
            }
        ],
        pendent: [
            { 
                id: '19', 
                name: 'Pendant', 
                price: 40, 
                image: 'images/pend1.jpeg',
                images: ['images/pend1.jpeg', 'images/pendent2.jpeg']
            }
        ],
        hamper: [
            { 
                id: '20', 
                name: 'Gift Hamper', 
                price: 99, 
                image: 'images/hamper.jpeg',
                images: ['images/hamper.jpeg']
            }
        ],
        bouquet: [
            { 
                id: '21', 
                name: 'Customizable Flower Claw Bouquet', 
                price: 500, 
                image: 'images/bouquet.jpeg',
                images: ['images/bouquet.jpeg']
            }
        ]
    };

    // Initialize Application
    function init() {
        initializeCarousels();
        initializeEventListeners();
        initializeAllProducts();
        updateCart();
        console.log('Mehfil Accessories initialized successfully');
    }

    // FIXED Carousel Functionality
    function initializeCarousels() {
        const carousels = document.querySelectorAll('.carousel-container:not(.initialized)');
        
        carousels.forEach(carousel => {
            carousel.classList.add('initialized'); // Mark as initialized
            
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const prevBtn = carousel.querySelector('.prev-btn');
            const nextBtn = carousel.querySelector('.next-btn');
            const indicators = carousel.parentElement.querySelector('.carousel-indicators');
            
            let currentIndex = 0;
            const slideCount = slides.length;
            
            if (slideCount <= 1) {
                carousel.classList.add('single-image');
                return;
            }
            
            function updateSlidePosition() {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                if (indicators) {
                    const indicatorDots = indicators.querySelectorAll('.indicator');
                    indicatorDots.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentIndex);
                    });
                }
            }
            
            function nextSlide() {
                currentIndex = (currentIndex + 1) % slideCount;
                updateSlidePosition();
            }
            
            function prevSlide() {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateSlidePosition();
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', prevSlide);
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', nextSlide);
            }
            
            if (indicators) {
                const indicatorDots = indicators.querySelectorAll('.indicator');
                indicatorDots.forEach((indicator, index) => {
                    indicator.addEventListener('click', () => {
                        currentIndex = index;
                        updateSlidePosition();
                    });
                });
            }
            
            // Auto-advance carousel every 5 seconds
            let autoSlideInterval = setInterval(nextSlide, 5000);
            
            // Pause auto-slide on hover
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(nextSlide, 5000);
            });
            
            // Swipe functionality for touch devices
            let startX = 0;
            let endX = 0;
            
            track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                clearInterval(autoSlideInterval);
            });
            
            track.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
                autoSlideInterval = setInterval(nextSlide, 5000);
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                
                if (startX - endX > swipeThreshold) {
                    nextSlide();
                } else if (endX - startX > swipeThreshold) {
                    prevSlide();
                }
            }
            
            // Initialize position
            updateSlidePosition();
        });
    }

    // Event Listeners
    function initializeEventListeners() {
        // Cart Events
        if (elements.cartIcon) {
            elements.cartIcon.addEventListener('click', openCart);
        }
        if (elements.closeCart) {
            elements.closeCart.addEventListener('click', closeCart);
        }
        if (elements.overlay) {
            elements.overlay.addEventListener('click', closeCart);
        }

        // Category Events
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                openCategoryPopup(category);
            });
        });

        if (elements.closeCategoryPopup) {
            elements.closeCategoryPopup.addEventListener('click', closeCategoryPopup);
        }

        if (elements.categoryPopup) {
            elements.categoryPopup.addEventListener('click', function(e) {
                if (e.target === elements.categoryPopup) {
                    closeCategoryPopup();
                }
            });
        }

        // Zoom Events
        if (elements.closeZoom) {
            elements.closeZoom.addEventListener('click', closeZoomModal);
        }

        if (elements.zoomInBtn) {
            elements.zoomInBtn.addEventListener('click', zoomIn);
        }

        if (elements.zoomOutBtn) {
            elements.zoomOutBtn.addEventListener('click', zoomOut);
        }

        if (elements.resetZoomBtn) {
            elements.resetZoomBtn.addEventListener('click', resetZoom);
        }

        if (elements.zoomModal) {
            elements.zoomModal.addEventListener('click', function(e) {
                if (e.target === elements.zoomModal) {
                    closeZoomModal();
                }
            });
        }

        // Checkout Event
        if (elements.checkoutBtn) {
            elements.checkoutBtn.addEventListener('click', handleCheckout);
        }

        // Global Events
        document.addEventListener('click', handleGlobalClicks);
        document.addEventListener('change', handleColorSelection);
        document.addEventListener('keydown', handleKeyboard);
    }

    // Cart Management
    function openCart() {
        if (elements.cartSidebar) elements.cartSidebar.classList.add('active');
        if (elements.overlay) elements.overlay.classList.add('active');
    }

    function closeCart() {
        if (elements.cartSidebar) elements.cartSidebar.classList.remove('active');
        if (elements.overlay) elements.overlay.classList.remove('active');
    }

    function calculateDeliveryCharge(subtotal) {
        if (subtotal === 0) return deliveryCharges.under200;
        if (subtotal < 200) return deliveryCharges.under200;
        if (subtotal < 500) return deliveryCharges.under500;
        return deliveryCharges.over500;
    }

    function updateCart() {
        if (!elements.cartItemsContainer) return;
        
        elements.cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let count = 0;

        if (cart.length === 0) {
            elements.cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <small>Add some products to get started!</small>
                </div>
            `;
        } else {
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                count += item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                elements.cartItemsContainer.appendChild(cartItem);
            });
        }

        const deliveryCharge = calculateDeliveryCharge(subtotal);
        const total = subtotal + deliveryCharge;

        if (elements.cartCount) elements.cartCount.textContent = count;
        if (elements.subtotalElement) elements.subtotalElement.textContent = subtotal;
        if (elements.deliveryChargeElement) {
            elements.deliveryChargeElement.textContent = deliveryCharge === 0 ? 'FREE' : deliveryCharge;
        }
        if (elements.totalPriceElement) elements.totalPriceElement.textContent = total;

        // Update checkout button state
        if (elements.checkoutBtn) {
            elements.checkoutBtn.disabled = cart.length === 0;
            elements.checkoutBtn.textContent = cart.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout';
        }
    }

    function addToCart(id, name, price, image, color = '') {
        const productName = color ? `${name} - ${color}` : name;
        const existingItem = cart.find(item => item.id === id && item.name === productName);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: id,
                name: productName,
                price: price,
                image: image,
                quantity: 1,
                color: color
            });
        }
        
        localStorage.setItem('mehfilCart', JSON.stringify(cart));
        updateCart();
        showNotification(`${productName} added to cart! 🛍️`);
        
        // Add animation to cart icon
        if (elements.cartIcon) {
            elements.cartIcon.style.transform = 'scale(1.1)';
            setTimeout(() => {
                elements.cartIcon.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // FIXED Category Popup Management
    function openCategoryPopup(category) {
        const products = categoryProducts[category];
        if (!products) {
            showNotification('Category not found!', 'error');
            return;
        }
        
        const categoryTitles = {
            claws: 'Hair Claws ✨',
            headbands: 'Headbands & Hair Ties 💫',
            miniclaws: 'Mini Claws 🦋',
            earrings: 'Earrings 💎',
            keychains: 'Keychains 🔑',
            scrunchies: 'Scrunchies 🎀',
            pendent: 'Pendants 📿',
            hamper: 'Gift Hampers 🎁',
            bouquet: 'Flower Claw Bouquets 💐'
        };
        
        elements.popupCategoryTitle.textContent = categoryTitles[category] || category;
        elements.popupProductGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            elements.popupProductGrid.appendChild(productCard);
        });
        
        elements.categoryPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // FIXED: Reinitialize carousels after a short delay to ensure DOM is ready
        setTimeout(() => {
            initializeCarousels();
        }, 100);
    }

    function closeCategoryPopup() {
        elements.categoryPopup.classList.remove('active');
        document.body.style.overflow = '';
    }

    // FIXED Product Card Creation
    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let colorOptions = '';
        if (product.colors && product.colors.length > 0) {
            colorOptions = `
                <div class="color-options">
                    <label>Select Color:</label>
                    <div class="color-selector">
                        ${product.colors.map((color, index) => `
                            <input type="radio" id="popup-${product.id}-${color.replace(/\s+/g, '-')}" 
                                   name="color-${product.id}" 
                                   value="${color}" 
                                   ${index === 0 ? 'checked' : ''}>
                            <label for="popup-${product.id}-${color.replace(/\s+/g, '-')}" 
                                   class="color-label ${color.toLowerCase().replace(/\s+/g, '-')}">
                                ${color}
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        const isSingleImage = product.images.length <= 1;
        const carouselClass = isSingleImage ? 'single-image' : '';
        
        // FIXED: Ensure all images have proper alt text and loading
        const carouselHTML = `
            <div class="carousel-container ${carouselClass}">
                <div class="carousel-track">
                    ${product.images.map((img, index) => `
                        <div class="carousel-slide">
                            <img src="${img}" alt="${product.name} - View ${index + 1}" loading="lazy" 
                                 onerror="this.src='https://via.placeholder.com/300x300/ff6b6b/white?text=Image+Not+Found'; this.alt='Image not available'">
                        </div>
                    `).join('')}
                </div>
                ${!isSingleImage ? `
                    <div class="carousel-controls">
                        <button class="carousel-btn prev-btn" aria-label="Previous image">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="carousel-btn next-btn" aria-label="Next image">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                ` : ''}
            </div>
            ${!isSingleImage ? `
                <div class="carousel-indicators">
                    ${product.images.map((_, index) => `
                        <div class="indicator ${index === 0 ? 'active' : ''}" 
                             data-index="${index}" 
                             aria-label="Go to slide ${index + 1}"></div>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        card.innerHTML = `
            <div class="product-gallery">
                ${carouselHTML}
            </div>
            <h3>${product.name}</h3>
            <p class="product-price">₹${product.price}</p>
            ${colorOptions}
            <button class="add-to-cart" 
                    data-id="${product.id}" 
                    data-base-name="${product.name}"
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-image="${product.image}"
                    aria-label="Add ${product.name} to cart">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        `;
        
        return card;
    }

    // All Products Section
    function initializeAllProducts() {
        if (!elements.allProductsGrid) return;
        elements.allProductsGrid.innerHTML = '';

        const allProducts = Object.values(categoryProducts).flat();
        
        allProducts.forEach(product => {
            const productCard = createProductCard(product);
            elements.allProductsGrid.appendChild(productCard);
        });

        // Initialize carousels
        setTimeout(() => initializeCarousels(), 100);
    }

    // Zoom Functionality
    function openZoomModal(imgSrc, altText) {
        if (elements.zoomImage) {
            elements.zoomImage.src = imgSrc;
            elements.zoomImage.alt = altText;
            
            // Add error handling for zoom image
            elements.zoomImage.onerror = function() {
                this.src = 'https://via.placeholder.com/600x600/ff6b6b/white?text=Image+Not+Available';
                this.alt = 'Image not available';
            };
        }
        currentZoom = 1;
        updateZoom();
        if (elements.zoomModal) elements.zoomModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeZoomModal() {
        if (elements.zoomModal) elements.zoomModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function zoomIn() {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            updateZoom();
        }
    }

    function zoomOut() {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            updateZoom();
        }
    }

    function resetZoom() {
        currentZoom = 1;
        updateZoom();
    }

    function updateZoom() {
        if (elements.zoomImage) {
            elements.zoomImage.style.transform = `scale(${currentZoom})`;
        }
    }

    // Event Handlers
    function handleGlobalClicks(e) {
        // Add to cart
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));
            const image = btn.getAttribute('data-image');
            
            addToCart(id, name, price, image);
            openCart();
        }

        // Cart item actions
        if (e.target.closest('.quantity-btn') || e.target.closest('.remove-item')) {
            const btn = e.target.closest('button');
            const id = btn.dataset.id;
            
            if (btn.classList.contains('minus')) {
                const item = cart.find(i => i.id === id);
                if (item.quantity > 1) {
                    item.quantity--;
                    showNotification(`Reduced ${item.name} quantity`);
                } else {
                    cart = cart.filter(i => i.id !== id);
                    showNotification(`Removed ${item.name} from cart`);
                }
            } else if (btn.classList.contains('plus')) {
                const item = cart.find(i => i.id === id);
                item.quantity++;
                showNotification(`Increased ${item.name} quantity`);
            } else if (btn.classList.contains('remove-item')) {
                const item = cart.find(i => i.id === id);
                cart = cart.filter(i => i.id !== id);
                showNotification(`Removed ${item.name} from cart`);
            }

            localStorage.setItem('mehfilCart', JSON.stringify(cart));
            updateCart();
        }

        // Image zoom
        const imgElement = e.target.tagName === 'IMG' ? e.target : e.target.querySelector('img');
        if (imgElement && (e.target.classList.contains('carousel-slide') || e.target.parentElement.classList.contains('carousel-slide'))) {
            openZoomModal(imgElement.src, imgElement.alt);
        }
    }

    function handleColorSelection(e) {
        if (e.target.type === 'radio' && e.target.name.includes('color-')) {
            const productCard = e.target.closest('.product-card');
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            const selectedColor = e.target.value;
            
            const baseName = addToCartBtn.getAttribute('data-base-name') || addToCartBtn.getAttribute('data-name');
            addToCartBtn.setAttribute('data-name', `${baseName} - ${selectedColor}`);
            
            // Visual feedback for color selection
            const colorLabels = productCard.querySelectorAll('.color-label');
            colorLabels.forEach(label => label.classList.remove('selected'));
            e.target.nextElementSibling.classList.add('selected');
        }
    }

    function handleKeyboard(e) {
        if (e.key === 'Escape') {
            if (elements.zoomModal && elements.zoomModal.classList.contains('active')) {
                closeZoomModal();
            }
            if (elements.categoryPopup && elements.categoryPopup.classList.contains('active')) {
                closeCategoryPopup();
            }
            if (elements.cartSidebar && elements.cartSidebar.classList.contains('active')) {
                closeCart();
            }
        }
        
        // Zoom with keyboard
        if (elements.zoomModal && elements.zoomModal.classList.contains('active')) {
            if (e.key === '+') zoomIn();
            if (e.key === '-') zoomOut();
            if (e.key === '0') resetZoom();
        }
    }

    // Checkout Process
    async function handleCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        try {
            const customerDetails = await collectCustomerDetails();
            if (!customerDetails) {
                showNotification('Please provide your details to continue', 'error');
                return;
            }

            const subtotal = parseInt(elements.subtotalElement?.textContent || 0);
            const total = parseInt(elements.totalPriceElement?.textContent || 0);

            const options = {
                key: RAZORPAY_KEY,
                amount: total * 100,
                currency: 'INR',
                name: 'Mehfil Accessories',
                description: 'Thank you for shopping with us!',
                image: 'images/logo.png',
                handler: function(response) {
                    handlePaymentSuccess(response, customerDetails, subtotal, total);
                },
                prefill: {
                    name: customerDetails.name,
                    email: customerDetails.email, 
                    contact: customerDetails.phone
                },
                theme: { color: '#ff6b6b' },
                modal: {
                    ondismiss: function() {
                        showNotification('Payment cancelled', 'error');
                    }
                }
            };

            if (typeof Razorpay === 'undefined') {
                showNotification('Payment gateway is still loading. Please try again in a moment.', 'error');
                return;
            }

            const rzp = new Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Checkout error:', error);
            showNotification('Checkout process failed. Please try again.', 'error');
        }
    }

    function handlePaymentSuccess(response, customerDetails, subtotal, total) {
        const paymentId = response.razorpay_payment_id;
        const message = generateOrderMessage(customerDetails, paymentId, subtotal, total);
        
        saveOrderBackup(message, customerDetails, paymentId);
        showAutoWhatsAppModal(message);
        
        setTimeout(() => {
            sendAutomaticWhatsApp(message);
        }, 1000);

        // Clear cart and show success
        cart = [];
        localStorage.setItem('mehfilCart', JSON.stringify(cart));
        updateCart();
        closeCart();
        
        showNotification('🎉 Order placed successfully! Thank you for shopping with us!', 'success');
    }

    // Customer Details Collection
    function collectCustomerDetails() {
        return new Promise((resolve) => {
            const modalHTML = `
                <div class="customer-modal-overlay">
                    <div class="customer-modal">
                        <h3>📋 Shipping Details</h3>
                        <form id="customerForm">
                            <div class="form-group">
                                <label for="customerName">Full Name *</label>
                                <input type="text" id="customerName" required placeholder="Enter your full name">
                            </div>
                            <div class="form-group">
                                <label for="customerPhone">Phone Number *</label>
                                <input type="tel" id="customerPhone" required placeholder="Enter your WhatsApp number">
                            </div>
                            <div class="form-group">
                                <label for="customerEmail">Email Address</label>
                                <input type="email" id="customerEmail" placeholder="Enter your email (optional)">
                            </div>
                            <div class="form-group">
                                <label for="customerAddress">Full Address *</label>
                                <textarea id="customerAddress" required placeholder="Enter your complete shipping address" rows="3"></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="customerCity">City *</label>
                                    <input type="text" id="customerCity" required placeholder="Your city">
                                </div>
                                <div class="form-group">
                                    <label for="customerPincode">Pincode *</label>
                                    <input type="text" id="customerPincode" required placeholder="Pincode">
                                </div>
                            </div>
                            <div class="modal-buttons">
                                <button type="button" class="cancel-btn">Cancel</button>
                                <button type="submit" class="submit-btn">Proceed to Payment</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;

            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);

            const form = document.getElementById('customerForm');
            const cancelBtn = modalContainer.querySelector('.cancel-btn');
            const overlay = modalContainer.querySelector('.customer-modal-overlay');

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const customerDetails = {
                    name: document.getElementById('customerName').value.trim(),
                    phone: document.getElementById('customerPhone').value.trim(),
                    email: document.getElementById('customerEmail').value.trim(),
                    address: document.getElementById('customerAddress').value.trim(),
                    city: document.getElementById('customerCity').value.trim(),
                    pincode: document.getElementById('customerPincode').value.trim()
                };

                // Validation
                if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.pincode) {
                    showNotification('Please fill all required fields', 'error');
                    return;
                }

                if (customerDetails.phone.length < 10) {
                    showNotification('Please enter a valid 10-digit phone number', 'error');
                    return;
                }

                if (customerDetails.pincode.length !== 6) {
                    showNotification('Please enter a valid 6-digit pincode', 'error');
                    return;
                }

                document.body.removeChild(modalContainer);
                resolve(customerDetails);
            });

            cancelBtn.addEventListener('click', function() {
                document.body.removeChild(modalContainer);
                resolve(null);
            });

            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    document.body.removeChild(modalContainer);
                    resolve(null);
                }
            });
        });
    }

    // Order Message Generation
    function generateOrderMessage(customerDetails, paymentId, subtotal, total) {
        let message = `🛍️ *NEW ORDER - MEHFIL ACCESSORIES* 🛍️\n\n`;
        
        // Customer Information
        message += `*👤 CUSTOMER DETAILS:*\n`;
        message += `═══════════════════\n`;
        message += `• Name: ${customerDetails.name}\n`;
        message += `• Phone: ${customerDetails.phone}\n`;
        message += `• Email: ${customerDetails.email || 'Not provided'}\n`;
        message += `• Address: ${customerDetails.address}\n`;
        message += `• City: ${customerDetails.city}\n`;
        message += `• Pincode: ${customerDetails.pincode}\n\n`;
        
        // Payment Information
        message += `*💳 PAYMENT DETAILS:*\n`;
        message += `═══════════════════\n`;
        message += `• Payment ID: ${paymentId}\n`;
        message += `• Status: ✅ PAID SUCCESSFULLY\n\n`;
        
        // Order Items
        message += `*📦 ORDER SUMMARY:*\n`;
        message += `═══════════════════\n`;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
        });
        
        message += `═══════════════════\n`;
        message += `*Subtotal:* ₹${subtotal}\n`;
        message += `*Delivery Charge:* ₹${calculateDeliveryCharge(subtotal)}\n`;
        message += `*Total Amount:* ₹${total}\n\n`;
        message += `💰 *Payment Received:* ₹${total}\n\n`;
        
        message += `⏰ *Order Time:* ${new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        })}\n\n`;
        
        message += `Thank you! 🎉 Your order will be processed soon.`;
        
        return message;
    }

    // Order Backup
    function saveOrderBackup(message, customerDetails, paymentId) {
        try {
            const orders = JSON.parse(localStorage.getItem('mehfilOrders') || '[]');
            const orderData = {
                id: 'ORD_' + Date.now(),
                message: message,
                customer: customerDetails,
                paymentId: paymentId,
                timestamp: new Date().toISOString(),
                items: JSON.parse(JSON.stringify(cart)),
                total: parseInt(elements.totalPriceElement?.textContent || 0),
                status: 'paid'
            };
            
            orders.unshift(orderData);
            localStorage.setItem('mehfilOrders', JSON.stringify(orders));
            localStorage.setItem('lastOrderMessage', message);
        } catch (error) {
            console.error('Failed to save order backup:', error);
        }
    }

    // WhatsApp Integration
    function showAutoWhatsAppModal(message) {
        const modalHTML = `
            <div class="whatsapp-modal-overlay">
                <div class="whatsapp-modal">
                    <div class="whatsapp-loader"></div>
                    <h3>🔄 Sending Order to WhatsApp...</h3>
                    <p>We're automatically sending your order details to Mehfil Accessories.</p>
                    <p><small>If not redirected, we'll provide a direct link.</small></p>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        setTimeout(() => {
            if (document.body.contains(modalContainer)) {
                document.body.removeChild(modalContainer);
            }
        }, 5000);
    }

    function sendAutomaticWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        // Multiple methods to open WhatsApp
        const methods = [
            () => {
                const newWindow = window.open(whatsappUrl, '_blank');
                if (newWindow) return true;
            },
            () => {
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                }, 100);
                return true;
            },
            () => {
                const link = document.createElement('a');
                link.href = whatsappUrl;
                link.target = '_blank';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return true;
            }
        ];

        for (const method of methods) {
            try {
                if (method()) {
                    showNotification('Order sent to WhatsApp! 📱', 'success');
                    return true;
                }
            } catch (error) {
                console.log('WhatsApp method failed:', error);
            }
        }

        // Fallback manual option
        showManualWhatsAppOption(message);
        return false;
    }

    function showManualWhatsAppOption(message) {
        const modalHTML = `
            <div class="whatsapp-modal-overlay">
                <div class="whatsapp-modal">
                    <h3>📱 Send Order Details</h3>
                    <p>Click the button below to send your order via WhatsApp:</p>
                    <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}" 
                       target="_blank" class="whatsapp-btn">
                        <i class="fab fa-whatsapp"></i> Send via WhatsApp
                    </a>
                    <button class="copy-btn" onclick="navigator.clipboard.writeText('${message.replace(/'/g, "\\'")}').then(() => alert('Message copied!'))">
                        <i class="fas fa-copy"></i> Copy Message
                    </button>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
    }

    // Utility Functions
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'error' : ''}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Error Handling
    window.addEventListener('error', function(e) {
        console.error('Global error:', e.error);
        showNotification('Something went wrong. Please refresh the page.', 'error');
    });

    // Initialize the application
    init();
});

// Add CSS for additional styles
const additionalStyles = `
    .empty-cart-message {
        text-align: center;
        padding: 3rem;
        color: #888;
    }
    
    .empty-cart-message i {
        font-size: 3rem;
        opacity: 0.5;
        margin-bottom: 1rem;
        display: block;
    }
    
    .empty-cart-message p {
        margin: 0.5rem 0;
        font-size: 1.1rem;
    }
    
    .empty-cart-message small {
        font-size: 0.9rem;
        opacity: 0.7;
    }
    
    .customer-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
    }
    
    .customer-modal {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .customer-modal h3 {
        margin-bottom: 1.5rem;
        color: #333;
        text-align: center;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #555;
    }
    
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s;
        box-sizing: border-box;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #ff6b6b;
    }
    
    .form-row {
        display: flex;
        gap: 1rem;
    }
    
    .form-row .form-group {
        flex: 1;
    }
    
    .modal-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .cancel-btn,
    .submit-btn {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .cancel-btn {
        background: #f8f9fa;
        color: #333;
        border: 2px solid #ddd;
    }
    
    .submit-btn {
        background: #ff6b6b;
        color: white;
        font-weight: 600;
    }
    
    .cancel-btn:hover {
        background: #e9ecef;
    }
    
    .submit-btn:hover {
        background: #ff5252;
        transform: translateY(-2px);
    }
    
    .whatsapp-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3001;
    }
    
    .whatsapp-modal {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        width: 90%;
    }
    
    .whatsapp-loader {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #25D366;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    .whatsapp-btn {
        display: inline-block;
        padding: 12px 24px;
        background: #25D366;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        margin: 10px;
        transition: all 0.3s;
    }
    
    .whatsapp-btn:hover {
        background: #128C7E;
        transform: translateY(-2px);
    }
    
    .copy-btn {
        padding: 10px 20px;
        background: #f8f9fa;
        border: 1px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .copy-btn:hover {
        background: #e9ecef;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .color-label.selected {
        box-shadow: 0 0 0 2px #ff6b6b;
    }
    
    .product-price {
        font-size: 1.3rem;
        font-weight: bold;
        color: #ff6b6b;
        margin: 0.5rem 0;
    }
    
    .carousel-container.initialized .carousel-track {
        display: flex;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
