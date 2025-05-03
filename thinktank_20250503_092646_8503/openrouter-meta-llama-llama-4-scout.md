To address the consultation request for system theme implementation, I will follow a step-by-step approach to identify and fix the issues with the light mode implementation.

1. **Review the Current Implementation**: The current theme detection system uses the `ThemeProvider` component, which detects system preferences using `matchMedia`, allows manual switching between light/dark/system modes, and uses CSS variables for theming.

2. **Identify the Issues**: The light mode implementation is broken, resulting in missing content, a black background, and only the CTA button remaining visible.

3. **Analyze the CSS Variables**: The theme variables are defined in `/app/theme.css`. Ensure that the CSS variables are properly inherited and applied in light mode.

4. **Check Class Application**: Verify that the correct classes are applied to components in light mode.

5. **Component Styling**: Ensure that component styling respects theme variables.

6. **Key Files to Review**: Review `/app/theme.css`, `/app/globals.css`, `/components/ui/theme-provider.tsx`, `/app/layout.tsx`, `/components/molecules/hero-section.tsx`, `/components/ui/logo.tsx`, `/components/ui/noise-background.tsx`, `/components/ui/theme-switch.tsx`, `/components/ui/button.tsx`, and `/components/ui/typography.tsx`.

7. **Desired Outcome**: A robust theming system that properly detects and applies system theme preference, allows manual override, and properly renders all components in both light and dark modes.

## Solution

To fix the issues with the light mode implementation:

### 1. Update `/app/theme.css`

Ensure that the light mode theme variables are correctly defined.

```css
/* Light mode theme */
.light {
  /* Color tokens */
  --color-ink: var(--ink-base);
  --color-chalk: var(--chalk-base);
  --color-cobalt: var(--cobalt-base);
  --color-purple: var(--purple-base);
  --focus-outline-color: #0060E6;
  
  /* Semantic tokens */
  --background: var(--color-chalk);
  --foreground: var(--color-ink);
  
  --card: var(--color-chalk);
  --card-foreground: var(--color-ink);
  
  --popover: var(--color-chalk);
  --popover-foreground: var(--color-ink);
  
  --primary: var(--color-cobalt);
  --primary-foreground: var(--color-chalk);
  
  --secondary: #e5e5e5;
  --secondary-foreground: var(--color-ink);
  
  --muted: #e5e5e5;
  --muted-foreground: #737373;
  
  --accent: var(--color-purple);
  --accent-foreground: var(--color-ink);
  
  --destructive: #ef4444;
  --destructive-foreground: var(--color-chalk);
  
  --border: #e5e5e5;
  --input: #f2f2f2;
  --ring: var(--focus-outline-color);
}
```

### 2. Update `/components/ui/theme-provider.tsx`

Ensure that the `ThemeProvider` component correctly applies the theme class based on the current selection.

```typescript
useEffect(() => {
  if (typeof window !== "undefined") {
    const root = window.document.documentElement;
    
    // Remove both theme classes first
    root.classList.remove("light", "dark");
    
    // Apply appropriate theme class based on current selection
    const activeTheme = theme === "system" ? systemTheme : theme;
    
    // Only add class if it's a valid theme class name
    if (activeTheme === "light" || activeTheme === "dark") {
      root.classList.add(activeTheme);
    }
    
    // Store the active theme for debugging
    root.dataset.theme = activeTheme;
  }
}, [theme, systemTheme]);
```

### 3. Verify Component Styling

Ensure that all components respect theme variables.

```typescript
// Example: Button.tsx
export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Comp = "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
}
```

By following these steps and updating the relevant files, the light mode implementation should be fixed, and the theming system should work as expected.