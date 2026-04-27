# Performance Agent Report - 2026-02-21

## Scope
- Environment: production ([nees-frontend.vercel.app](https://nees-frontend.vercel.app))
- Method: Lighthouse mobile (CLI)
- Focus pages: `/` and `/shop`

## Baseline vs Final
| Page | Perf | SEO | FCP | LCP | TTI | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Home baseline | 84 | 92 | 1.9s | 3.2s | 18.1s | 190ms |
| Home final | 90 | 100 | 2.1s | 3.1s | 5.8s | 50ms |
| Shop baseline | 59 | 92 | 6.1s | 18.1s | 18.1s | 30ms |
| Shop final | 90 | 100 | 2.0s | 2.1s | 2.9s | 0ms |

## Implemented Optimizations
1. Removed render-blocking auth gate in global wrapper.
   - File: `src/layout/wrapper.jsx`
   - Impact: page content now renders immediately instead of waiting for client auth hydration.
2. Optimized logo delivery (payload + responsive sizing).
   - Files: `src/layout/headers/header.jsx`, `src/layout/headers/header-2.jsx`, `src/layout/headers/header-3.jsx`, `src/layout/headers/header-4.jsx`, `src/layout/footers/footer.jsx`, `src/layout/footers/footer-2.jsx`
   - Assets: `public/assets/img/logo/brand-logo-compact.png`, `public/assets/img/logo/brand-logo-favicon.png`
   - Impact: header logo request reduced from ~167KB (`w=3840`) to ~4.4KB (`w=96`) in Lighthouse traces.
3. Deferred non-critical overlay UI bundles (search, off-canvas, cart mini) via dynamic imports and conditional mount.
   - Files: `src/layout/headers/header.jsx`, `src/layout/headers/header-2.jsx`, `src/layout/headers/header-3.jsx`, `src/layout/headers/header-4.jsx`
4. Stabilized hero LCP candidate by disabling auto-slide and fixing responsive `sizes` syntax.
   - File: `src/components/banner/beauty-banner.jsx`
5. Reduced initial JS on shop cards by deferring ratings library load.
   - File: `src/components/products/fashion/product-item.jsx`
6. Kept only one eager/LCP product image for shop grids.
   - File: `src/components/shop/shop-area.jsx`
7. Switched favicon links to optimized icon.
   - Files: `src/components/seo.jsx`, `src/pages/_document.jsx`

## Remaining Risks / Backlog
1. Unused CSS remains high (~187-190KB): global stylesheet is still the largest payload (`css/*.css` ~186KB).
2. Home LCP is improved but still above target (<2.5s): currently ~3.1s.
3. Legacy JS/polyfill warning (~12KB) remains from Next.js runtime baseline for this version.

## Release Assessment
- Blocker status for this patch: **PASS** (major regression removed on `/shop`, Core Web Vitals materially improved)
- Follow-up recommended: execute a CSS-splitting pass (route-level style loading) to close remaining home LCP/CSS budget gap.
