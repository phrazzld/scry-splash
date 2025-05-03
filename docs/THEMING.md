# Theming System Documentation

This document describes the theming system implemented in the Scry Splash project. It covers the architecture, implementation details, and guidelines for using and extending the theme system.

## Table of Contents

1. [Overview](#overview)
2. [Theme Architecture](#theme-architecture)
3. [Implementation Details](#implementation-details)
4. [Using the Theme System](#using-the-theme-system)
5. [Extending the Theme System](#extending-the-theme-system)
6. [Development Tools](#development-tools)
7. [Testing](#testing)

## Overview

The Scry theme system provides a comprehensive, accessible, and type-safe way to implement dark and light modes with support for:

- User theme preferences
- System theme detection
- Theme persistence across sessions
- Anti-FOUC (Flash of Unstyled Content) protection
- Fully accessible contrast ratios
- Tailwind CSS integration

The system uses React Context for state management, CSS variables for styling, and localStorage for persistence.

## Theme Architecture

The architecture follows a layered approach:

1. **ThemeProvider**: React Context provider that manages theme state
2. **ThemeScript**: Anti-FOUC script that applies theme before React hydration
3. **CSS Variables**: Tiered approach to theming with base, color, and semantic tokens
4. **Tailwind Integration**: Integration with Tailwind's `darkMode: "class"` configuration
5. **Development Tools**: Debug and testing components for theme development

### Component Architecture

```
ThemeProvider
├── useTheme Hook
├── ThemeScript (Anti-FOUC)
└── Theme CSS Variables
    ├── Base Tokens
    ├── Color Tokens
    └── Semantic Tokens
```

## Implementation Details

### Theme Provider

The `ThemeProvider` component in `/components/ui/theme-provider.tsx` is responsible for:

- Managing theme state (`dark`, `light`, or `system`)
- Detecting system theme preference via `matchMedia`
- Persisting theme preference in `localStorage`
- Applying theme classes/attributes to the document
- Providing theme context to child components

```tsx
// Usage
<ThemeProvider 
  defaultTheme="system"  // Initial theme if no preference exists
  storageKey="scry-ui-theme"  // localStorage key
  attribute="class"  // HTML attribute to use for theming
  enableSystem={true}  // Whether to detect system preference
>
  {children}
</ThemeProvider>
```

### Theme Hook

The `useTheme` hook provides access to theme state and controls:

```tsx
const { theme, systemTheme, setTheme } = useTheme();

// Switch to dark mode
setTheme("dark");

// Use system preference
setTheme("system");

// Check current active theme
const activeTheme = theme === "system" ? systemTheme : theme;
```

### Anti-FOUC Script

The `ThemeScript` component in `/components/ui/theme-script.tsx` prevents flash of unstyled content by:

- Running before React hydration via an inline script
- Reading theme preference from localStorage
- Detecting system theme preference if needed
- Applying the correct theme class to the HTML element immediately

```tsx
// Usage in app/layout.tsx
<head>
  <ThemeScript 
    defaultTheme="system"
    storageKey="scry-ui-theme"
    attribute="class"
  />
</head>
```

### CSS Variables

Theme styling is implemented using CSS variables in `/app/theme.css` with a tiered approach:

1. **Base Tokens**: Raw color values and design constants
   ```css
   :root {
     --cobalt-base: #0047AB;
     --chalk-base: #FAFAFA;
     --ink-base: #121212;
   }
   ```

2. **Color Tokens**: Theme-specific mappings of semantic names to raw values
   ```css
   :root {
     --color-ink: var(--ink-base);
     --color-chalk: var(--chalk-base);
   }
   ```

3. **Semantic Tokens**: Functional variables that map to color tokens
   ```css
   :root {
     --background: var(--color-ink);
     --foreground: var(--color-chalk);
   }
   ```

Light theme variables are defined using the `.light` class selector.

### Tailwind Integration

The theme system integrates with Tailwind CSS through:

- `darkMode: "class"` configuration in `tailwind.config.js`
- Theme-aware utility classes like `bg-background` and `text-foreground`
- CSS variables that map to Tailwind theme values

## Using the Theme System

### In Components

Use the theme system in components by:

1. Using theme-aware Tailwind classes
   ```tsx
   <div className="bg-background text-foreground">
     <button className="bg-primary text-primary-foreground">
       Click me
     </button>
   </div>
   ```

2. Using the theme hook for dynamic theming
   ```tsx
   const { theme, setTheme } = useTheme();
   
   // Example of conditionally styling based on theme
   const buttonClass = theme === "dark" 
     ? "bg-blue-700" 
     : "bg-blue-500";
   ```

### Best Practices

- Always use semantic CSS variables (`--background`, `--foreground`) instead of raw color values
- Use the `data-theme` attribute for targeting specific themes in CSS if needed
- Ensure proper contrast ratios between background and text (WCAG AA standard)
- Test components in both light and dark themes

## Extending the Theme System

### Adding New Theme Colors

To add new theme colors:

1. Add base color constants in `:root` in `theme.css`
   ```css
   :root {
     --new-color-base: #hex;
   }
   ```

2. Add color tokens to both theme variations
   ```css
   :root {
     --color-new: var(--new-color-base);
   }
   
   .light {
     --color-new: var(--new-color-base);
   }
   ```

3. Create semantic tokens in both theme variations
   ```css
   :root {
     --feature-background: var(--color-new);
   }
   
   .light {
     --feature-background: var(--color-new);
   }
   ```

### Adding New Theme Variants

To add a new theme variant (e.g., "high-contrast"):

1. Define a new theme in `theme.css`
   ```css
   .high-contrast {
     /* Theme variables */
   }
   ```

2. Update the Theme type in the ThemeProvider
   ```tsx
   type Theme = "dark" | "light" | "system" | "high-contrast";
   ```

3. Update related components (ThemeSwitch, etc.)

## Development Tools

### ThemeSwitch Component

The `ThemeSwitch` component provides a UI for manually switching themes during development:

```tsx
// Add to your page component
<ThemeSwitch />
```

Feature flag it for production with:

```tsx
{process.env.NODE_ENV === "development" && <ThemeSwitch />}
```

### ThemeDebug Component

The `ThemeDebug` component displays detailed theme information for debugging:

```tsx
// Add to your page component
<ThemeDebug />
```

It shows:
- Current theme context state
- DOM state (HTML classes, attributes)
- Current CSS variables
- localStorage values

## Testing

The theme system includes:

### E2E Tests

E2E tests in `/e2e/theme/` verify:
- System theme detection
- Theme switching
- Theme persistence
- Anti-FOUC protection
- Visual appearance

Run with:
```bash
pnpm e2e
```

### Unit Tests

Unit tests in `/__tests__/components/ui/theme-provider.test.tsx` verify:
- Theme provider initialization
- Theme state management
- System theme detection
- DOM manipulations
- Theme hook behavior

Run with:
```bash
pnpm test __tests__/components/ui/theme-provider.test.tsx
```

## References

- [Tailwind Dark Mode Documentation](https://tailwindcss.com/docs/dark-mode)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Variables on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)