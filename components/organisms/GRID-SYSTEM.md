# 12-Column Grid System

The Scry design system uses a responsive 12-column grid layout to create consistent spacing and alignment across different screen sizes. This document explains how to use the grid system effectively.

## Overview

The grid system is implemented through the `Container` and `GridItem` components. The grid consists of 12 equal-width columns with configurable gaps between them. This approach provides a flexible layout system that can adapt to different screen sizes.

## Usage

```tsx
<PageLayout>
  <GridItem span={12} md={6} lg={4}>Content 1</GridItem>
  <GridItem span={12} md={6} lg={4}>Content 2</GridItem>
  <GridItem span={12} md={12} lg={4}>Content 3</GridItem>
</PageLayout>
```

## Column Spans and Responsive Behavior

Each `GridItem` can specify how many columns it spans at different breakpoints:

- `span`: Default span for all breakpoints
- `sm`: Small screens (640px and up)
- `md`: Medium screens (768px and up)
- `lg`: Large screens (1024px and up)
- `xl`: Extra large screens (1280px and up)

For example, `span={12} md={6} lg={4}` means:
- Takes all 12 columns on mobile (default)
- Takes 6 columns on medium-sized screens
- Takes 4 columns on large screens

## Column Positioning

You can also specify where a grid item starts in the grid:

- `start`: Default start position for all breakpoints
- `smStart`: Start position on small screens
- `mdStart`: Start position on medium screens
- `lgStart`: Start position on large screens
- `xlStart`: Start position on extra large screens

For example, `span={6} mdStart={4}` means it spans 6 columns and starts at column 4 on medium-sized screens.

## Common Layouts

### Full Width
```tsx
<GridItem span={12}>Full width content</GridItem>
```

### Centered Content
```tsx
<GridItem span={12} md={8} mdStart={3}>Centered content on medium screens</GridItem>
```

### Multi-Column Layout
```tsx
<>
  <GridItem span={12} md={6}>Left column</GridItem>
  <GridItem span={12} md={6}>Right column</GridItem>
</>
```

### Three-Column Layout
```tsx
<>
  <GridItem span={12} lg={4}>Column 1</GridItem>
  <GridItem span={12} lg={4}>Column 2</GridItem>
  <GridItem span={12} lg={4}>Column 3</GridItem>
</>
```

## Container Configuration

The `Container` component that wraps the grid system can be configured with:

- `maxWidth`: Maximum width (`sm`, `md`, `lg`, `xl`, `2xl`, `full`, `none`)
- `padding`: Horizontal padding (`none`, `sm`, `md`, `lg`, `xl`, `responsive`)
- `center`: Whether to center the container horizontally
- `gap`: Gap between grid items (`none`, `sm`, `md`, `lg`, `xl`)
- `gapX`: Horizontal gap (`none`, `sm`, `md`, `lg`, `xl`)
- `gapY`: Vertical gap (`none`, `sm`, `md`, `lg`, `xl`)

## Best Practices

1. Always use the grid system for layout consistency
2. Design for mobile-first, then adjust for larger screens
3. Use column positioning for more complex layouts
4. Use appropriate gaps for visual spacing
5. Consider using the `DefaultLayout` component for standard centered layouts