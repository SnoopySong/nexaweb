# Design Guidelines: Futuristic Web Development Portfolio

## Design Approach
**Reference-Based**: Drawing from Linear's sleek typography, Stripe's sophisticated animations, and Vercel's developer-focused aesthetic. Create a high-tech, premium feel that demonstrates web development expertise through the design itself.

## Typography System
- **Headlines**: Bold geometric sans-serif (Inter or Space Grotesk via Google Fonts)
  - Hero: text-6xl/7xl, font-bold, tight tracking
  - Section headers: text-4xl/5xl, font-semibold
- **Body**: Clean sans-serif (Inter)
  - Primary: text-base/lg, font-normal
  - Small: text-sm, for metadata/captions
- **Accents**: Monospace (JetBrains Mono) for technical details, stats, code snippets

## Layout System
**Spacing Primitives**: Tailwind units of 4, 8, 12, 16, 24, 32
- Section padding: py-24 to py-32 (desktop), py-12 to py-16 (mobile)
- Component gaps: gap-8 to gap-12
- Card padding: p-8
- Tight spacing: space-y-4, loose: space-y-12

**Grid Strategy**:
- Hero: Full-width asymmetric layout
- Portfolio: 3-column grid (lg:grid-cols-3 md:grid-cols-2)
- Testimonials: Masonry-style layout with staggered heights
- Services: 2-column split sections alternating left/right

## Core Components

### Navigation
Fixed header with glassmorphism effect (backdrop-blur-lg, semi-transparent background), logo left, nav links center, CTA button right. Smooth scroll to sections.

### Hero Section
Full-viewport height with animated gradient mesh background (subtle particle effects). Large bold headline + subheadline, primary CTA ("Démarrer un Projet"), secondary link ("Voir Portfolio"). Include animated tech stack badges floating/orbiting.

### Portfolio Grid
Masonry layout with 8-10 project cards:
- Hover effect: card lifts with glow
- Each card: Large project image (16:9), client name, project type tag, brief description
- Click expands to modal with full project details
- Include varied project types: e-commerce, SaaS, landing pages

### Testimonials Section (~120 reviews)
Infinite horizontal scroll carousel with:
- Individual cards: Avatar placeholder, name, role/company, star rating (mix of 4-5 stars for 4.9 avg), testimonial text
- Grid preview showing 12 testimonials, "View all 120+" link
- Star rating prominent at section top: "4.9/5 ★★★★★ from 120+ clients"

### Services Section
Icon + title + description cards in 3-column grid:
- Custom icons from Heroicons
- Services: Website Design, E-commerce, Web Apps, SEO, Maintenance, Consulting

### Contact Form (Public)
Single-column centered form (max-w-2xl):
- Fields: Name, Email, Message (textarea), Budget dropdown
- Glassmorphic card design
- Submit button with loading state animation
- Success message overlay

### Admin Panel (Private)
Separate route with authentication:
- Login page: Centered card, email/password
- Dashboard: Side navigation, message list table
- Message cards: Sender info, timestamp, message preview, read/unread status
- Click to expand full message

## Visual Effects (Minimal & Strategic)

**Use Sparingly:**
- Hero: Subtle gradient animation on background
- Cards: Gentle hover lift (translate-y-2) with glow
- Scroll: Fade-in on viewport entry for sections
- Navigation: Smooth scroll behavior

**Avoid:**
- Excessive parallax
- Constant motion
- Distracting transitions

## Images

**Hero**: Abstract tech/futuristic background (geometric patterns, gradient mesh, or circuit board aesthetic) - full-width, subtle animation

**Portfolio Projects**: Mock website screenshots (8-10 images):
- E-commerce storefront
- SaaS dashboard
- Restaurant website
- Real estate platform
- Fashion brand
- Tech startup
- Fitness app
- Agency portfolio

Use placeholder service (e.g., screenshots.cloud or similar) for realistic browser mockups.

**Testimonial Avatars**: Generic avatar placeholders (120 varied)

## Accessibility
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states on all interactive components
- Alt text for all images
- Form validation with clear error messages

## Technical Notes
- Mobile-first responsive breakpoints
- Smooth scrolling: `scroll-behavior: smooth`
- Icon library: Heroicons (CDN)
- Forms: Client-side validation + backend submission
- Admin: Protected routes with authentication check

This futuristic portfolio balances visual impact with usability, showcasing web development expertise through sophisticated design that performs flawlessly across devices.