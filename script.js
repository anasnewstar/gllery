// DOM Elements
const imageGrid = document.getElementById('image-grid');
const leftAdContainer = document.getElementById('left-ad-container');
const rightAdContainer = document.getElementById('right-ad-container');
const cornerAd = document.getElementById('corner-ad');
const cornerAdCloseBtn = document.getElementById('corner-ad-close');
const adModal = document.getElementById('ad-modal');
const adModalContainer = document.getElementById('modal-ad-container');
const modalCloseBtn = document.getElementById('modal-close');
const imageModal = document.getElementById('image-modal');
const imageModalContainer = document.getElementById('modal-image-container');
const imageModalCloseBtn = document.getElementById('image-modal-close');

// New UI elements
const themeToggle = document.getElementById('theme-toggle');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const floatingAddBtn = document.getElementById('floating-add-btn');
const quickAddModal = document.getElementById('quick-add-modal');
const mobileAddBtn = document.getElementById('mobile-add-btn');
const mobileImageUrl = document.getElementById('mobile-image-url');
const quickAddClose = document.getElementById('quick-add-close');
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieSettings = document.getElementById('cookie-settings');
const featuredAdBanner = document.getElementById('featured-ad-banner');
const featuredAdContent = document.getElementById('featured-ad-content');
const featuredAdClose = document.getElementById('featured-ad-close');
const sponsoredLinksList = document.getElementById('sponsored-links-list');
const trendingImages = document.getElementById('trending-images');
const adCountdown = document.getElementById('ad-countdown');
const premiumBtn = document.getElementById('premium-btn');
const shareButtons = document.querySelectorAll('.share-btn');

// Performance optimizations
// Use a more efficient data structure with Map for faster lookups
const imageMap = new Map();
let sampleImages = [];
let sampleAds = [];
let adTimer = null;
let countdownInterval = null;

// Loading state tracking
let isLoading = false;

// Sample Data (will be replaced with localStorage data)
const defaultImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', title: 'Beautiful Landscape', views: 245, likes: 56 },
    { id: 2, url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57', title: 'Sunset Beach', views: 189, likes: 42 },
    { id: 3, url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b', title: 'Mountain Range', views: 312, likes: 89 },
    { id: 4, url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', title: 'Forest Pathway', views: 178, likes: 37 },
    { id: 5, url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7', title: 'Modern Architecture', views: 201, likes: 44 },
    { id: 6, url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e', title: 'Tranquil Nature', views: 267, likes: 61 },
    { id: 7, url: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c', title: 'Golden Sunset', views: 299, likes: 75 },
    { id: 8, url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797', title: 'Birds in Flight', views: 156, likes: 28 },
    { id: 9, url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07', title: 'Enchanted Forest', views: 287, likes: 68 },
];

// Default ad link - will be used for all ads if they don't have a specific link
const DEFAULT_AD_LINK = 'https://www.effectiveratecpm.com/mfq9ehgs?key=5dda470b0999d934423e0757a8bee5bd';

const defaultAds = [
    { id: 1, type: 'image', url: 'https://via.placeholder.com/200x600?text=Camera+Sale', title: 'Camera Sale', link: DEFAULT_AD_LINK },
    { id: 2, type: 'image', url: 'https://via.placeholder.com/200x600?text=Photography+Workshop', title: 'Photography Workshop', link: DEFAULT_AD_LINK },
    { id: 3, type: 'image', url: 'https://via.placeholder.com/200x600?text=Travel+Deals', title: 'Travel Deals', link: DEFAULT_AD_LINK },
    { id: 4, type: 'image', url: 'https://via.placeholder.com/200x200?text=Corner+Ad', title: 'Corner Ad', link: DEFAULT_AD_LINK },
    { id: 5, type: 'image', url: 'https://via.placeholder.com/800x500?text=Full+Screen+Ad', title: 'Full Screen Ad', link: DEFAULT_AD_LINK },
    { id: 6, type: 'image', url: 'https://via.placeholder.com/1200x120?text=Featured+Banner+Ad', title: 'Featured Banner Ad', link: DEFAULT_AD_LINK },
];

const sponsoredLinks = [
    { id: 1, title: 'Best Photography Gear 2023', image: 'https://via.placeholder.com/50?text=Gear', link: 'https://example.com/gear' },
    { id: 2, title: 'Learn Photography Online', image: 'https://via.placeholder.com/50?text=Learn', link: 'https://example.com/learn' },
    { id: 3, title: 'Photography Contest - Win Prizes', image: 'https://via.placeholder.com/50?text=Contest', link: 'https://example.com/contest' },
];

// Load gallery settings
let gallerySettings = {
    popupFrequency: 'medium',
    popupDelay: 5,
    enableTrending: true,
    enableSponsored: true
};

// Initialize settings
function loadGallerySettings() {
    const storedSettings = localStorage.getItem('gallerySettings');
    if (storedSettings) {
        gallerySettings = { ...gallerySettings, ...JSON.parse(storedSettings) };
    }

    // Apply settings to UI elements
    if (!gallerySettings.enableTrending && trendingImages) {
        trendingImages.closest('.trending-section').style.display = 'none';
    }

    if (!gallerySettings.enableSponsored && sponsoredLinksList) {
        sponsoredLinksList.closest('.sponsored-links').style.display = 'none';
    }
}

// Handle random popup ads
let canShowPopup = true;
let popupAdTimeout = null;

function scheduleRandomPopup() {
    if (!canShowPopup) return;

    // Clear any existing timeouts
    if (popupAdTimeout) {
        clearTimeout(popupAdTimeout);
    }

    // Determine delay based on frequency setting
    let minDelay, maxDelay;
    switch (gallerySettings.popupFrequency) {
        case 'low':
            minDelay = 60000; // 1 minute
            maxDelay = 120000; // 2 minutes
            break;
        case 'high':
            minDelay = 15000; // 15 seconds
            maxDelay = 30000; // 30 seconds
            break;
        case 'medium':
        default:
            minDelay = 30000; // 30 seconds
            maxDelay = 60000; // 1 minute
            break;
    }

    // Calculate random delay
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

    // Schedule popup
    popupAdTimeout = setTimeout(showRandomPopupAd, randomDelay);
}

// Show random popup ad
function showRandomPopupAd() {
    // Only show if we're not already showing an ad
    if (adModal.style.display === 'flex' || imageModal.style.display === 'flex') {
        // Reschedule if modals are already open
        scheduleRandomPopup();
        return;
    }

    // Get popup ads or any ads if none specifically marked as popup
    const popupAds = sampleAds.filter(ad => ad.title.includes('Popup'));
    const adPool = popupAds.length > 0 ? popupAds : sampleAds;

    if (adPool.length === 0) return;

    // Get random ad
    const randomAd = adPool[Math.floor(Math.random() * adPool.length)];

    // DEBUG: Log the popup ad being shown
    console.log("Showing random popup ad:", randomAd);

    // Show the ad
    showAdModal(randomAd, true);

    // Prevent multiple popups
    canShowPopup = false;
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

// Initialize Data from localStorage if available
function initializeData() {
    if (isLoading) return;
    isLoading = true;

    // Show loading state
    imageGrid.innerHTML = '<div class="loading">Loading gallery... <i class="fas fa-spinner fa-spin"></i></div>';

    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
        // Check if there's data in localStorage
        const storedImages = localStorage.getItem('galleryImages');
        const storedAds = localStorage.getItem('galleryAds');

        if (storedImages) {
            sampleImages = JSON.parse(storedImages);
        } else {
            // Initialize with sample data
            sampleImages = [...defaultImages];
            localStorage.setItem('galleryImages', JSON.stringify(sampleImages));
        }

        if (storedAds) {
            sampleAds = JSON.parse(storedAds);
        } else {
            // Initialize with sample ads
            sampleAds = [...defaultAds];
            localStorage.setItem('galleryAds', JSON.stringify(sampleAds));
        }

        // Update our imageMap for faster lookups
        imageMap.clear();
        sampleImages.forEach(img => {
            imageMap.set(img.id, img);
        });

        loadImages();
        setupAdRotation();
        loadSponsoredLinks();
        loadTrendingImages();

        // Show cookie banner if not accepted
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000);
        }

        isLoading = false;
    }, 0);
}

// Load sponsored links
function loadSponsoredLinks() {
    if (!sponsoredLinksList) return;

    sponsoredLinksList.innerHTML = '';

    sponsoredLinks.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.link;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.src = link.image;
        img.alt = link.title;

        const span = document.createElement('span');
        span.textContent = link.title;

        a.appendChild(img);
        a.appendChild(span);
        li.appendChild(a);

        sponsoredLinksList.appendChild(li);

        // Track ad clicks
        a.addEventListener('click', () => {
            trackAdClick(link.title);
        });
    });
}

// Load trending images
function loadTrendingImages() {
    if (!trendingImages) return;

    trendingImages.innerHTML = '';

    // Sort images by views to get the trending ones
    const trending = [...sampleImages].sort((a, b) => b.views - a.views).slice(0, 3);

    trending.forEach(image => {
        const trendingItem = document.createElement('div');
        trendingItem.className = 'trending-item';

        const trendingImage = document.createElement('div');
        trendingImage.className = 'trending-image';

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        trendingImage.appendChild(img);

        const trendingInfo = document.createElement('div');
        trendingInfo.className = 'trending-info';

        const title = document.createElement('div');
        title.className = 'trending-title';
        title.textContent = image.title;

        const stats = document.createElement('div');
        stats.className = 'trending-stats';

        const views = document.createElement('span');
        views.innerHTML = `<i class="fas fa-eye"></i> ${image.views}`;

        const likes = document.createElement('span');
        likes.innerHTML = `<i class="fas fa-heart"></i> ${image.likes}`;

        stats.appendChild(views);
        stats.appendChild(likes);

        trendingInfo.appendChild(title);
        trendingInfo.appendChild(stats);

        trendingItem.appendChild(trendingImage);
        trendingItem.appendChild(trendingInfo);

        trendingImages.appendChild(trendingItem);
    });
}

// Load images into the grid with optimized performance
function loadImages() {
    if (sampleImages.length === 0) {
        imageGrid.innerHTML = '<div class="loading">No images found. Please add some through the admin panel.</div>';
        return;
    }

    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Clear existing content
    imageGrid.innerHTML = '';

    // Precompute event listener to avoid memory leaks
    const clickHandler = handleImageClick;

    sampleImages.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.dataset.id = image.id;

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.title;
        img.loading = 'lazy'; // Use native lazy loading

        const title = document.createElement('div');
        title.className = 'image-title';
        title.textContent = image.title;

        imageItem.appendChild(img);
        imageItem.appendChild(title);
        imageItem.addEventListener('click', clickHandler);
        fragment.appendChild(imageItem);
    });

    // Batch DOM update for better performance
    imageGrid.appendChild(fragment);
}

// Toggle between grid and list view
function toggleViewMode(mode) {
    if (mode === 'grid') {
        imageGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        localStorage.setItem('viewMode', 'grid');
    } else {
        imageGrid.classList.add('list-view');
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        localStorage.setItem('viewMode', 'list');
    }
}

// Check saved view mode
function initViewMode() {
    const savedViewMode = localStorage.getItem('viewMode') || 'grid';
    toggleViewMode(savedViewMode);
}

// Handle image click - first show ad, then show image
let lastClickedImageId = null;
let adShownForImage = false;

function handleImageClick(event) {
    const imageId = parseInt(event.currentTarget.dataset.id);

    if (adShownForImage && lastClickedImageId === imageId) {
        // If ad was already shown for this image, show the full image
        const clickedImage = imageMap.get(imageId); // Using Map for faster lookup
        if (clickedImage) {
            // Increment view count
            clickedImage.views = (clickedImage.views || 0) + 1;
            localStorage.setItem('galleryImages', JSON.stringify(sampleImages));

            // Show image
            showImageModal(clickedImage);
        }
        adShownForImage = false;
    } else {
        // First click: show ad
        lastClickedImageId = imageId;
        adShownForImage = true;
        showAdModal();
    }
}

// Show full screen ad modal with smooth transitions and countdown
function showAdModal(specificAd = null, isPopup = false) {
    // Get ad to display
    let randomAd;
    if (specificAd) {
        randomAd = specificAd;
    } else {
        const modalAds = sampleAds.filter(ad => ad.title.includes('Full Screen'));
        const adPool = modalAds.length > 0 ? modalAds : sampleAds;
        randomAd = adPool[Math.floor(Math.random() * adPool.length)];
    }

    // DEBUG: Log the ad being displayed
    console.log("Showing modal ad:", randomAd);

    adModalContainer.innerHTML = '';

    if (randomAd.type === 'image') {
        // Create the container and make it clickable
        const adContainer = document.createElement('div');
        adContainer.style.cursor = 'pointer';
        adContainer.style.textAlign = 'center';
        adContainer.style.position = 'relative';
        adContainer.style.width = '100%';
        adContainer.style.height = '100%';

        // Debug: Add an attribute to help identify this element
        adContainer.setAttribute('data-ad-type', 'modal');

        // Add a visible CTA button overlay
        const ctaOverlay = document.createElement('div');
        ctaOverlay.style.position = 'absolute';
        ctaOverlay.style.bottom = '15px';
        ctaOverlay.style.left = '50%';
        ctaOverlay.style.transform = 'translateX(-50%)';
        ctaOverlay.style.backgroundColor = 'rgba(74, 111, 165, 0.9)';
        ctaOverlay.style.color = 'white';
        ctaOverlay.style.padding = '8px 15px';
        ctaOverlay.style.borderRadius = '5px';
        ctaOverlay.style.fontWeight = 'bold';
        ctaOverlay.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit Website';

        // Create the image
        const img = document.createElement('img');
        img.src = randomAd.url;
        img.alt = randomAd.title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70vh';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto';

        // FIXED: Only open in new tab, don't affect main page
        adContainer.addEventListener('click', function (e) {
            e.preventDefault(); // Stop default navigation

            console.log("Modal ad clicked, opening:", randomAd.link || DEFAULT_AD_LINK);

            // Open in new tab
            const newWindow = window.open(randomAd.link || DEFAULT_AD_LINK, '_blank');
            if (newWindow) {
                newWindow.focus();
            } else {
                console.log("Popup blocked");
            }

            // Track the click
            trackAdClick(randomAd.title);

            return false; // Also helps prevent default behavior
        });

        adContainer.appendChild(img);
        adContainer.appendChild(ctaOverlay);
        adModalContainer.appendChild(adContainer);
    } else if (randomAd.type === 'video') {
        const videoContainer = document.createElement('div');
        videoContainer.style.position = 'relative';
        videoContainer.style.cursor = 'pointer';

        // Make the container clickable
        videoContainer.addEventListener('click', function (e) {
            // Only if not clicking on controls
            if (e.target === videoContainer || e.target === overlay) {
                const win = window.open(randomAd.link || DEFAULT_AD_LINK, '_blank');
                win.focus();
                trackAdClick(randomAd.title);
            }
        });

        const video = document.createElement('video');
        video.src = randomAd.url;
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '70vh';

        videoContainer.appendChild(video);

        // Add an overlay to indicate clickability
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.bottom = '60px'; // Above video controls
        overlay.style.left = '50%';
        overlay.style.transform = 'translateX(-50%)';
        overlay.style.background = 'rgba(74, 111, 165, 0.9)';
        overlay.style.color = 'white';
        overlay.style.padding = '8px 15px';
        overlay.style.borderRadius = '5px';
        overlay.style.fontSize = '14px';
        overlay.style.fontWeight = 'bold';
        overlay.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit Website';

        videoContainer.appendChild(overlay);
        adModalContainer.appendChild(videoContainer);
    }

    // Start countdown
    let countdown = isPopup ? 3 : gallerySettings.popupDelay || 5;
    adCountdown.textContent = countdown;

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        countdown--;
        adCountdown.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            modalCloseBtn.textContent = 'Skip Ad';
        }
    }, 1000);

    // Update button text for popups
    if (isPopup) {
        modalCloseBtn.textContent = 'Close';
    } else {
        modalCloseBtn.textContent = 'Skip Ad (waiting...)';
    }

    // Use CSS classes for transitions instead of direct style changes
    adModal.style.display = 'flex';
    // Force a reflow to ensure the display change happens before adding the active class
    void adModal.offsetWidth;
    adModal.classList.add('active');
}

// Show full screen image modal with smooth transitions
function showImageModal(image) {
    imageModalContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = image.url;
    img.alt = image.title;

    imageModalContainer.appendChild(img);

    // Use CSS classes for transitions instead of direct style changes
    imageModal.style.display = 'flex';
    // Force a reflow to ensure the display change happens before adding the active class
    void imageModal.offsetWidth;
    imageModal.classList.add('active');
}

// Setup ad rotation in sidebars and corner
function setupAdRotation() {
    // Initial ad display
    rotateAds();

    // Set interval for ad rotation (30 seconds)
    if (adTimer) {
        clearInterval(adTimer);
    }
    adTimer = setInterval(rotateAds, 30000);

    // Show featured banner ad
    showFeaturedAd();
}

// Show featured banner ad
function showFeaturedAd() {
    if (!featuredAdBanner) return;

    // DEBUG: Log all available ads
    console.log("All ads for banner selection:", sampleAds);

    // Get all banner ads or any ad if no specific banner ads exist
    const featuredAds = sampleAds.filter(ad => ad.title.includes('Featured') || ad.title.includes('Banner'));
    const adPool = featuredAds.length > 0 ? featuredAds : sampleAds;

    if (adPool.length === 0) {
        console.log("No ads available for banner");
        return;
    }

    // Get random ad from the pool
    const randomFeaturedAd = adPool[Math.floor(Math.random() * adPool.length)];
    console.log("Selected banner ad:", randomFeaturedAd);

    // Ensure the banner is visible
    if (featuredAdBanner.style.display === 'none') {
        featuredAdBanner.style.display = 'block';
    }

    // Clear previous content
    featuredAdContent.innerHTML = '';

    // Create a direct link that will open in a new window
    const adLink = document.createElement('a');
    adLink.href = randomFeaturedAd.link || DEFAULT_AD_LINK;
    adLink.target = "_blank"; // Open in new tab
    adLink.rel = "noopener noreferrer"; // Security best practice

    // Style the link to fill the entire banner space
    adLink.style.display = 'block';
    adLink.style.width = '100%';
    adLink.style.height = '100%';
    adLink.style.cursor = 'pointer';
    adLink.style.position = 'relative'; // For absolute positioning of child elements

    // Debug: Add an attribute to help identify this element
    adLink.setAttribute('data-ad-type', 'banner');

    // FIXED: Only open in new tab, don't affect main page
    adLink.addEventListener('click', function (e) {
        e.preventDefault(); // Stop default navigation

        console.log("Banner ad clicked, opening:", adLink.href);

        // Open in new tab
        const newWindow = window.open(adLink.href, '_blank');
        if (newWindow) {
            newWindow.focus();
        } else {
            console.log("Popup blocked");
        }

        // Track the click
        trackAdClick(randomFeaturedAd.title);

        return false; // Also helps prevent default behavior
    });

    if (randomFeaturedAd.type === 'image') {
        // Create image with proper sizing to fill the container
        const img = document.createElement('img');
        img.src = randomFeaturedAd.url;
        img.alt = randomFeaturedAd.title;

        // Style the image to fill the entire space
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover'; // Fill the container completely
        img.style.objectPosition = 'center'; // Center the image
        img.style.display = 'block'; // Remove any extra spacing

        adLink.appendChild(img);
    } else if (randomFeaturedAd.type === 'video') {
        const video = document.createElement('video');
        video.src = randomFeaturedAd.url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        // Style video to fill the entire space
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.display = 'block';

        adLink.appendChild(video);
    } else {
        // Fallback text content
        const textDiv = document.createElement('div');
        textDiv.textContent = randomFeaturedAd.title;
        textDiv.style.width = '100%';
        textDiv.style.height = '100%';
        textDiv.style.display = 'flex';
        textDiv.style.justifyContent = 'center';
        textDiv.style.alignItems = 'center';
        textDiv.style.textAlign = 'center';
        textDiv.style.fontWeight = 'bold';
        textDiv.style.padding = '20px';
        textDiv.style.backgroundColor = '#f0f0f0';

        adLink.appendChild(textDiv);
    }

    // Add a "Visit Website" overlay to make it obvious it's clickable
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.bottom = '10px';
    overlay.style.right = '10px';
    overlay.style.backgroundColor = 'rgba(74, 111, 165, 0.9)';
    overlay.style.color = 'white';
    overlay.style.padding = '5px 10px';
    overlay.style.borderRadius = '4px';
    overlay.style.fontWeight = 'bold';
    overlay.style.fontSize = '12px';
    overlay.innerHTML = '<i class="fas fa-external-link-alt"></i> Visit Website';

    adLink.appendChild(overlay);
    featuredAdContent.appendChild(adLink);

    // Force a reflow to ensure styles are applied
    void featuredAdBanner.offsetWidth;
}

// Rotate ads in all positions
function rotateAds() {
    // Filter ads by size/type
    const sidebarAds = sampleAds.filter(ad => ad.url.includes('200x600') || !ad.url.includes('Corner'));
    const cornerAds = sampleAds.filter(ad => ad.url.includes('200x200') || ad.url.includes('Corner'));

    // Set sidebar ads
    if (sidebarAds.length > 0) {
        const leftAdIndex = Math.floor(Math.random() * sidebarAds.length);
        const rightAdIndex = (leftAdIndex + 1) % sidebarAds.length; // Different ad for right sidebar

        setAdContent(leftAdContainer, sidebarAds[leftAdIndex]);
        setAdContent(rightAdContainer, sidebarAds[rightAdIndex]);
    }

    // Set corner ad
    if (cornerAds.length > 0 && cornerAd) {
        const cornerAdIndex = Math.floor(Math.random() * cornerAds.length);
        setAdContent(cornerAd.querySelector('.ad-content'), cornerAds[cornerAdIndex]);
    }
}

// Set ad content in container with better performance
function setAdContent(container, ad) {
    if (!container) return;

    // DEBUG: Log the ad being displayed
    console.log("Setting ad content:", ad);

    // Clear the container first
    container.innerHTML = '';

    // Create a direct link that will open in a new window
    const adLink = document.createElement('a');
    adLink.href = ad.link || DEFAULT_AD_LINK;
    adLink.target = "_blank"; // Open in new tab
    adLink.rel = "noopener noreferrer";

    // Style the link to fill the entire container
    adLink.style.display = 'block';
    adLink.style.width = '100%';
    adLink.style.height = '100%';
    adLink.style.cursor = 'pointer';
    adLink.style.position = 'relative';

    // Debug: Add an attribute to help identify this element
    adLink.setAttribute('data-ad-type', 'sidebar');

    // FIXED: Only open in new tab, don't affect main page
    adLink.addEventListener('click', function (e) {
        e.preventDefault(); // Stop default navigation

        console.log("Sidebar ad clicked, opening:", adLink.href);

        // Open in new tab
        const newWindow = window.open(adLink.href, '_blank');
        if (newWindow) {
            newWindow.focus();
        } else {
            console.log("Popup blocked");
        }

        // Track the click
        trackAdClick(ad.title);

        return false; // Also helps prevent default behavior
    });

    if (ad.type === 'image') {
        // Create image with proper sizing
        const img = document.createElement('img');
        img.src = ad.url;
        img.alt = ad.title;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.display = 'block';

        adLink.appendChild(img);
    } else if (ad.type === 'video') {
        // Create video with proper sizing
        const video = document.createElement('video');
        video.src = ad.url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.display = 'block';

        adLink.appendChild(video);
    } else {
        // Fallback text content
        const textDiv = document.createElement('div');
        textDiv.textContent = ad.title;
        textDiv.style.width = '100%';
        textDiv.style.height = '100%';
        textDiv.style.display = 'flex';
        textDiv.style.justifyContent = 'center';
        textDiv.style.alignItems = 'center';
        textDiv.style.textAlign = 'center';
        textDiv.style.fontWeight = 'bold';
        textDiv.style.padding = '20px';
        textDiv.style.backgroundColor = '#f0f0f0';

        adLink.appendChild(textDiv);
    }

    // Add a small "Visit Website" corner label
    const visitLabel = document.createElement('div');
    visitLabel.style.position = 'absolute';
    visitLabel.style.bottom = '5px';
    visitLabel.style.right = '5px';
    visitLabel.style.backgroundColor = 'rgba(74, 111, 165, 0.9)';
    visitLabel.style.color = 'white';
    visitLabel.style.padding = '3px 6px';
    visitLabel.style.borderRadius = '3px';
    visitLabel.style.fontSize = '10px';
    visitLabel.style.fontWeight = 'bold';
    visitLabel.innerHTML = '<i class="fas fa-external-link-alt"></i>';

    adLink.appendChild(visitLabel);
    container.appendChild(adLink);
}

// Track ad clicks (for analytics in a real implementation)
function trackAdClick(adTitle) {
    console.log(`Ad clicked: ${adTitle}`);
    // In a real implementation, you would send this to an analytics service
}

// Share functionality
function shareImage(platform, image) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(image.title || 'Check out this image!');
    const imageUrl = encodeURIComponent(image.url);

    let shareUrl = '';

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${imageUrl}&description=${title}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
            break;
        default:
            shareUrl = '';
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=450');
    }
}

// Event Listeners for Theme Toggle
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Event Listeners for View Mode
if (gridViewBtn) {
    gridViewBtn.addEventListener('click', () => toggleViewMode('grid'));
}

if (listViewBtn) {
    listViewBtn.addEventListener('click', () => toggleViewMode('list'));
}

// Event Listeners for Mobile Quick Add
if (floatingAddBtn) {
    floatingAddBtn.addEventListener('click', () => {
        quickAddModal.style.display = 'flex';
        void quickAddModal.offsetWidth;
        quickAddModal.classList.add('active');
    });
}

if (quickAddClose) {
    quickAddClose.addEventListener('click', () => {
        quickAddModal.classList.remove('active');
        setTimeout(() => {
            quickAddModal.style.display = 'none';
            mobileImageUrl.value = '';
        }, 300);
    });
}

if (mobileAddBtn) {
    mobileAddBtn.addEventListener('click', () => {
        const url = mobileImageUrl.value.trim();
        if (url) {
            addImageFromUrl(url);
            quickAddModal.classList.remove('active');
            setTimeout(() => {
                quickAddModal.style.display = 'none';
                mobileImageUrl.value = '';
            }, 300);
        }
    });
}

// Event Listeners for Cookie Banner
if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
    });
}

if (cookieSettings) {
    cookieSettings.addEventListener('click', () => {
        // For demo purposes just accept cookies
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('show');
        alert('Cookie settings would normally open here. For this demo, cookies are accepted.');
    });
}

// Event Listeners for Featured Ad
if (featuredAdClose) {
    featuredAdClose.addEventListener('click', () => {
        featuredAdBanner.style.display = 'none';
    });
}

// Event Listeners for Modal Closing
modalCloseBtn.addEventListener('click', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    adModal.classList.remove('active');
    setTimeout(() => {
        adModal.style.display = 'none';
        modalCloseBtn.textContent = 'Skip Ad';

        // Schedule next popup ad
        canShowPopup = true;
        scheduleRandomPopup();
    }, 300); // Match the transition duration
});

imageModalCloseBtn.addEventListener('click', () => {
    imageModal.classList.remove('active');
    setTimeout(() => {
        imageModal.style.display = 'none';
    }, 300); // Match the transition duration
});

cornerAdCloseBtn.addEventListener('click', () => {
    cornerAd.style.display = 'none';
    // Show again after 5 minutes
    setTimeout(() => {
        cornerAd.style.display = 'block';
    }, 300000);
});

// Event Listeners for Share Buttons
shareButtons.forEach(button => {
    button.addEventListener('click', () => {
        const platform = button.dataset.platform;
        const imageId = lastClickedImageId;

        if (imageId && platform) {
            const image = imageMap.get(imageId);
            if (image) {
                shareImage(platform, image);
            }
        }
    });
});

// Premium Button
if (premiumBtn) {
    premiumBtn.addEventListener('click', () => {
        alert('This would redirect to a premium subscription page in a real implementation.');
    });
}

// Close modals when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === adModal) {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        adModal.classList.remove('active');
        setTimeout(() => {
            adModal.style.display = 'none';
        }, 300);
    }
    if (e.target === imageModal) {
        imageModal.classList.remove('active');
        setTimeout(() => {
            imageModal.style.display = 'none';
        }, 300);
    }
    if (e.target === quickAddModal) {
        quickAddModal.classList.remove('active');
        setTimeout(() => {
            quickAddModal.style.display = 'none';
            mobileImageUrl.value = '';
        }, 300);
    }
});

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

// Initialize the app with a small delay for better perceived performance
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme first for a smoother experience
    initTheme();

    // Initialize view mode
    initViewMode();

    // Load settings
    loadGallerySettings();

    // Small delay to allow the page to render first
    setTimeout(() => {
        initializeData();

        // Schedule first random popup ad after initial load
        setTimeout(() => {
            scheduleRandomPopup();
        }, 20000); // First popup after 20 seconds
    }, 100);
}); 