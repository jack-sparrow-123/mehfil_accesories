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
    const deliveryCharge = 30;

    // CHANGE THESE TWO LINES ONLY
    const RAZORPAY_KEY = 'rzp_live_RgpnRGCoR6wfMo';  // ← Your Razorpay key
    const WHATSAPP_NUMBER = '7902823605';         // ← Your WhatsApp number with country code

    // Load Razorpay
    if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => console.log('Razorpay loaded');
        script.onerror = () => showNotification('Failed to load payment gateway', 'error');
        document.head.appendChild(script);
    }

    // Add CSS for customer modal
    addCustomerModalStyles();

    try {
        initializeAllProducts();
        createFloatingSparkles();
        updateCart();
        initializeEventListeners();
    } catch (error) {
        console.error('Init error:', error);
    }

    function addCustomerModalStyles() {
        if (document.getElementById('customer-modal-styles')) return;
        
        const styles = `
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
                z-index: 10000;
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

            .auto-whatsapp-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
            }

            .auto-whatsapp-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                max-width: 400px;
                width: 90%;
            }

            .auto-whatsapp-content h3 {
                color: #25D366;
                margin-bottom: 1rem;
            }

            .auto-whatsapp-content p {
                margin-bottom: 1.5rem;
                color: #555;
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

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'customer-modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createFloatingSparkles() {
        const count = 15;
        for (let i = 0; i < count; i++) {
            const s = document.createElement('div');
            s.className = 'floating-sparkle';
            s.style.left = Math.random() * 100 + 'vw';
            s.style.top = Math.random() * 100 + 'vh';
            s.style.animationDelay = Math.random() * 5 + 's';
            s.style.animationDuration = 3 + Math.random() * 2 + 's';
            document.body.appendChild(s);
        }
    }

    function initializeAllProducts() {
        if (!allProductsGrid) return;
        allProductsGrid.innerHTML = '';

        const allProducts = [
            { id: '1', name: 'Large Rhinestone Claw Clip', price: 90, image: 'images/claw1.jpeg' },
            { id: '2', name: 'Glass Flower Claws', price: 20, image: 'images/claw2.jpeg' },
            { id: '3', name: 'Double Daisy Flower Claw', price: 40, image: 'images/claw3.jpeg' },
            { id: '4', name: 'Flower Claws', price: 20, image: 'images/claw4.jpeg' },
            { id: '5', name: 'Hair Claws', price: 34, image: 'images/claw5.jpeg' },
            { id: '6', name: 'Pinterest Glossy Hair Claws', price: 30, image: 'images/claw6.jpeg' },
            { id: '7', name: 'Trending Flower Claw', price: 30, image: 'images/claw7.jpeg' },
            { id: '8', name: 'Medium Viral Flower Claws', price: 20, image: 'images/claw8.jpeg' },
            { id: '9', name: 'Bun Hair Ties (set of 6)', price: 10, image: 'images/head1.jpeg' },
            { id: '10', name: 'Heart Mini Claws', price: 15, image: 'images/min1.jpeg' },
            { id: '11', name: 'Mini Butterfly Clips', price: 10, image: 'images/min2.jpeg' },
            { id: '12', name: 'Cute Flower Mini Claws', price: 15, image: 'images/min3.jpeg' },
            { id: '13', name: 'Tear Drop Earrings (Green & Pink)', price: 40, image: 'images/ear1.jpeg' },
            { id: '14', name: 'Starfish Earrings', price: 40, image: 'images/ear2.jpeg' },
            { id: '15', name: 'Daisy Earrings (Multiple colours)', price: 40, image: 'images/ear3.jpeg' },
            { id: '16', name: 'Smiley Flower Earrings (Multiple colours)', price: 40, image: 'images/ear4.jpeg' },
            { id: '17', name: 'Light & Image Reflection Charms', price: 99, image: 'images/key1.jpeg' },
            { id: '18', name: 'Scrunchies (Blue, Yellow, Orange, Pink)', price: 12, image: 'images/scrunchie1.jpeg' },
            { id: '19', name: 'Pendent', price: 40, image: 'images/pend1.jpeg' },
            { id: '20', name: 'Gift Hamper', price: 99, image: 'images/hamper.jpeg' },
            { id: '21', name: 'Customizable Flower Claw Bouquet', price: 500, image: 'images/bouquet.jpeg' }
        ];

        allProducts.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>₹${p.price}</p>
                <button class="add-to-cart" 
                        data-id="${p.id}" 
                        data-name="${p.name}" 
                        data-price="${p.price}" 
                        data-image="${p.image}">
                    Add to Cart
                </button>
            `;
            allProductsGrid.appendChild(card);
        });
    }

    function initializeEventListeners() {
        if (cartIcon) cartIcon.addEventListener('click', () => { cartSidebar?.classList.add('active'); overlay?.classList.add('active'); });
        if (closeCart) closeCart.addEventListener('click', () => { cartSidebar?.classList.remove('active'); overlay?.classList.remove('active'); });
        if (overlay) overlay.addEventListener('click', () => { cartSidebar?.classList.remove('active'); overlay?.classList.remove('active'); });

        // RAZORPAY CHECKOUT WITH AUTOMATIC WHATSAPP
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length === 0) {
                    showNotification('Your cart is empty!', 'error');
                    return;
                }

                const total = parseInt(totalPriceElement?.textContent || 0);
                const subtotal = parseInt(subtotalElement?.textContent || 0);

                // STEP 1: COLLECT CUSTOMER DETAILS BEFORE PAYMENT
                collectCustomerDetails().then(customerDetails => {
                    if (!customerDetails) {
                        showNotification('Please provide your details to continue', 'error');
                        return;
                    }

                    const options = {
                        key: RAZORPAY_KEY,
                        amount: total * 100,
                        currency: 'INR',
                        name: 'Mehfil Accessories',
                        description: 'Thank you for shopping!',
                        image: 'images/logo.png',
                        handler: async function (response) {
                            const paymentId = response.razorpay_payment_id;

                            // Create comprehensive order message
                            const message = generateOrderMessage(customerDetails, paymentId, subtotal, total);
                            
                            // Save order first
                            saveOrderBackup(message, customerDetails, paymentId);
                            
                            // Show auto WhatsApp modal
                            showAutoWhatsAppModal(message);
                            
                            // Try multiple automatic WhatsApp methods
                            setTimeout(() => {
                                sendAutomaticWhatsApp(message);
                            }, 1000);

                            // Clear cart
                            cart = [];
                            localStorage.setItem('mehfilCart', JSON.stringify(cart));
                            updateCart();
                            cartSidebar?.classList.remove('active');
                            overlay?.classList.remove('active');
                        },
                        prefill: {
                            name: customerDetails.name,
                            email: customerDetails.email, 
                            contact: customerDetails.phone
                        },
                        theme: {
                            color: '#ff6b6b'
                        },
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

                    try {
                        const rzp = new Razorpay(options);
                        rzp.open();
                    } catch (error) {
                        console.error('Razorpay error:', error);
                        showNotification('Payment gateway error. Please try again.', 'error');
                    }

                }).catch(error => {
                    console.error('Customer details collection failed:', error);
                });
            });
        }

        // Add to cart buttons
        document.addEventListener('click', e => {
            if (e.target.classList.contains('add-to-cart')) {
                const b = e.target;
                addToCart(b.dataset.id, b.dataset.name, parseInt(b.dataset.price), b.dataset.image);
            }
        });
    }

    // FUNCTION TO GENERATE ORDER MESSAGE
    function generateOrderMessage(customerDetails, paymentId, subtotal, total) {
        let message = `🛍️ *NEW ORDER - MEHFIL ACCESSORIES* 🛍️\n\n`;
        
        // CUSTOMER INFORMATION SECTION
        message += `*👤 CUSTOMER DETAILS:*\n`;
        message += `═══════════════════\n`;
        message += `• Name: ${customerDetails.name}\n`;
        message += `• Phone: ${customerDetails.phone}\n`;
        message += `• Email: ${customerDetails.email || 'Not provided'}\n`;
        message += `• Address: ${customerDetails.address}\n`;
        message += `• City: ${customerDetails.city}\n`;
        message += `• Pincode: ${customerDetails.pincode}\n\n`;
        
        // PAYMENT INFORMATION
        message += `*💳 PAYMENT DETAILS:*\n`;
        message += `═══════════════════\n`;
        message += `• Payment ID: ${paymentId}\n`;
        message += `• Status: ✅ PAID SUCCESSFULLY\n\n`;
        
        // ORDER ITEMS
        message += `*📦 ORDER SUMMARY:*\n`;
        message += `═══════════════════\n`;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}\n\n`;
        });
        
        message += `═══════════════════\n`;
        message += `*Subtotal:* ₹${subtotal}\n`;
        message += `*Delivery Charge:* ₹${deliveryCharge}\n`;
        message += `*Total Amount:* ₹${total}\n\n`;
        message += `💰 *Payment Received:* ₹${total}\n\n`;
        
        message += `⏰ *Order Time:* ${new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        })}\n\n`;
        
        message += `Thank you! 🎉`;
        
        return message;
    }

    // FUNCTION TO SHOW AUTO WHATSAPP MODAL
    function showAutoWhatsAppModal(message) {
        const modalHTML = `
            <div class="auto-whatsapp-modal">
                <div class="auto-whatsapp-content">
                    <div class="whatsapp-loader"></div>
                    <h3>🔄 Sending Order Details...</h3>
                    <p>We're automatically sending your order details to Mehfil Accessories via WhatsApp.</p>
                    <p><small>If not redirected automatically, we'll provide a direct link.</small></p>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(modalContainer)) {
                document.body.removeChild(modalContainer);
            }
        }, 5000);
    }

    // MULTI-METHOD AUTOMATIC WHATSAPP SENDING
    function sendAutomaticWhatsApp(message) {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        
        console.log('Attempting automatic WhatsApp send...');
        
        // METHOD 1: Direct window.open (most reliable)
        try {
            const newWindow = window.open(whatsappUrl, '_blank');
            if (newWindow) {
                console.log('Method 1: Window.open successful');
                showNotification('Order details sent to WhatsApp automatically!', 'success');
                return true;
            }
        } catch (error) {
            console.log('Method 1 failed:', error);
        }
        
        // METHOD 2: Location href (works in some browsers)
        try {
            setTimeout(() => {
                window.location.href = whatsappUrl;
            }, 100);
            console.log('Method 2: Location href attempted');
            return true;
        } catch (error) {
            console.log('Method 2 failed:', error);
        }
        
        // METHOD 3: Create and click a link
        try {
            const link = document.createElement('a');
            link.href = whatsappUrl;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('Method 3: Programmatic click attempted');
            showNotification('Opening WhatsApp...', 'success');
            return true;
        } catch (error) {
            console.log('Method 3 failed:', error);
        }
        
        // METHOD 4: If all automatic methods fail, show manual option
        console.log('All automatic methods failed, showing manual option');
        showManualWhatsAppOption(message);
        return false;
    }

    // MANUAL FALLBACK OPTION
    function showManualWhatsAppOption(message) {
        const modalHTML = `
            <div class="auto-whatsapp-modal">
                <div class="auto-whatsapp-content">
                    <h3>📱 Send Order Details</h3>
                    <p>Please click the button below to send your order details via WhatsApp:</p>
                    <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}" 
                       target="_blank" 
                       style="display: inline-block; padding: 12px 24px; background: #25D366; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
                        Send via WhatsApp
                    </a>
                    <p><small>Or copy the message and send it manually.</small></p>
                    <button onclick="navigator.clipboard.writeText('${message.replace(/'/g, "\\'")}').then(() => alert('Message copied!'))" 
                            style="padding: 8px 16px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; cursor: pointer;">
                        Copy Message
                    </button>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);

        // Close when clicking outside
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
    }

    // FUNCTION TO COLLECT CUSTOMER DETAILS
    function collectCustomerDetails() {
        return new Promise((resolve) => {
            const modalHTML = `
                <div class="customer-modal-overlay">
                    <div class="customer-modal">
                        <h3>📋 Shipping Details</h3>
                        <form id="customerForm">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" id="customerName" required placeholder="Enter your full name">
                            </div>
                            <div class="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" id="customerPhone" required placeholder="Enter your WhatsApp number">
                            </div>
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" id="customerEmail" placeholder="Enter your email">
                            </div>
                            <div class="form-group">
                                <label>Full Address *</label>
                                <textarea id="customerAddress" required placeholder="Enter your complete address" rows="3"></textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>City *</label>
                                    <input type="text" id="customerCity" required placeholder="Your city">
                                </div>
                                <div class="form-group">
                                    <label>Pincode *</label>
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

                if (!customerDetails.name || !customerDetails.phone || !customerDetails.address || !customerDetails.city || !customerDetails.pincode) {
                    showNotification('Please fill all required fields', 'error');
                    return;
                }

                if (customerDetails.phone.length < 10) {
                    showNotification('Please enter a valid phone number', 'error');
                    return;
                }

                document.body.removeChild(modalContainer);
                resolve(customerDetails);
            });

            cancelBtn.addEventListener('click', function() {
                document.body.removeChild(modalContainer);
                resolve(null);
            });
        });
    }

    // BACKUP FUNCTION
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
                total: parseInt(totalPriceElement?.textContent || 0),
                status: 'paid',
                whatsappSent: true
            };
            
            orders.unshift(orderData);
            localStorage.setItem('mehfilOrders', JSON.stringify(orders));
            console.log('Order saved locally:', orderData.id);
            
            localStorage.setItem('lastOrderMessage', message);
        } catch (error) {
            console.error('Failed to save order backup:', error);
        }
    }

    function addToCart(id, name, price, image) {
        const existing = cart.find(i => i.id === id);
        if (existing) existing.quantity++;
        else cart.push({ id, name, price, image, quantity: 1 });
        localStorage.setItem('mehfilCart', JSON.stringify(cart));
        updateCart();
        showNotification(`${name} added!`);
        cartSidebar?.classList.add('active');
        overlay?.classList.add('active');
    }

    function updateCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0, count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<div style="text-align:center;padding:3rem;color:#888;">
                <i class="fas fa-shopping-cart" style="font-size:3rem;opacity:0.5;"></i>
                <p>Your cart is empty</p>
            </div>`;
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                count += item.quantity;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
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
                cartItemsContainer.appendChild(div);
            });
        }

        if (subtotalElement) subtotalElement.textContent = total;
        if (totalPriceElement) totalPriceElement.textContent = total + deliveryCharge;
        if (cartCount) cartCount.textContent = count;

        cartItemsContainer.addEventListener('click', e => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const id = btn.dataset.id;
            if (!id) return;

            if (btn.classList.contains('minus')) {
                const item = cart.find(i => i.id === id);
                if (item.quantity > 1) item.quantity--;
                else cart = cart.filter(i => i.id !== id);
            }
            if (btn.classList.contains('plus')) cart.find(i => i.id === id).quantity++;
            if (btn.classList.contains('remove-item')) cart = cart.filter(i => i.id !== id);

            localStorage.setItem('mehfilCart', JSON.stringify(cart));
            updateCart();
        });
    }

    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const n = document.createElement('div');
        n.className = `notification ${type}`;
        n.innerHTML = `<div class="notification-content">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>`;
        document.body.appendChild(n);

        setTimeout(() => {
            n.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => n.remove(), 300);
        }, 3000);
    }

    if (!document.getElementById('slideOutStyle')) {
        const style = document.createElement('style');
        style.id = 'slideOutStyle';
        style.textContent = `@keyframes slideOutRight { from {opacity:1;transform:translateX(0)} to {opacity:0;transform:translateX(100%)}}`;
        document.head.appendChild(style);
    }
});
