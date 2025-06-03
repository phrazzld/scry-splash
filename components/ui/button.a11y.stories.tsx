import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

/**
 * This file contains specific accessibility-focused stories for the Button component.
 * It demonstrates accessible usage patterns and serves as documentation for a11y requirements.
 */

const meta = {
  title: "UI/Button/Accessibility",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
          Accessibility-focused stories for the Button component. 
          These stories demonstrate best practices for ensuring buttons are accessible to all users.
          
          Key a11y considerations for buttons:
          - Proper contrast between text and background
          - Clear focus indicators
          - Meaningful labels for screen readers
          - Keyboard navigability
          - Proper size for touch targets
        `,
      },
    },
    // Specific a11y checks for button-related concerns
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true,
          },
          {
            id: "button-name",
            enabled: true,
          },
        ],
      },
    },
  },
  argTypes: {
    // Existing argTypes...
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Example showing a button with proper aria-label for screen readers.
 * This is especially important for icon-only buttons.
 */
export const AriaLabelDemo: Story = {
  args: {
    children: "🔍",
    size: "icon",
    "aria-label": "Search",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Buttons without text content should always have an aria-label to provide context for screen readers.",
      },
    },
  },
};

/**
 * Example showing how to provide additional context for buttons with generic text.
 */
export const AriaLabeledBy: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 id="newsletter-heading">Newsletter Signup</h2>
      <p id="newsletter-description">
        Subscribe to receive updates about Scry&apos;s launch and promotions.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          aria-labelledby="newsletter-heading"
          aria-describedby="newsletter-description"
          className="border p-2 rounded-md"
          placeholder="Enter your email"
        />
        <Button
          aria-labelledby="newsletter-heading"
          aria-describedby="newsletter-description"
        >
          Submit
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Using aria-labelledby and aria-describedby to associate a button with descriptive content elsewhere on the page.",
      },
    },
  },
};

/**
 * Example showing disabled button with explanation.
 * Disabled buttons should still communicate why they're disabled.
 */
export const DisabledAccessibly: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Button disabled aria-describedby="disabled-explanation">
          Submit Form
        </Button>
        <p id="disabled-explanation" className="text-sm text-muted">
          Please fill out all required fields to enable submission.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled buttons should be accompanied by text explaining why they&apos;re disabled and how to enable them.",
      },
    },
  },
};

/**
 * Example demonstrating focus styles and keyboard navigation.
 */
export const FocusManagement: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm mb-2">
          Default focus styles (try tabbing to these buttons):
        </h3>
        <div className="flex gap-4">
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="cta">CTA Button</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm mb-2">
          Button groups with keyboard navigation:
        </h3>
        <div
          role="group"
          aria-label="Text formatting options"
          className="flex gap-1"
        >
          <Button variant="ghost" size="icon" aria-label="Bold text">
            B
          </Button>
          <Button variant="ghost" size="icon" aria-label="Italic text">
            I
          </Button>
          <Button variant="ghost" size="icon" aria-label="Underline text">
            U
          </Button>
          <Button variant="ghost" size="icon" aria-label="Strikethrough text">
            S
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Buttons must have clear focus indicators and support proper keyboard navigation. Button groups should use appropriate ARIA roles.",
      },
    },
  },
};

/**
 * Example showing proper touch target sizing.
 */
export const TouchTargetSize: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm mb-2">
          Recommended minimum touch target size (44x44px):
        </h3>
        <div className="flex gap-4 items-center">
          <Button size="lg" className="min-h-[44px] min-w-[44px]">
            Large Button
          </Button>
          <Button size="icon" className="min-h-[44px] min-w-[44px]">
            +
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm mb-2 text-yellow-500">
          Too small for touch targets (avoid):
        </h3>
        <div className="flex gap-4 items-center">
          <Button size="sm" className="min-h-[24px] h-6">
            Small Button
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Touch targets should be at least 44x44 pixels to accommodate users with motor impairments, per WCAG 2.1 Success Criterion 2.5.5.",
      },
    },
  },
};

/**
 * Example demonstrating proper button vs. link semantics.
 */
export const ButtonVsLink: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm mb-2">
          Button for actions (manipulates data or app state):
        </h3>
        <Button>Save Changes</Button>
      </div>

      <div>
        <h3 className="text-sm mb-2">
          Link styling with anchor semantics (navigates to new URL):
        </h3>
        <a
          href="#"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium bg-cobalt text-chalk hover:bg-[#0051c4]"
        >
          View Documentation
        </a>
      </div>

      <div>
        <h3 className="text-sm mb-2">Link variant for text links:</h3>
        <Button
          variant="link"
          onClick={() =>
            alert("This should ideally be an <a> element if it navigates")
          }
        >
          Terms &amp; Conditions
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use semantic HTML: &lt;button&gt; elements for actions that don&apos;t change URL, and &lt;a&gt; elements for navigation. Styling can be shared, but semantics should be preserved.",
      },
    },
  },
};
