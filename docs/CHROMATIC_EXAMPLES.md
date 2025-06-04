# Chromatic Usage Examples

This document provides examples of how to use Chromatic with different types of components in the Scry Splash project.

## Basic Component Example

For most static components, no special configuration is needed:

```tsx
// button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button Text",
    variant: "default",
  },
};
```

## Components with Animations

For components with animations, ensure they work with the animation disabling:

```tsx
// animated-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedComponent } from "./animated-component";

const meta: Meta<typeof AnimatedComponent> = {
  title: "UI/AnimatedComponent",
  component: AnimatedComponent,
};

export default meta;
type Story = StoryObj<typeof AnimatedComponent>;

export const Default: Story = {
  parameters: {
    chromatic: {
      // Ensure animations are disabled
      disableAnimations: true,
      // If needed, add delay for components that might not render immediately
      delay: 300,
    },
  },
  args: {
    // Component props
  },
};
```

## Components with Different States

For components with multiple states, create a story for each state:

```tsx
// form-input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { FormInput } from "./form-input";

const meta: Meta<typeof FormInput> = {
  title: "UI/FormInput",
  component: FormInput,
};

export default meta;
type Story = StoryObj<typeof FormInput>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Filled: Story = {
  args: {
    placeholder: "Enter text...",
    value: "Example input",
  },
};

export const Error: Story = {
  args: {
    placeholder: "Enter text...",
    error: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Enter text...",
    disabled: true,
  },
};
```

## Components with Multiple Viewports

For components with significant layout changes at different viewports:

```tsx
// responsive-layout.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ResponsiveLayout } from "./responsive-layout";

const meta: Meta<typeof ResponsiveLayout> = {
  title: "Layout/ResponsiveLayout",
  component: ResponsiveLayout,
};

export default meta;
type Story = StoryObj<typeof ResponsiveLayout>;

export const Default: Story = {
  parameters: {
    chromatic: {
      // Capture at specific viewport sizes that show layout changes
      viewports: [320, 640, 768, 1024, 1280],
    },
  },
  args: {
    // Component props
  },
};
```

## Excluding Components from Snapshots

For components that shouldn't be visually tested (e.g., utility components):

```tsx
// utility-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { UtilityComponent } from "./utility-component";

const meta: Meta<typeof UtilityComponent> = {
  title: "Utils/UtilityComponent",
  component: UtilityComponent,
  parameters: {
    chromatic: { disableSnapshot: true }, // Skip this component in visual testing
  },
};

export default meta;
type Story = StoryObj<typeof UtilityComponent>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```

## Dark and Light Theme Testing

For components that need to be tested in both themes:

```tsx
// themed-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ThemedComponent } from "./themed-component";

const meta: Meta<typeof ThemedComponent> = {
  title: "UI/ThemedComponent",
  component: ThemedComponent,
};

export default meta;
type Story = StoryObj<typeof ThemedComponent>;

// Dark theme (default)
export const Dark: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  args: {
    // Component props
  },
};

// Light theme
export const Light: Story = {
  parameters: {
    backgrounds: { default: "light" },
    theme: "light",
  },
  args: {
    // Component props
  },
};
```

## Components with User Interactions

For components that need to be tested in different interaction states:

```tsx
// interactive-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { InteractiveComponent } from "./interactive-component";

const meta: Meta<typeof InteractiveComponent> = {
  title: "UI/InteractiveComponent",
  component: InteractiveComponent,
};

export default meta;
type Story = StoryObj<typeof InteractiveComponent>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Hover: Story = {
  parameters: {
    pseudo: { hover: true }, // Simulate hover state
  },
  args: {
    // Default props
  },
};

export const Focus: Story = {
  parameters: {
    pseudo: { focus: true }, // Simulate focus state
  },
  args: {
    // Default props
  },
};
```

## Best Practices

1. **Create specific stories for visual states**: Create separate stories for each meaningful visual state of your component.

2. **Use consistent viewport sizes**: Use the defined viewports in the preview configuration.

3. **Test both themes**: If your component appears differently in light and dark themes, test both.

4. **Disable flaky animations**: Use the `disableAnimations` parameter for components with animations.

5. **Add meaningful descriptions**: Add a description to each story to clarify what's being tested.

By following these examples, you'll ensure consistent and comprehensive visual testing of your components.
