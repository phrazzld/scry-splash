# Accessibility Testing in Storybook

This document outlines our approach to accessibility testing using Storybook. All components in the Scry design system must meet WCAG 2.1 AA standards for accessibility.

## Built-in Accessibility Checks

We use the `@storybook/addon-a11y` addon to automatically check our components against WCAG standards. This addon is configured to run automatically for all stories.

### Global Configuration

The a11y addon is globally configured in `.storybook/preview.ts` with the following settings:

```typescript
parameters: {
  // Other parameters...

  a11y: {
    // WCAG AA compliance level
    config: {
      rules: [
        {
          // High contrast requirement
          id: 'color-contrast',
          enabled: true
        }
      ]
    },
    // Options for the a11y addon
    options: {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'], // WCAG 2.1 AA compliance
      },
    },
    // Automatically check a11y for all stories
    manual: false,
  }
}
```

### Per-Component Configuration

Components can override or extend these settings in their story metadata:

```typescript
parameters: {
  a11y: {
    config: {
      rules: [
        {
          id: "specific-rule-id",
          enabled: true,
        },
      ];
    }
  }
}
```

## Using the A11y Panel

When viewing a story in Storybook:

1. Look for the "Accessibility" tab in the addon panel (usually at the bottom)
2. This panel will show any violations detected for the current story
3. Expand violations to see detailed information and suggested fixes
4. Address all violations before considering a component complete

## Key Accessibility Considerations

When developing components, pay special attention to:

### 1. Keyboard Navigation

- All interactive elements must be accessible via keyboard
- Focus states must be clearly visible
- Tab order should be logical

### 2. Screen Reader Support

- Use semantic HTML elements
- Include appropriate ARIA attributes when needed
- Test with a screen reader

### 3. Color Contrast

- Text must have sufficient contrast with its background
- The minimum contrast ratio for WCAG AA is:
  - 4.5:1 for normal text
  - 3:1 for large text (18pt+) and graphical elements

### 4. Text Size and Zoom

- Components should support text scaling up to 200%
- Layout should adapt without loss of content or functionality

## Common Issues and Solutions

### Insufficient Color Contrast

**Problem**: Text color doesn't have enough contrast with its background.

**Solution**: Adjust the colors to meet the minimum contrast ratio. Use the contrast checker in the a11y panel to verify.

### Missing Alternative Text

**Problem**: Images or icons lack alternative text.

**Solution**: Add `alt` attributes to images, or use aria-label for icons.

### Non-semantic HTML

**Problem**: Using non-semantic elements like `<div>` for interactive components.

**Solution**: Use proper semantic elements (`<button>`, `<a>`, etc.) or add appropriate ARIA roles.

## Testing Process

1. Develop the component and its stories
2. Check the a11y panel for automated violation detection
3. Address all violations
4. Manually test keyboard navigation
5. If possible, test with a screen reader

By following these guidelines, we ensure our design system is accessible to all users, regardless of ability.
