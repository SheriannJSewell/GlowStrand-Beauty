//Sheriann Sewell 2210110

// Cart stored in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];


const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const productName = btn.dataset.product || btn.closest('.product-card').querySelector('h2, h3').textContent;
        const productPrice = parseInt(btn.dataset.price) || parseInt(btn.closest('.product-card').querySelector('.price').textContent.replace(/\D/g, ''));

        const existingItem = cart.find(item => item.name === productName);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} added to cart!`);

        const cartPage = document.getElementById('cartItems');
        if (cartPage) updateCartDisplay();
    });
});

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>
                <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input">
            </td>
            <td>${item.price}</td>
            <td>${itemSubtotal}</td>
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    const discount = 0;
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal - discount + tax;

    document.getElementById('cartDiscount').textContent = `JMD $${discount}`;
    document.getElementById('cartTax').textContent = `JMD $${tax}`;
    document.getElementById('cartTotal').textContent = `JMD $${total}`;

    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            let qty = parseInt(e.target.value);
            if (qty < 1) qty = 1;
            cart[index].quantity = qty;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        });
    });

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        });
    });
}

// Clear Cart
const clearCartBtn = document.getElementById('clearCart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    });
}

// Checkout Button
const checkoutCartBtn = document.getElementById('checkoutCart');
if (checkoutCartBtn) {
    checkoutCartBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
}


// Populate Checkout Page

function populateCheckout() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    if (!checkoutItemsContainer) return;

    checkoutItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${itemSubtotal}</td>
        `;
        checkoutItemsContainer.appendChild(row);
    });

    const discount = 0;
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal - discount + tax;

    document.getElementById('checkoutDiscount').textContent = `JMD $${discount}`;
    document.getElementById('checkoutTax').textContent = `JMD $${tax}`;
    document.getElementById('checkoutTotal').textContent = `JMD $${total}`;
}

// Confirm Order
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    populateCheckout();

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = checkoutForm.fullName.value.trim();
        const email = checkoutForm.email.value.trim();
        const address = checkoutForm.address.value.trim();

        localStorage.setItem('checkoutName', fullName);
        localStorage.setItem('checkoutEmail', email);
        localStorage.setItem('checkoutAddress', address);

        alert('Order confirmed! Thank you for shopping with GlowStrand Beauty.');

        localStorage.setItem('lastOrder', JSON.stringify(cart));

        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));

        window.location.href = 'invoice.html';
    });
}

// Cancel Order
const cancelOrderBtn = document.getElementById('cancelOrder');
if (cancelOrderBtn) {
    cancelOrderBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel your order?')) {
            window.location.href = 'cart.html';
        }
    });
}

// Clear Form
const clearFormBtn = document.getElementById('clearForm');
if (clearFormBtn) {
    clearFormBtn.addEventListener('click', () => {
        checkoutForm.reset();
    });
}


// Login Form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value.trim();
        const firstName = email.split("@")[0];

        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        localStorage.setItem('firstName', firstName);

        alert(`Welcome back, ${firstName}!`);

        loginForm.reset();
        window.location.href = 'index.html';
    });
}


// Register Form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullname = registerForm.fullname.value.trim();
        const email = registerForm.email.value.trim();
        const password = registerForm.password.value.trim();
        const confirmPassword = registerForm.confirmPassword.value.trim();

        if (!fullname || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        const firstName = fullname.split(" ")[0];
        localStorage.setItem('firstName', firstName);

        alert(`Registration successful! Welcome, ${firstName}.`);

        registerForm.reset();
        window.location.href = 'index.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const storedName = localStorage.getItem('firstName');

    if (storedName) {
        const header = document.querySelector("header");

        let welcomeMsg = document.querySelector(".welcome-message");
        if (!welcomeMsg) {
            welcomeMsg = document.createElement("div");
            welcomeMsg.classList.add("welcome-message");
            header.appendChild(welcomeMsg);
        }

        welcomeMsg.textContent = `Welcome back, ${storedName}!`;
    }

const navLinks = document.querySelectorAll('nav ul li a');
const currentPage = window.location.pathname.split("/").pop().toLowerCase(); 

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split("/").pop().toLowerCase(); 

    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});


    const cartPage = document.getElementById('cartItems');
    const checkoutPage = document.getElementById('checkoutItems');
    if (cartPage) updateCartDisplay();
    if (checkoutPage) populateCheckout();
});
