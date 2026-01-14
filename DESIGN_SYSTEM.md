# Shukran Admin Portal - Design System

## 🎨 Color System

### Primary Palette

| Name  | Hex     | HSL        | Tailwind Class | Usage                        |
| ----- | ------- | ---------- | -------------- | ---------------------------- |
| Black | #000000 | 0 0% 0%    | `bg-black`     | Primary text, main CTAs, nav |
| White | #FFFFFF | 0 0% 100%  | `bg-white`     | Backgrounds, clean areas     |
| Gold  | #f0ba60 | 40 85% 65% | `bg-gold`      | Premium highlights, success  |

### Secondary & Utility Palette

| Name        | Hex     | HSL         | Tailwind Class   | Usage                     |
| ----------- | ------- | ----------- | ---------------- | ------------------------- |
| Light Gray  | #fafafa | 0 0% 98%    | `bg-gray-light`  | Cards, subtle backgrounds |
| Medium Gray | #e0e0e0 | 0 0% 88%    | `bg-gray-medium` | Borders, dividers         |
| Dark Gray   | #555555 | 0 0% 33%    | `bg-gray-dark`   | Secondary text            |
| Text Gray   | #757575 | 0 0% 46%    | `text-gray-text` | Descriptive text          |
| Error Red   | #e74c3c | 4 78% 57%   | `bg-error`       | Errors, destructive       |
| Info Blue   | #3498db | 204 70% 53% | `bg-info-blue`   | Informational elements    |

---

## 📝 Typography

### Font Families

```css
font-display    → Playfair Display (serif) - Headlines, brand presence
font-body       → Inter (sans-serif) - Body text, UI components
```

### Text Styles

#### Hero Text

```jsx
<h1 className="text-hero">Shukran Admin Portal</h1>
// or
<h1 className="font-display text-6xl md:text-8xl font-black">Hero Title</h1>
```

#### Heading

```jsx
<h2 className="text-heading">Section Title</h2>
// or
<h2 className="font-display text-3xl md:text-5xl font-bold">Heading</h2>
```

#### Body Text

```jsx
<p className="font-body text-base md:text-lg">Standard paragraph text...</p>
```

#### Small Text

```jsx
<span className="font-body text-xs font-light">Secondary details</span>
```

#### Button Text

```jsx
<button className="font-body text-xs font-medium">Action Button</button>
```

---

## 🔘 Buttons

All buttons use the interaction pattern:

```jsx
className = "btn-interaction";
// Equivalent to: transition duration-300 ease-in-out hover:scale-105 active:opacity-80 focus:ring-2 ring-black
```

### Primary Button (Black BG, White Text)

```jsx
<button className="bg-black text-white border-2 border-black px-8 py-3 rounded btn-interaction">
  Primary CTA
</button>
```

### Secondary Button (White BG, Black Text)

```jsx
<button className="bg-white text-black border-2 border-black px-8 py-3 rounded btn-interaction">
  Secondary CTA
</button>
```

### Cart Button (White BG, Thinner Border)

```jsx
<button className="bg-white text-black border-[1.5px] border-black px-4 py-2 rounded btn-interaction">
  Add to Cart
</button>
```

### Ghost Button (Transparent BG)

```jsx
<button className="bg-transparent text-black border-2 border-black px-4 py-2 rounded btn-interaction">
  Ghost Action
</button>
```

---

## 🃏 Cards

### Product Card (520px × 380px)

```jsx
<div className="bg-white rounded-xl shadow-sm h-[520px] w-[380px]">
  <div className="h-[65%]">{/* Product Image */}</div>
  <div className="h-[35%] p-4">{/* Product Content, Price, CTA */}</div>
</div>
```

### Feature Card (550px × 390px)

```jsx
<div className="bg-white rounded-xl shadow-md h-[550px] w-[390px]">
  {/* Key product highlights */}
</div>
```

### Info Card (Auto Height)

```jsx
<div className="bg-white rounded-lg">{/* Text-heavy content */}</div>
```

---

## 📋 Forms & Inputs

### Text Input (Transparent BG, No Border)

```jsx
<input
  type="text"
  className="bg-transparent px-4 py-2 focus:outline-none focus:ring-2 ring-black"
  placeholder="Enter text..."
/>
```

### Search Input (Gray BG)

```jsx
<input
  type="search"
  className="bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 ring-black"
  placeholder="Search..."
/>
```

### Form States

```jsx
// Default
className = "border border-black";

// Focus
className = "outline-none ring-2 ring-black";

// Success
className = "border-gold text-gold";

// Error
className = "border-error text-error";
```

---

## 🎭 Utility Classes

### Gradients

```jsx
className = "gradient-primary"; // Black gradient
className = "gradient-card"; // White to light gray gradient
```

### Shadows

```jsx
className = "shadow-card"; // Subtle card shadow
className = "shadow-elegant"; // Elegant deep shadow
```

### Animations

```jsx
className = "animate-fade-in"; // Fade in animation
className = "animate-slide-in"; // Slide in from top
```

---

## 🎨 Example Component Usage

### Complete Button Example

```jsx
import { Button } from "@/components/ui/button";

<Button
  variant="default"
  className="bg-black text-white border-2 border-black px-8 py-3 btn-interaction"
>
  Primary Action
</Button>;
```

### Complete Card Example

```jsx
<div className="bg-white rounded-xl shadow-card p-6">
  <h3 className="font-display text-2xl font-bold mb-4">Card Title</h3>
  <p className="font-body text-base text-gray-text">
    Card description goes here...
  </p>
  <button className="mt-4 bg-black text-white px-6 py-2 rounded btn-interaction">
    Learn More
  </button>
</div>
```

---

## 📐 Design Tokens Reference

### Spacing

- Cards: `p-6` or `p-4`
- Buttons: `px-8 py-3` (Primary), `px-4 py-2` (Secondary)
- Form fields: `px-4 py-2`

### Border Radius

- Cards: `rounded-xl` (1rem)
- Buttons: `rounded` (0.75rem)
- Inputs: `rounded-lg`

### Font Weights

- Hero: `font-black` (900)
- Heading: `font-bold` (700)
- Button: `font-medium` (500)
- Body: `font-normal` (400)
- Small: `font-light` (300)

---

## 🚀 Quick Start

1. **Import fonts** - Already loaded via `@import` in `index.css`
2. **Use color classes** - All colors available via Tailwind classes
3. **Apply interaction pattern** - Use `btn-interaction` class on clickable elements
4. **Follow typography hierarchy** - Use `font-display` for headings, `font-body` for content

---

## 📱 Responsive Design

All text styles include responsive variants:

```jsx
text-6xl md:text-8xl    // Hero: 6xl mobile, 8xl desktop
text-3xl md:text-5xl    // Heading: 3xl mobile, 5xl desktop
text-base md:text-lg    // Body: base mobile, lg desktop
```

Cards and buttons maintain fixed dimensions but can be made responsive with:

```jsx
w-full max-w-[380px]   // Full width up to card max
px-4 md:px-8           // Responsive padding
```
