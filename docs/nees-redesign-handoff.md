# NEES Medical Redesign Handoff

## 1) Sitemap (Hybrid B2C + Open B2B)
- `/` Homepage (B2C-first, no clinic/device blocks in main content)
- `/shop`, `/shop-right-sidebar`, `/shop-hidden-sidebar`, `/search` B2C catalog surfaces (retail-only listing)
- `/product-details/[id]` Product detail:
  - Retail: normal e-commerce
  - Professional: inquiry-only CTAs + legal disclaimer
- `/professional` Open professional product catalog (publicly visible, no checkout)
- `/professional/[id]` Professional product detail (publicly visible, no checkout)
- `/medical-devices` Device portfolio (4 machines, lead generation only)
- `/medical-devices/[slug]` Individual device page with clinical + ROI sections
- `/request-pricing` Professional product inquiry flow
- `/request-proposal` Device proposal flow
- `/book-demo` Device demo flow
- `/contact-sales` Sales contact flow

## 2) User Journey Mapping

### Retail Customers (B2C)
1. Homepage > Shop/catalog sections
2. Browse retail products
3. Product detail > Add to Cart
4. Checkout

### Dermatologists / Clinics (Professional Products)
1. Open `/professional` catalog
2. View product detail (`/professional/[id]`)
3. Use `Request Pricing` / `WhatsApp to Order` / `Enquire Now`
4. Offline verification and fulfillment by NEES team

### Device Buyers (High-Ticket Machines)
1. Open `/medical-devices`
2. Review individual machine page
3. Use `Request Proposal` / `Book a Demo` / `Contact Sales`
4. Lead captured via multi-step form and handled offline

## 3) Wireframe Structure

### Homepage
- Premium skincare hero
- Retail category and product modules
- Skincare brand storytelling block
- Instagram proof/reels section
- No clinic/device gateway blocks on main homepage body

### B2C Product Page
- Product media and details
- Price and promotional state
- Quantity + Add to Cart + Buy Now
- Reviews/wishlist/compare actions

### Professional Product Page
- Professional Use Only badge
- Trust metadata (manufacturer, origin, certifications)
- Inquiry-only CTA group
- Legal disclaimer
- No Add to Cart

### Devices Overview Page
- Medical device portfolio hero
- Trust strip
- Card grid for 4 machines
- Lead-gen CTA repetition

### Individual Device Page
- Overview
- Clinical benefits
- Technical specifications
- ROI for clinics
- Certifications
- Sticky lead panel + inquiry form

### Request Flow (Pricing/Proposal/Demo/Sales)
- Step 1: Product/device + role
- Step 2: Clinic profile
- Step 3: Commercial details
- Step 4: Contact + consent

## 4) CTA Strategy
- Retail products:
  - `Add to Cart`, `Buy Now`
- Professional products:
  - `Request Pricing`
  - `WhatsApp to Order`
  - `Enquire Now`
- Devices:
  - `Request Proposal`
  - `Book a Demo`
  - `Contact Sales`
- Placement:
  - Product cards
  - Product/device detail hero
  - Device sidebar/lead sections
  - Dedicated request pages

## 5) Legal Disclaimer UX Placement
- Professional product card and detail
- Professional pricing page
- Message: publicly visible catalog, checkout disabled, professional verification and offline fulfillment required

## 6) Responsive Design System (Implemented)
- Mobile-first CTA stacking
- Reusable inquiry and professional blocks (`nees-*` utility/component classes)
- Premium clinical visual language:
  - clean spacing
  - trust-focused cards
  - restrained color hierarchy

## 7) Technical Notes
- Audience segmentation utilities:
  - `src/config/product-segmentation.js`
  - `src/utils/product-access.js`
- Cart hard-block for non-retail:
  - `src/redux/features/cartSlice.js`
- Lead endpoint:
  - `POST /api/leads/request-quote`
- Reusable B2B components:
  - `src/components/b2b`
