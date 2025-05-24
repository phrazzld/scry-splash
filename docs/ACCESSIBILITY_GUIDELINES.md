# Accessibility Guidelines

This document outlines our approach to accessibility in the Scry Splash project. It serves as a guide for developers to ensure that all components meet WCAG 2.1 AA standards and provide a great experience for all users, regardless of their abilities or how they access our application.

## Core Principles

1. **Semantic HTML First**: Use the most appropriate HTML elements for their intended purpose.
2. **Keyboard Navigability**: Ensure all interactive elements can be accessed and operated using a keyboard.
3. **Screen Reader Support**: Provide appropriate context and descriptions for screen reader users.
4. **Focus Management**: Make focus visible and ensure logical tab order.
5. **Responsive Design**: Ensure the application works across different devices and screen sizes.
6. **Color Contrast**: Maintain sufficient contrast ratios for text and interactive elements.

## Skip Links

Skip links allow keyboard users to bypass navigation and jump directly to the main content. Our implementation:

```tsx
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
>
  Skip to content
</a>

// Target element
<main id="main-content" tabIndex={-1}>
  {/* Main content */}
</main>
```

Key principles:
- The skip link is visibly hidden until focused
- It appears above all other content when focused
- The target element has `tabIndex={-1}` to allow focus programmatically

## Forms

All form elements must:

1. Have explicit labels associated with inputs using `htmlFor` and `id`
2. Include proper ARIA roles and states
3. Provide clear error messages
4. Use `aria-describedby` to associate error messages with inputs
5. Have logical tab order

Example:

```tsx
<form aria-labelledby="form-heading" noValidate>
  <h2 id="form-heading" className="sr-only">Contact Form</h2>
  
  <label htmlFor="email-input" className="sr-only">
    Enter your email address
  </label>
  <Input
    id="email-input"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? "error-message" : undefined}
    required
  />
  
  {hasError && (
    <div 
      id="error-message" 
      className="text-red-600" 
      role="alert"
      aria-live="assertive"
    >
      Please enter a valid email address
    </div>
  )}
  
  <Button type="submit" aria-busy={isSubmitting}>
    Submit
  </Button>
</form>
```

## Interactive Elements

All buttons, links, and other interactive elements must:

1. Have descriptive text or ARIA labels
2. Include appropriate ARIA roles and states
3. Be keyboard accessible
4. Have visible focus states

Example for a toggle button:

```tsx
<button
  aria-label="Toggle dark mode"
  aria-pressed={isDarkMode}
  onClick={toggleTheme}
>
  <span className="sr-only">
    {isDarkMode ? 'Currently in dark mode' : 'Currently in light mode'}
  </span>
  <Icon aria-hidden="true" />
</button>
```

## Screen Reader Announcements

For dynamic content updates, use ARIA live regions:

```tsx
{/* Polite announcements (don't interrupt) */}
<div 
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {statusMessage}
</div>

{/* Important alerts that should interrupt */}
<div 
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  {errorMessage}
</div>
```

Key principles:
- Use `polite` for non-critical updates
- Use `assertive` for critical information like errors
- Include `aria-atomic="true"` for content that should be announced as a whole

## Images and Icons

All images must have appropriate `alt` text:

```tsx
{/* Informative image */}
<img src="chart.png" alt="Quarter 1 sales increased by 30%" />

{/* Decorative image */}
<img src="decoration.png" alt="" aria-hidden="true" />

{/* SVG icons */}
<svg aria-hidden="true" role="presentation">
  {/* Icon paths */}
</svg>
```

## Testing Accessibility

We use several approaches to ensure accessibility:

### 1. Automated Testing

- jest-axe for component-level testing:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

- Storybook a11y addon for visual development

### 2. Manual Testing

- Keyboard navigation testing
- Screen reader testing (VoiceOver, NVDA, or JAWS)
- Testing with zoom and high contrast modes

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md)

## Scry-Specific Implementations

The following components in our system have specific accessibility features:

### HeroSection

- Typewriter effect uses `aria-live="polite"` to announce text changes
- Animation states are properly communicated to screen readers
- Semantic heading structure with `<h1>`

### CTASection

- Form has proper labels and ARIA attributes
- Error and success states are announced via `role="alert"` and `aria-live`
- Input validation states use `aria-invalid` and `aria-describedby`

### ThemeToggleButton

- Uses `aria-pressed` to communicate toggle state
- Hidden text provides context for screen readers
- SVG icons are hidden from screen readers with `aria-hidden="true"`

### PageLayout

- Includes skip link for keyboard navigation
- Proper semantic structure with `role="banner"`, `role="main"`, and `role="contentinfo"`
- Ensures content is properly labeled for assistive technology