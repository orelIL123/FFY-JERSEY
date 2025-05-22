// Main JavaScript for FFY JERSEY website

// DOM Elements
const productGrid = document.getElementById('product-grid');
const productModal = document.getElementById('product-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const modalSizes = document.getElementById('modal-sizes');
const whatsappBtn = document.getElementById('whatsapp-btn');
const closeModal = document.querySelector('.close-modal');

// Global Variables
let products = [];
let selectedSize = '';
let currentProduct = null;

// Fetch products from JSON file
async function fetchProducts() {
    try {
        const response = await fetch('data/jerseys.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = `<div class="error">טעינת המוצרים נכשלה. אנא נסה שוב מאוחר יותר.</div>`;
    }
}

// Render products to the grid
function renderProducts() {
    if (products.length === 0) {
        productGrid.innerHTML = `<div class="no-products">אין מוצרים זמינים כרגע.</div>`;
        return;
    }

    productGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Create sizes HTML
        const sizesHTML = product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('');
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">₪${product.price}</div>
                <div class="product-sizes">${sizesHTML}</div>
                <button class="view-details" data-index="${index}">צפה בפרטים</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
        
        // Add event listener to the view details button
        const viewDetailsBtn = productCard.querySelector('.view-details');
        viewDetailsBtn.addEventListener('click', () => openModal(index));
    });
}

// Open product modal
function openModal(index) {
    currentProduct = products[index];
    
    modalImage.src = currentProduct.imageUrl;
    modalImage.alt = currentProduct.title;
    modalTitle.textContent = currentProduct.title;
    modalPrice.textContent = `₪${currentProduct.price}`;
    modalDescription.textContent = currentProduct.description || 'אין תיאור זמין.';
    
    // Create size options
    modalSizes.innerHTML = '';
    currentProduct.sizes.forEach(size => {
        const sizeOption = document.createElement('div');
        sizeOption.className = 'size-option';
        sizeOption.textContent = size;
        sizeOption.addEventListener('click', () => selectSize(size, sizeOption));
        modalSizes.appendChild(sizeOption);
    });
    
    // Reset selected size
    selectedSize = '';
    
    // Show modal with animation
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Close product modal
function closeProductModal() {
    productModal.style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Select size
function selectSize(size, element) {
    // Remove selected class from all size options
    const sizeOptions = modalSizes.querySelectorAll('.size-option');
    sizeOptions.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Update selected size
    selectedSize = size;
}

// Handle WhatsApp order
function orderViaWhatsApp() {
    if (!selectedSize) {
        alert('אנא בחר מידה תחילה.');
        return;
    }
    
    const message = `שלום, אני מעוניין להזמין:\n\n${currentProduct.title}\nמידה: ${selectedSize}\nמחיר: ₪${currentProduct.price}\n\n${currentProduct.imageUrl ? `תמונה: ${currentProduct.imageUrl}\n\n` : ''}אנא ספק מידע נוסף.`;
    
    // Encode the message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp in a new tab
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fetch products when page loads
    fetchProducts();
    
    // Close modal when clicking the close button
    closeModal.addEventListener('click', closeProductModal);
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            closeProductModal();
        }
    });
    
    // WhatsApp button click event
    whatsappBtn.addEventListener('click', orderViaWhatsApp);
    
    // Add animation delay to hero text elements
    const animatedElements = document.querySelectorAll('.animated-text');
    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.2}s`;
    });
});

// Add 3D effect to product cards
function add3DEffect() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            // Get card position
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            // Calculate mouse position relative to card center
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation (limited range)
            const rotateY = mouseX * 0.01;
            const rotateX = -mouseY * 0.01;
            
            // Apply rotation only if mouse is near the card
            const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
            const maxDistance = Math.max(rect.width, rect.height);
            
            if (distance < maxDistance) {
                card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            } else {
                card.style.transform = '';
            }
        });
    });
}

// Initialize 3D effect after products are loaded
window.addEventListener('load', () => {
    setTimeout(add3DEffect, 1000); // Delay to ensure products are rendered
});
