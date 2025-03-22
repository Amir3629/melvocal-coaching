# Vocal Coaching Website

This is a Next.js project for a professional vocal coaching website, featuring a booking system, gallery, and services information.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vocal-coaching.git
   cd vocal-coaching
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the automated setup**
   ```bash
   npm run setup
   ```
   This command will:
   - Create all necessary directories
   - Generate placeholder images and assets
   - Check for required dependencies
   - Set up environment variables
   - Start the development server

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development Environment

### Path Handling

This project is configured to work with both local development and GitHub Pages deployment:

- **Local Development:** Assets are served from `/public`
- **Production:** Assets are served from `/vocal-coaching/public`

The `getImagePath()` utility automatically handles these differences.

### Placeholder Images

If you see placeholder images in development:

1. These are generated SVGs that stand in for missing images
2. Replace them by adding your actual images to the corresponding directories:
   - `/public/images/gallery/` for gallery images
   - `/public/images/backgrounds/` for background images
   - `/public/images/services/` for service images

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run deploy` - Deploy to GitHub Pages
- `npm run fix-local` - Fix development environment issues
- `npm run setup` - Complete setup and start dev server

## 📝 Booking System

The booking system consists of multiple forms:

1. **Service Selection**
2. **Personal Information**
3. **Confirmation and Legal**

Recent improvements:
- The calendar option has been removed as requested
- Legal document modals now have improved styling
- Confirmation step has been streamlined

## 📦 Project Structure

```
vocal-coaching/
├── app/
│   ├── components/     # UI components
│   │   ├── booking/    # Booking system components
│   │   ├── gallery/    # Gallery components
│   │   └── ui/         # Reusable UI components
│   ├── lib/            # Utility libraries
│   ├── utils/          # Helper functions
│   └── ...             # Page components and routes
├── public/
│   ├── images/         # Images and assets
│   ├── audio/          # Audio samples
│   └── ...             # Other static files
└── ...                 # Configuration files
```

## 🔨 Common Issues & Solutions

### Missing Images

If images are not displaying correctly:

1. Check if the image exists in the correct location
2. Run `npm run fix-local` to regenerate placeholders
3. Verify the path in your component is correct

### Component Errors

If components are not rendering properly:

1. Check the import paths
2. Ensure all dependencies are installed
3. Look for console errors in the developer tools

## 🔄 Workflow

1. Make changes locally and test
2. Commit changes to Git
3. Run `npm run deploy` to deploy to GitHub Pages
4. Verify the changes on the live site

## 📞 Contact

For questions or support, contact [your-email@example.com]

## License

[MIT](LICENSE) 