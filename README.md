
# Safa Maatoug - Haute Couture Bridal Website

A luxury bridal couture showcase website built with React, TypeScript, and Tailwind CSS. This static site presents the elegant collections and craftsmanship of Safa Maatoug's bridal house.

## 🌟 Features

- **Fully Responsive Design** - Optimized for desktop, tablet, and mobile
- **Luxury Color Palette** - Ivory, champagne, navy, and gold accents
- **French Typography** - Playfair Display serif for headings, Montserrat sans-serif for body
- **Interactive Gallery** - Collection showcase with lightbox functionality
- **Testimonials Carousel** - Client reviews with smooth transitions
- **Contact Integration** - Direct email contact with elegant styling
- **Performance Optimized** - Fast loading with lazy-loaded images

## 🏗️ Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navigation.tsx    # Main navigation with mobile menu
│   │   └── Footer.tsx        # Site footer with links
│   ├── pages/
│   │   ├── Index.tsx         # Homepage with hero and collection preview
│   │   ├── Histoire.tsx      # About/Brand story page
│   │   ├── Collection.tsx    # Gallery with filtering and lightbox
│   │   ├── Avis.tsx          # Testimonials carousel page
│   │   └── Contact.tsx       # Contact information and services
│   ├── App.tsx               # Main app with routing
│   └── index.css             # Global styles and luxury palette
├── tailwind.config.ts        # Tailwind configuration with custom colors
└── index.html                # HTML template with French meta tags
```

## 🎨 Design System

### Color Palette
- **Ivory** (`#F9F6F2`) - Primary background
- **Navy** (`#0F1C33`) - Text and buttons
- **Champagne** (`#C7A67A`) - Accent color
- **Gold** (`#D4AF37`) - Highlights and hover states
- **Soft Beige** (`#F5F2EE`) - Section backgrounds

### Typography
- **Playfair Display** - Elegant serif for headings
- **Montserrat** - Clean sans-serif for body text
- **Font weights**: 300, 400, 500, 600, 700

### Components
- `luxury-button` - Primary call-to-action styling
- `luxury-button-outline` - Secondary button styling
- `hero-overlay` - Gradient overlays for hero sections
- `fade-in-up` - Smooth entrance animations

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd safa-maatoug-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📱 Pages Overview

### Homepage (`/`)
- Full-screen hero with brand messaging
- Collection preview grid
- Brand promise section with French quote

### Histoire (`/histoire`)
- Brand story and values
- Atelier photography grid
- Mission statement with icons

### Collection (`/collection`)
- Filterable gallery (Toutes, Mariage Civil, Cérémonie, Haute Couture)
- Interactive lightbox with dress details
- Fabric and color information

### Avis (`/avis`)
- Client testimonials carousel
- Auto-advancing slides with manual controls
- Call-to-action section

### Contact (`/contact`)
- Service information
- Email contact with styling
- FAQ section
- Operating hours and location

## 🔧 Customization

### Updating Colors
Modify the color palette in `tailwind.config.ts`:
```typescript
colors: {
  ivory: '#F9F6F2',
  champagne: '#C7A67A',
  navy: '#0F1C33',
  gold: '#D4AF37',
  'soft-beige': '#F5F2EE'
}
```

### Changing Fonts
Update font imports in `index.html` and configuration in `tailwind.config.ts`:
```typescript
fontFamily: {
  serif: ['Playfair Display', 'serif'],
  sans: ['Montserrat', 'sans-serif'],
}
```

### Adding Images
- Replace placeholder images with high-resolution photos
- Maintain aspect ratios for consistent layout
- Use WebP format for better performance
- Add appropriate alt text for accessibility

### Contact Email
Update the contact email in `Contact.tsx`:
```typescript
href="mailto:your-email@domain.com"
```

## 🌐 Deployment

This static site can be deployed to any hosting platform:

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure custom domain if needed

### Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`

### Traditional Hosting
1. Build the project: `npm run build`
2. Upload contents of `dist` folder to your web server

## 📋 SEO & Performance

- Semantic HTML5 structure
- Meta tags for social sharing
- Lazy loading for images
- Optimized font loading
- WCAG AA color contrast compliance
- Mobile-first responsive design

## 🔗 Links & Resources

- **Typography**: [Google Fonts](https://fonts.google.com/)
- **Icons**: Custom SVGs for luxury aesthetic
- **Images**: High-resolution placeholder images from Unsplash
- **Animations**: CSS transitions and transforms for smooth interactions

## 📝 License

This project is proprietary software for Safa Maatoug. All rights reserved.

---

For any questions or customization requests, please contact the development team.
