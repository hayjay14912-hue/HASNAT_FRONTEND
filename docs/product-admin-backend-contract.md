# Product Admin + Backend Contract (B2C / B2B / Devices)

This frontend now supports product segmentation and publish control from backend/admin fields.

## Required Admin Inputs (Add/Edit Product)

1. `productStatus` (publish control):
- type: enum
- values: `active`, `inactive`
- purpose: hide/show product across storefront sections

2. `audience` (business segment):
- type: enum
- values: `b2c`, `b2b`, `device`
- purpose:
  - `b2c`: normal e-commerce (cart/checkout)
  - `b2b`: visible publicly, inquiry-only (no checkout)
  - `device`: machine/capital equipment lead-gen flow (no checkout)

3. `deviceBrand` (for devices only):
- type: text/enum
- example: `Lutronic`
- purpose: helps separate the 4 Lutronic machine records in admin tables

4. Keep inventory field separate:
- `status` should remain stock status (`in-stock`, `out-of-stock`)
- do not use `status` for publish state

## Suggested Product Table Columns in Admin

- `title`
- `audience` (`b2c` / `b2b` / `device`)
- `productStatus` (`active` / `inactive`)
- `status` (inventory: `in-stock` / `out-of-stock`)
- `deviceBrand` (optional)
- `updatedAt`

## Suggested Filters in Admin Table

- Filter by `audience`
- Filter by `productStatus`
- Filter by `deviceBrand` (for machine catalog management)

## API Payload Example

```json
{
  "title": "Lutronic Clarity II",
  "audience": "device",
  "productStatus": "active",
  "status": "in-stock",
  "deviceBrand": "Lutronic",
  "inquiryOnly": true
}
```

## Frontend Behavior Mapped to Fields

- `audience = b2c` + `productStatus = active`:
  - appears in `/shop` and purchasable online

- `audience = b2b` + `productStatus = active`:
  - appears in `/professional`
  - no add-to-cart
  - inquiry CTAs shown

- `audience = device` + `productStatus = active`:
  - treated as device/lead-only
  - no checkout

- `productStatus = inactive`:
  - excluded from listing pages
  - direct detail route shows inactive message

## Compatible Field Aliases (already handled in frontend)

Audience aliases:
- `audience`, `productAudience`, `catalogCategory`, `businessCategory`, `categorySegment`, `productType`, `type`, `segment`

Publish aliases:
- `productStatus`, `publishStatus`, `lifecycleStatus`, `recordStatus`, `visibilityStatus`, `state`, `adminStatus`, `isActive`, `enabled`
