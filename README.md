# Picture Gallery Website

A beautiful, responsive and interactive picture gallery website with ad integration and admin management.

## Features

- **Responsive Image Gallery**: Displays uploaded pictures in a masonry-style grid layout.
- **Multiple View Modes**: Switch between grid view and list view.
- **Day/Night Mode**: Toggle between light and dark themes for comfortable browsing.
- **Ad Integration**: 
  - Sidebars ads with 30-second rotation
  - Corner ad position (mobile-optimized)
  - Featured banner ad
  - Full-screen modal ads with countdown timer
  - Sponsored links section
- **User Interaction**: 
  - First click on an image shows a full-screen ad
  - Second click opens the image in full-screen view
  - Share images to social media platforms
- **Quick Add Feature**: Paste any image URL to add it to your gallery instantly
- **Trending Section**: Shows most popular images based on view count
- **Admin Panel**: Secure admin interface to manage content
  - Upload/delete images
  - Upload/delete ads
  - Organized in a tabbed interface
- **Mobile Optimized**: Enhanced UI for mobile devices with floating action buttons

## How to Use

### Browsing the Gallery

1. Open `index.html` in any modern web browser
2. Browse the image gallery in the center of the page
3. Click any image to view it (note: first click will show an ad)
4. Ads will rotate automatically every 30 seconds
5. Use the theme toggle in the header to switch between light and dark modes
6. Use the view mode buttons to switch between grid and list views

### Quick Adding Images

1. Paste an image URL in the "Quick Add Image" form at the top of the page
2. Click "Add" to instantly add the image to your gallery
3. On mobile, use the floating "+" button to open the quick add form

### Admin Access

1. Access the admin panel by navigating to `admin.html` or clicking the "Admin Login" link in the header
2. Login credentials:
   - Username: `admin001` 
   - Password: `admin001`
3. Once logged in, you can:
   - Manage images (upload new ones, delete existing ones)
   - Manage ads (upload new ones, delete existing ones)

## Ad Positions

- **Featured Banner**: Large banner at the top of the page
- **Sidebars**: Left and right sides of the gallery (250px width)
- **Corner Ad**: Fixed at the bottom-right corner (200x200px)
- **Full-Screen Ad**: Shown when a user first clicks on an image, with countdown timer
- **Sponsored Links**: Text + image ads in the left sidebar

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses localStorage for data persistence (no backend required)
- Responsive design that works on desktop and mobile devices
- Optimized for performance with CSS transitions and efficient JavaScript
- Uses modern CSS variables for consistent styling and theming
- Implements CSS Grid for flexible layouts

## Local Development

1. Clone or download this repository
2. Open `index.html` or `admin.html` in your web browser
3. No build process or server required

## Notes

- This is a front-end only implementation
- All content is stored in the browser's localStorage
- Images and ads are stored as URLs rather than binary data
- For production use, you would want to implement a proper backend
- Ad click tracking is implemented but only logs to console in this demo version 