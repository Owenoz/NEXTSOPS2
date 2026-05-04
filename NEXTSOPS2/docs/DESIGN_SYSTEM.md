# Next Shops - Design System & UI Specifications

## Color Palette

### Primary Colors (Green - Growth & Trust)
```
primary-50:  #e6f7f0  (Lightest - backgrounds)
primary-100: #b3e6d1
primary-200: #80d5b2
primary-300: #4dc493
primary-400: #1ab374
primary-500: #00a05b  (Main brand color)
primary-600: #008049  (Hover states)
primary-700: #006037
primary-800: #004025
primary-900: #002013  (Darkest)
```

### Secondary Colors (Blue - Technology & Innovation)
```
secondary-50:  #e6f2ff
secondary-100: #b3d9ff
secondary-200: #80c0ff
secondary-300: #4da7ff
secondary-400: #1a8eff
secondary-500: #0075e6  (Main secondary)
secondary-600: #005cb3
secondary-700: #004380
secondary-800: #002a4d
secondary-900: #00111a
```

### Accent Colors (Orange/Yellow - Deals & Urgency)
```
accent-50:  #fff7e6
accent-100: #ffe7b3
accent-200: #ffd780
accent-300: #ffc74d
accent-400: #ffb71a
accent-500: #e6a000  (Flash sales, discounts)
accent-600: #b37d00
accent-700: #805a00
accent-800: #4d3700
accent-900: #1a1400
```

### Neutral Colors
```
gray-50:  #f9fafb  (Backgrounds)
gray-100: #f3f4f6
gray-200: #e5e7eb  (Borders)
gray-300: #d1d5db
gray-400: #9ca3af
gray-500: #6b7280  (Secondary text)
gray-600: #4b5563
gray-700: #374151
gray-800: #1f2937
gray-900: #111827  (Primary text)
```

### Semantic Colors
```
success: #10b981  (Order confirmed, payment success)
warning: #f59e0b  (Low stock, pending actions)
error:   #ef4444  (Errors, out of stock)
info:    #3b82f6  (Information, tips)
```

## Typography

### Font Family
```css
Primary: 'Inter', system-ui, -apple-system, sans-serif
Fallback: Arial, Helvetica, sans-serif
```

### Font Sizes (Mobile-First)
```
text-xs:   12px / 16px  (Captions, labels)
text-sm:   14px / 20px  (Secondary text)
text-base: 16px / 24px  (Body text - DEFAULT)
text-lg:   18px / 28px  (Subheadings)
text-xl:   20px / 28px  (Card titles)
text-2xl:  24px / 32px  (Section headings)
text-3xl:  30px / 36px  (Page titles)
text-4xl:  36px / 40px  (Hero text)
text-5xl:  48px / 1     (Large displays)
```

### Font Weights
```
font-normal:    400  (Body text)
font-medium:    500  (Emphasis, labels)
font-semibold:  600  (Subheadings, buttons)
font-bold:      700  (Headings, prices)
font-extrabold: 800  (Hero text, special emphasis)
```

## Spacing System

### Base Unit: 4px
```
0:   0px
1:   4px
2:   8px
3:   12px
4:   16px   (Standard padding)
5:   20px
6:   24px   (Card padding)
8:   32px   (Section spacing)
10:  40px
12:  48px   (Large section spacing)
16:  64px
20:  80px
24:  96px
```

## Component Specifications

### Buttons

#### Primary Button
```
Background: primary-600
Text: white
Padding: 16px 32px (desktop), 12px 24px (mobile)
Border Radius: 8px
Font: semibold, 16px
Min Height: 48px (touch-friendly)
Hover: primary-700
Active: primary-800
Disabled: gray-300, cursor-not-allowed
```

#### Secondary Button
```
Background: white
Text: primary-600
Border: 2px solid primary-600
Padding: 16px 32px
Border Radius: 8px
Hover: primary-50 background
```

#### Icon Button
```
Size: 48px × 48px (mobile), 40px × 40px (desktop)
Border Radius: 8px
Icon Size: 24px
Hover: gray-100 background
```

### Input Fields

#### Text Input
```
Height: 48px (mobile), 44px (desktop)
Padding: 12px 16px
Border: 2px solid gray-200
Border Radius: 8px
Font Size: 16px (prevents zoom on iOS)
Focus: primary-500 border, outline-none
Error: error border, red-50 background
```

#### Search Bar
```
Height: 48px
Padding: 12px 16px 12px 48px (icon space)
Border: 2px solid gray-200
Border Radius: 12px (more rounded)
Icon: 24px, gray-400, left 12px
Focus: primary-500 border
```

### Cards

#### Product Card
```
Background: white
Border: 2px solid gray-100
Border Radius: 12px
Padding: 12px
Hover: primary-500 border, shadow-xl
Transition: all 200ms ease

Image Container:
  - Aspect Ratio: 1:1 (square)
  - Background: gray-100
  - Border Radius: 8px (top)

Content Padding: 12px
Title: 2 lines max, ellipsis
Price: bold, 18px, primary-600
Rating: 14px, yellow-400 stars
Button: Full width, primary
```

#### Order Card
```
Background: white
Border: 2px solid gray-100
Border Radius: 12px
Padding: 16px
Shadow: sm
Hover: shadow-md

Status Badge:
  - Padding: 4px 12px
  - Border Radius: 9999px (pill)
  - Font: 12px, medium
  - Colors by status:
    * Pending: yellow-100/yellow-700
    * Shipped: blue-100/blue-700
    * Delivered: green-100/green-700
```

### Navigation

#### Top Header
```
Height: 64px (mobile), 72px (desktop)
Background: white
Border Bottom: 1px solid gray-200
Shadow: sm
Sticky: top-0, z-50

Logo: 24px height
Search: flex-1, max-width 600px
Icons: 24px, gray-600
Cart Badge: 20px circle, accent-500, white text
```

#### Category Nav
```
Background: gray-50
Border Top: 1px solid gray-200
Padding: 12px 0
Overflow: scroll-x (mobile)
Gap: 24px

Links:
  - Font: 14px, medium
  - Color: gray-700
  - Hover: primary-600
  - Active: primary-600, underline
```

#### Mobile Bottom Nav (Future)
```
Height: 64px
Background: white
Border Top: 1px solid gray-200
Shadow: lg (upward)
Fixed: bottom-0
Grid: 5 columns

Icons: 24px
Labels: 10px
Active: primary-600
```

### Modals & Overlays

#### Modal
```
Overlay: rgba(0, 0, 0, 0.5)
Container: white, rounded-2xl
Max Width: 500px (mobile: 90vw)
Padding: 24px
Shadow: 2xl
Animation: fade + scale

Header:
  - Title: 20px, bold
  - Close button: top-right, 32px

Body: 16px, gray-700
Footer: flex, gap-12px, justify-end
```

#### Toast Notification
```
Position: top-right (desktop), top-center (mobile)
Width: 320px (desktop), 90vw (mobile)
Padding: 16px
Border Radius: 12px
Shadow: lg
Animation: slide-in from right

Success: green-50 bg, green-700 text
Error: red-50 bg, red-700 text
Info: blue-50 bg, blue-700 text
Warning: yellow-50 bg, yellow-700 text

Icon: 24px, left
Close: 20px, right
Duration: 5 seconds
```

## Layout Specifications

### Container
```
Max Width: 1280px
Padding: 16px (mobile), 24px (tablet), 32px (desktop)
Margin: 0 auto
```

### Grid System
```
Mobile (< 768px):
  - 2 columns (product grid)
  - 1 column (forms)
  - Gap: 16px

Tablet (768px - 1024px):
  - 3 columns (product grid)
  - 2 columns (forms)
  - Gap: 20px

Desktop (> 1024px):
  - 4-6 columns (product grid)
  - 3 columns (forms)
  - Gap: 24px
```

## Iconography

### Icon Library: Lucide React
```
Size: 16px (small), 20px (medium), 24px (large), 32px (xlarge)
Stroke Width: 2px (default)
Color: Inherit from parent or gray-600
```

### Common Icons
```
Search: Search
Cart: ShoppingCart
User: User
Menu: Menu
Close: X
Heart: Heart
Star: Star
Truck: Truck
Package: Package
CreditCard: CreditCard
Smartphone: Smartphone
ChevronRight: ChevronRight
ChevronDown: ChevronDown
Plus: Plus
Minus: Minus
Trash: Trash2
Edit: Edit
Check: Check
Alert: AlertCircle
Info: Info
```

## Responsive Breakpoints

```
sm:  640px   (Small tablets)
md:  768px   (Tablets)
lg:  1024px  (Small laptops)
xl:  1280px  (Desktops)
2xl: 1536px  (Large desktops)
```

## Animation & Transitions

### Timing Functions
```
ease-in:     cubic-bezier(0.4, 0, 1, 1)
ease-out:    cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Durations
```
Fast:   150ms  (Hover states, small changes)
Normal: 200ms  (Default transitions)
Slow:   300ms  (Modals, large movements)
```

### Common Transitions
```
Button Hover: all 200ms ease
Card Hover: all 200ms ease, transform scale(1.02)
Modal: opacity 200ms ease, transform 200ms ease
Toast: transform 300ms ease-out
Page Transition: opacity 150ms ease
```

## Shadows

```
shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05)
shadow:     0 1px 3px rgba(0, 0, 0, 0.1)
shadow-md:  0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1)
shadow-xl:  0 20px 25px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

## Border Radius

```
rounded-sm:   4px   (Small elements)
rounded:      6px   (Default)
rounded-md:   8px   (Buttons, inputs)
rounded-lg:   12px  (Cards)
rounded-xl:   16px  (Large cards)
rounded-2xl:  24px  (Modals)
rounded-full: 9999px (Pills, avatars)
```

## Accessibility

### Minimum Touch Targets
```
Mobile: 48px × 48px
Desktop: 40px × 40px
```

### Color Contrast
```
Text on white: Minimum 4.5:1 (WCAG AA)
Large text: Minimum 3:1
Interactive elements: Minimum 3:1
```

### Focus States
```
Outline: 2px solid primary-500
Offset: 2px
Border Radius: inherit
```

### Screen Reader
```
- Use semantic HTML
- Add aria-labels to icons
- Use alt text for images
- Announce dynamic content changes
```

## Loading States

### Skeleton Loader
```
Background: gray-200
Animation: pulse (shimmer effect)
Border Radius: match component
Height: match content
```

### Spinner
```
Size: 24px (small), 32px (medium), 48px (large)
Color: primary-600
Animation: spin 1s linear infinite
```

### Progress Bar
```
Height: 4px
Background: gray-200
Fill: primary-600
Animation: indeterminate or percentage-based
```

## Empty States

```
Icon: 64px, gray-300
Title: 20px, bold, gray-900
Description: 16px, gray-600
Action Button: primary
Padding: 48px vertical
```

## Error States

```
Icon: AlertCircle, 48px, red-500
Title: 18px, bold, gray-900
Message: 16px, gray-600
Action: "Try Again" button or "Go Back" link
Background: red-50 (optional)
```

## Success States

```
Icon: CheckCircle, 48px, green-500
Title: 18px, bold, gray-900
Message: 16px, gray-600
Background: green-50 (optional)
```

## Mobile-Specific Considerations

1. **Minimum font size**: 16px (prevents iOS zoom)
2. **Touch targets**: 48px minimum
3. **Sticky elements**: Header, cart button
4. **Bottom sheet**: For filters, options
5. **Swipe gestures**: Image galleries, product cards
6. **Pull to refresh**: Product lists
7. **Infinite scroll**: Better than pagination
8. **Fixed bottom CTA**: On product pages
9. **Thumb zone**: Important actions in bottom 2/3
10. **Reduce animations**: On low-end devices
