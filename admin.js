// DOM Elements
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const adminDashboard = document.getElementById('admin-dashboard');
const logoutBtn = document.getElementById('logout-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const themeToggle = document.getElementById('theme-toggle');

// Fix for GitHub Pages - detect base URL
const BASE_URL = detectBaseUrl();

// Detect if running on GitHub Pages and get the correct base URL
function detectBaseUrl() {
    const url = window.location.href;
    // Check if on GitHub Pages (contains github.io)
    if (url.includes('github.io')) {
        // Extract the repo name which becomes the base path in GitHub Pages
        const pathSegments = window.location.pathname.split('/');
        // The first segment after the domain will be the repo name
        if (pathSegments.length > 1) {
            const repoName = pathSegments[1]; // This would be your repo name
            console.log(`Detected GitHub Pages deployment with repo: ${repoName}`);
            return `/${repoName}`;
        }
    }
    // Local development or root deployment
    return '';
}

// Utility function to fix URLs for GitHub Pages
function fixUrl(url) {
    // If it's an absolute URL (starts with http:// or https://) or a data URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
        return url;
    }

    // If it's a relative URL that starts with /, add the base URL
    if (url.startsWith('/')) {
        return BASE_URL + url;
    }

    // If it's a relative URL that doesn't start with /, add the base URL and /
    return BASE_URL + '/' + url;
}

// Image Management
const imageUploadForm = document.getElementById('image-upload-form');
const imageTitle = document.getElementById('image-title');
const imageUrl = document.getElementById('image-url');
const imageFile = document.getElementById('image-file');
const imagePreview = document.getElementById('image-preview');
const imagesGallery = document.getElementById('images-gallery');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const uploadMethods = document.querySelectorAll('.upload-method');
const fileDropAreas = document.querySelectorAll('.file-drop-area');

// Quick Add Image
const quickImageTitle = document.getElementById('quick-image-title');
const quickImageUrl = document.getElementById('quick-image-url');
const quickAddBtn = document.getElementById('quick-add-btn');

// Ad Management
const adUploadForm = document.getElementById('ad-upload-form');
const adTitle = document.getElementById('ad-title');
const adType = document.getElementById('ad-type');
const adPosition = document.getElementById('ad-position');
const adUrl = document.getElementById('ad-url');
const adFile = document.getElementById('ad-file');
const adLink = document.getElementById('ad-link');
const adHtmlCode = document.getElementById('ad-html-code');
const adPreview = document.getElementById('ad-preview');
const adsGallery = document.getElementById('ads-gallery');

// Settings
const settingsForm = document.getElementById('settings-form');
const randomPopupFrequency = document.getElementById('random-popup-frequency');
const popupDelay = document.getElementById('popup-delay');
const enableTrending = document.getElementById('enable-trending');
const enableSponsored = document.getElementById('enable-sponsored');

// Constants
const ADMIN_PASSWORD = 'admin001';
const ADMIN_USERNAME = 'admin001';

// Check if already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');

    if (isLoggedIn === 'true') {
        showAdminDashboard();
    } else {
        showLoginForm();
    }
}

// Show login form
function showLoginForm() {
    loginSection.classList.add('active');
    adminDashboard.classList.remove('active');
}

// Show admin dashboard
function showAdminDashboard() {
    loginSection.classList.remove('active');
    adminDashboard.classList.add('active');

    // Load content for the dashboard
    loadImages();
    loadAds();
    loadSettings();
}

// Theme Management
function initTheme() {
    // Check if user has previously set a theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (password === ADMIN_PASSWORD && (username === ADMIN_USERNAME)) {
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminDashboard();
        loginError.textContent = '';
    } else {
        loginError.textContent = 'Invalid username or password. Please try again.';
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    showLoginForm();
});

// Tab Switching
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        button.classList.add('active');
        const tabId = `${button.dataset.tab}-tab`;
        document.getElementById(tabId).classList.add('active');
    });
});

// Toggle Upload Methods
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const container = button.closest('.form-group');
        const buttons = container.querySelectorAll('.toggle-btn');
        const target = button.dataset.target;

        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const uploadMethodsToToggle = document.getElementById(target).closest('form').querySelectorAll('.upload-method');
        uploadMethodsToToggle.forEach(method => {
            method.classList.remove('active');
            if (method.id === target) {
                method.classList.add('active');
            }
        });

        // Clear preview when switching methods
        clearFileInputs();
    });
});

// Clear file inputs
function clearFileInputs() {
    imageFile.value = '';
    adFile.value = '';
    imageUrl.value = '';
    adUrl.value = '';
    imagePreview.innerHTML = '';
    adPreview.innerHTML = '';
}

// File Drop Handling
fileDropAreas.forEach(area => {
    const fileInput = area.closest('.form-group').querySelector('input[type="file"]');

    area.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files, fileInput.id === 'image-file' ? imagePreview : adPreview);
    });

    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.classList.add('drag-over');
    });

    area.addEventListener('dragleave', () => {
        area.classList.remove('drag-over');
    });

    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files, fileInput.id === 'image-file' ? imagePreview : adPreview);
        fileInput.files = e.dataTransfer.files; // Set the input files to the dropped files
    });
});

// Handle files (for previews)
function handleFiles(files, previewEl) {
    if (!files || !files.length) return;

    const file = files[0];
    if (!file.type.match('image.*') && !file.type.match('video.*')) {
        showError('Please select an image or video file');
        return;
    }

    previewEl.innerHTML = '';
    const reader = new FileReader();

    reader.onload = (e) => {
        if (file.type.match('image.*')) {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewEl.appendChild(img);
        } else {
            const video = document.createElement('video');
            video.src = e.target.result;
            video.controls = true;
            previewEl.appendChild(video);
        }
    };

    reader.readAsDataURL(file);
}

// Convert File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Load images from localStorage
function loadImages() {
    const storedImages = localStorage.getItem('galleryImages');

    if (storedImages) {
        const images = JSON.parse(storedImages);
        displayImages(images);
    } else {
        imagesGallery.innerHTML = '<div class="loading">No images found.</div>';
    }
}

// Display images in admin gallery
function displayImages(images) {
    imagesGallery.innerHTML = '';

    if (images.length === 0) {
        imagesGallery.innerHTML = '<div class="loading">No images found.</div>';
        return;
    }

    images.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.id = image.id;

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.className = 'gallery-img';

        const info = document.createElement('div');
        info.className = 'gallery-info';

        const title = document.createElement('div');
        title.className = 'gallery-title';
        title.textContent = image.title;

        const actions = document.createElement('div');
        actions.className = 'gallery-actions';

        const views = document.createElement('div');
        views.className = 'gallery-type';
        views.innerHTML = `<i class="fas fa-eye"></i> ${image.views || 0}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteBtn.addEventListener('click', () => deleteImage(image.id));

        actions.appendChild(views);
        actions.appendChild(deleteBtn);
        info.appendChild(title);
        info.appendChild(actions);

        galleryItem.appendChild(img);
        galleryItem.appendChild(info);

        imagesGallery.appendChild(galleryItem);
    });
}

// Delete an image
function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        const storedImages = localStorage.getItem('galleryImages');

        if (storedImages) {
            let images = JSON.parse(storedImages);
            images = images.filter(image => image.id !== id);

            localStorage.setItem('galleryImages', JSON.stringify(images));
            displayImages(images);
            showToast('Image deleted successfully');
        }
    }
}

// Preview image when URL is entered
imageUrl.addEventListener('input', () => {
    const url = imageUrl.value.trim();

    if (url) {
        imagePreview.innerHTML = `<img src="${url}" alt="Preview">`;
    } else {
        imagePreview.innerHTML = '';
    }
});

// Toggle Upload Methods based on Ad Type
adType.addEventListener('change', function () {
    const selectedType = adType.value;

    // Reset placeholder and URL validation
    if (selectedType === 'image') {
        adUrl.placeholder = 'Enter image URL';
        adUrl.type = 'url';
    } else if (selectedType === 'video') {
        adUrl.placeholder = 'Enter video URL';
        adUrl.type = 'url';
    }

    // Update preview based on the selected type
    updateAdPreview();
});

// Preview ad when URL is entered
adUrl.addEventListener('input', updateAdPreview);

function updateAdPreview() {
    const type = adType.value;
    adPreview.innerHTML = '';

    const url = adUrl.value.trim();
    if (!url) return;

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Ad Preview';
        adPreview.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.muted = true;
        adPreview.appendChild(video);
    }
}

// Handle ad upload form submission
adUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = adTitle.value.trim();
    const type = adType.value;
    const position = adPosition.value;
    const link = adLink.value.trim();
    let url = '';

    const isUrlUpload = document.querySelector('.toggle-btn[data-target="ad-url-upload"]').classList.contains('active');

    if (isUrlUpload) {
        url = adUrl.value.trim();
        if (!url) {
            showError('Please enter an ad URL');
            return;
        }
    } else {
        if (!adFile.files.length) {
            showError('Please select a file to upload');
            return;
        }

        try {
            url = await fileToBase64(adFile.files[0]);
        } catch (error) {
            showError('Error processing file: ' + error.message);
            return;
        }
    }

    if (!link) {
        showError('Please enter a destination URL for your ad');
        return;
    }

    if (title && url && link) {
        addNewAd(title, type, position, url, link);

        // Clear form
        adTitle.value = '';
        adUrl.value = '';
        adFile.value = '';
        adLink.value = '';
        adPreview.innerHTML = '';
    } else {
        showError('Please fill in all required fields');
    }
});

// Load ads from localStorage
function loadAds() {
    const storedAds = localStorage.getItem('galleryAds');

    if (storedAds) {
        const ads = JSON.parse(storedAds);
        displayAds(ads);
    } else {
        adsGallery.innerHTML = '<div class="loading">No ads found.</div>';
    }
}

// Display ads in admin gallery
function displayAds(ads) {
    adsGallery.innerHTML = '';

    if (ads.length === 0) {
        adsGallery.innerHTML = '<div class="loading">No ads found.</div>';
        return;
    }

    ads.forEach(ad => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.id = ad.id;

        let mediaElement;

        if (ad.type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = ad.url;
            mediaElement.alt = ad.title;
        } else if (ad.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = ad.url;
            mediaElement.muted = true;
            mediaElement.controls = true;
        }

        mediaElement.className = 'gallery-img';

        const info = document.createElement('div');
        info.className = 'gallery-info';

        const title = document.createElement('div');
        title.className = 'gallery-title';
        title.textContent = ad.title;

        const actions = document.createElement('div');
        actions.className = 'gallery-actions';

        const adType = document.createElement('div');
        adType.className = 'gallery-type';

        // Determine ad position for the label
        let positionLabel = 'Unknown';
        if (ad.url.includes('200x600') || ad.title.includes('Sidebar')) {
            positionLabel = 'Sidebar';
        } else if (ad.url.includes('200x200') || ad.title.includes('Corner')) {
            positionLabel = 'Corner';
        } else if (ad.title.includes('Full Screen')) {
            positionLabel = 'Full Screen';
        } else if (ad.title.includes('Featured') || ad.title.includes('Banner')) {
            positionLabel = 'Banner';
        } else if (ad.title.includes('Popup')) {
            positionLabel = 'Popup';
        }

        adType.innerHTML = `<i class="fas fa-ad"></i> ${positionLabel}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteBtn.addEventListener('click', () => deleteAd(ad.id));

        actions.appendChild(adType);
        actions.appendChild(deleteBtn);
        info.appendChild(title);
        info.appendChild(actions);

        galleryItem.appendChild(mediaElement);
        galleryItem.appendChild(info);

        adsGallery.appendChild(galleryItem);
    });
}

// Delete an ad
function deleteAd(id) {
    if (confirm('Are you sure you want to delete this ad?')) {
        const storedAds = localStorage.getItem('galleryAds');

        if (storedAds) {
            let ads = JSON.parse(storedAds);
            ads = ads.filter(ad => ad.id !== id);

            localStorage.setItem('galleryAds', JSON.stringify(ads));
            displayAds(ads);
            showToast('Ad deleted successfully');
        }
    }
}

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('gallerySettings') || '{}');

    // Set form values from stored settings or use defaults
    randomPopupFrequency.value = settings.popupFrequency || 'medium';
    popupDelay.value = settings.popupDelay || 5;
    enableTrending.checked = settings.enableTrending !== false; // Default to true
    enableSponsored.checked = settings.enableSponsored !== false; // Default to true
}

// Save settings to localStorage
settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const settings = {
        popupFrequency: randomPopupFrequency.value,
        popupDelay: parseInt(popupDelay.value),
        enableTrending: enableTrending.checked,
        enableSponsored: enableSponsored.checked
    };

    localStorage.setItem('gallerySettings', JSON.stringify(settings));
    showToast('Settings saved successfully');
});

// Toast notification
function showToast(message) {
    // Check if a toast already exists and remove it
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        document.body.removeChild(existingToast);
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }, 100);
}

// Show error message
function showError(message) {
    showToast(message);
}

// Add styles for toast notifications
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: var(--primary-color);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

[data-theme="dark"] .toast {
    background-color: var(--accent-color);
}
`;
document.head.appendChild(toastStyles);

// Initialize theme
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    checkLoginStatus();
});

// Quick Add Image functionality
if (quickAddBtn) {
    quickAddBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const title = quickImageTitle.value.trim();
        const url = quickImageUrl.value.trim();

        if (!title) {
            showError('Please enter an image title');
            return;
        }

        if (!url) {
            showError('Please enter an image URL');
            return;
        }

        addNewImage(title, url);

        // Clear form
        quickImageTitle.value = '';
        quickImageUrl.value = '';

        showToast('Image added successfully');
    });
}

// Handle image upload form submission
imageUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = imageTitle.value.trim();
    let url = '';

    // Check if URL upload is active
    const isUrlUpload = document.querySelector('.toggle-btn[data-target="url-upload"]').classList.contains('active');

    if (isUrlUpload) {
        url = imageUrl.value.trim();
        if (!url) {
            showError('Please enter an image URL');
            return;
        }
    } else {
        if (!imageFile.files.length) {
            showError('Please select a file');
            return;
        }

        try {
            url = await fileToBase64(imageFile.files[0]);
        } catch (error) {
            showError('Error processing file: ' + error.message);
            return;
        }
    }

    if (title && url) {
        // Use our improved addNewImage function
        addNewImage(title, url);

        // Clear form
        imageTitle.value = '';
        imageUrl.value = '';
        imageFile.value = '';
        imagePreview.innerHTML = '';

        showToast('Image added successfully');
    } else {
        showError('Please fill in all required fields');
    }
});

// Navigation handling for admin page
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip special links like # anchors
        if (href === '#' || href.startsWith('javascript:')) {
            return;
        }

        e.preventDefault();

        // Navigate to the fixed URL
        window.location.href = fixUrl(href);
    });
});

// Fixed image adding function to handle absolute and relative URLs properly
function addNewImage(title, url, views = 0, likes = 0) {
    // Try to get existing images
    const storedImages = localStorage.getItem('galleryImages');
    let images = [];

    if (storedImages) {
        images = JSON.parse(storedImages);
    }

    // Generate a unique ID
    const maxId = images.length > 0 ? Math.max(...images.map(img => img.id)) : 0;
    const newId = maxId + 1;

    // Fix URL if it's a relative path
    const fixedUrl = fixUrl(url);

    // Create new image object
    const newImage = {
        id: newId,
        title: title,
        url: fixedUrl,
        views: views,
        likes: likes
    };

    // Add to the array
    images.push(newImage);

    // Save back to localStorage
    localStorage.setItem('galleryImages', JSON.stringify(images));

    // If gallery is visible, update it
    if (imagesGallery) {
        loadImages();
    }

    console.log('Added new image:', newImage);
    return newImage;
}

// Fixed adding new ad function to handle absolute and relative URLs properly
function addNewAd(title, type, position, url, link) {
    // Try to get existing ads
    const storedAds = localStorage.getItem('galleryAds');
    let ads = [];

    if (storedAds) {
        ads = JSON.parse(storedAds);
    }

    // Generate a unique ID
    const maxId = ads.length > 0 ? Math.max(...ads.map(ad => ad.id)) : 0;
    const newId = maxId + 1;

    // Fix URLs if they're relative paths
    const fixedUrl = fixUrl(url);
    const fixedLink = fixUrl(link);

    // Create new ad object
    const newAd = {
        id: newId,
        title: `${title} (${position})`,
        type: type,
        url: fixedUrl,
        link: fixedLink
    };

    // Add to the array
    ads.push(newAd);

    // Save back to localStorage
    localStorage.setItem('galleryAds', JSON.stringify(ads));

    // If ad gallery is visible, update it
    if (adsGallery) {
        loadAds();
    }

    showToast('Ad added successfully');
} 