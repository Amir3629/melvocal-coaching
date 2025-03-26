# Vocal Coaching Website

A modern, responsive website for a vocal coaching business, built with Next.js, React, and Tailwind CSS. The website includes multiple language support, a booking system, a gallery section, and a contact form.

## 🚀 Features

- **Modern Design**: Clean, professional, and responsive design
- **Multilingual Support**: English and German translations included
- **Booking System**: Service-specific booking forms with legal agreements
- **Google Calendar Integration**: View availability and connect appointments
- **Gallery Section**: Showcase performances and events
- **Dark Mode Support**: Light and dark themes
- **Responsive Layout**: Works on all devices, from mobile to desktop
- **SEO Optimized**: Meta tags, Open Graph, and sitemap support
- **Fast Page Loading**: Built with Next.js for optimal performance
- **Contact Form**: Easy way for clients to get in touch

## 📋 Table of Contents

- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Customizing Content](#customizing-content)
- [Managing Images](#managing-images)
- [Backup and Restore](#backup-and-restore)
- [Troubleshooting](#troubleshooting)

## 🔧 Setup and Installation

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Git (optional)

### Installation

1. Clone or download the repository
2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the setup script to prepare the development environment

```bash
npm run setup
# or
yarn setup
```

This will:
- Check for missing dependencies and install them
- Create necessary directories
- Generate placeholder images for development

## 💻 Development

### Starting the Development Server

```bash
npm run dev
# or
yarn dev
```

The website will be available at [http://localhost:3000](http://localhost:3000).

### Directory Structure

- `/app`: Main application code
  - `/components`: Reusable React components
  - `/hooks`: Custom React hooks
  - `/utils`: Utility functions
  - `/locales`: Translation files
- `/public`: Static assets
  - `/images`: Website images
  - `/audio`: Audio files

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting
- `npm run setup` - Setup the development environment
- `npm run check` - Check dependencies and setup
- `npm run backup` - Create a backup of the project

## 🚢 Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

### GitHub Pages Deployment

The website is configured for deployment to GitHub Pages.

```bash
npm run deploy
# or
yarn deploy
```

### Custom Domain

If you're using a custom domain with GitHub Pages:

1. Create a `CNAME` file in the `/public` directory
2. Add your domain name to the file (e.g., `vocalcoaching.example.com`)

### Environment Configuration

For production deployment, you may need to create a `.env.production` file with the following variables:

```
NEXT_PUBLIC_BASE_PATH=/vocal-coaching
```

## 📁 Project Structure

```
vocal-coaching/
├── app/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── locales/
│   ├── booking/
│   ├── calendar/
│   ├── gallery/
│   └── contact/
├── public/
│   ├── images/
│   ├── audio/
│   └── assets/
├── scripts/
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Customizing Content

### Editing Text Content

Text content is stored in translation files located in `/app/locales/`:

- `en.json` - English translations
- `de.json` - German translations

Edit these files to update the website text.

### Modifying Services

Services are defined in the translation files. To add or modify services:

1. Edit the relevant service sections in `/app/locales/en.json` and `/app/locales/de.json`
2. Add corresponding service images in `/public/images/services/`

### Updating Contact Information

Update your contact information in the translation files and in the contact component located at `/app/components/contact-section.tsx`.

## 🖼️ Managing Images

### Adding Gallery Images

1. Add your images to `/public/images/gallery/`
2. Format should be `performance1.jpg`, `performance2.jpg`, etc.
3. Recommended size: 800x800 pixels

### Service Images

1. Add service images to `/public/images/services/`
2. Use the naming convention defined in the components
3. Recommended size: 400x400 pixels

### Background Images

1. Store background images in `/public/images/backgrounds/`
2. Main background: `hero-bg.jpg`
3. Services background: `services-bg.jpg`
4. Recommended size: 1600x900 pixels or larger

## 💾 Backup and Restore

The project includes scripts for creating backups:

```bash
npm run backup
# or
yarn backup
```

This will create a ZIP archive of your project in the `/backups` directory.

To restore from a backup, extract the ZIP archive and follow the setup instructions again.

## 🔍 Troubleshooting

### Missing Images

If images are not displaying:

1. Ensure the image paths are correct
2. Check that the images exist in the proper directories
3. Run `npm run check` to verify the setup

### Deployment Issues

If you encounter problems with deployment:

1. Check that the `basePath` in `next.config.js` is set correctly
2. Verify that all dependencies are installed with `npm install`
3. Ensure the build process completes with `npm run build`

## 📄 License

This project is licensed under the MIT License.

## 👥 Credits

- Created with Next.js, React, and Tailwind CSS
- Icons from React Icons
- Image placeholders from Lorem Picsum 