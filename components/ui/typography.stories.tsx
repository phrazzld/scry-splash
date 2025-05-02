import type { Meta, StoryObj } from '@storybook/react';
import { 
  Typography, 
  DisplayText, 
  HeadingText, 
  SubheadingText, 
  BodyText, 
  SmallText, 
  SubtleText 
} from './typography';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'UI/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          Typography component for Scry design system. Supports multiple variants to match our design tokens:
          - Display (64pt/5.33rem)
          - Heading (32pt/2.67rem)
          - Subheading (18pt/1.5rem)
          - Body (14pt/1.17rem)
          - Small
          
          Each variant can be customized with different weights (regular, medium, bold) and rendered with the appropriate semantic HTML element.
        `
      }
    },
    a11y: {
      // Accessibility checks
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['display', 'heading', 'subheading', 'body', 'small', 'subtle'],
      description: 'The visual style variant',
      table: {
        defaultValue: { summary: 'body' }
      }
    },
    weight: {
      control: { type: 'select' },
      options: ['regular', 'medium', 'bold', undefined],
      description: 'Font weight override (if not specified, uses the default for the variant)',
      table: {
        defaultValue: { summary: 'variant default' }
      }
    },
    as: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'],
      description: 'HTML element to render (defaults based on variant for proper semantics)',
      table: {
        defaultValue: { summary: 'based on variant' }
      }
    },
    children: {
      control: 'text',
      description: 'The text content'
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Typography variants
export const Default: Story = {
  args: {
    children: 'This is the default body text style',
  },
};

export const Display: Story = {
  args: {
    variant: 'display',
    children: 'Display Text',
  },
};

export const Heading: Story = {
  args: {
    variant: 'heading',
    children: 'Heading Text',
  },
};

export const Subheading: Story = {
  args: {
    variant: 'subheading',
    children: 'Subheading Text',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: 'Body text is used for regular paragraphs and general content throughout the application.',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
    children: 'Small text for captions, footnotes, and less emphasized content.',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: 'Subtle text appears in a muted color for secondary information.',
  },
};

// Weight variants
export const BoldBody: Story = {
  args: {
    variant: 'body',
    weight: 'bold',
    children: 'Bold body text for emphasis',
  },
};

export const MediumBody: Story = {
  args: {
    variant: 'body',
    weight: 'medium',
    children: 'Medium weight body text',
  },
};

// Component shortcuts
export const ShortcutComponents: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-4">
      <DisplayText>Display Text Component</DisplayText>
      <HeadingText>Heading Text Component</HeadingText>
      <SubheadingText>Subheading Text Component</SubheadingText>
      <BodyText>Body Text Component for paragraphs and general content.</BodyText>
      <SmallText>Small Text Component for captions and metadata.</SmallText>
      <SubtleText>Subtle Text Component for secondary information.</SubtleText>
    </div>
  ),
};

// Weight Examples
export const WeightVariants: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Typography variant="body" weight="regular">Regular Weight (400)</Typography>
        <Typography variant="body" weight="medium">Medium Weight (500)</Typography>
        <Typography variant="body" weight="bold">Bold Weight (700)</Typography>
      </div>
      
      <div className="space-y-2">
        <Typography variant="heading" weight="regular">Regular Heading (400)</Typography>
        <Typography variant="heading" weight="medium">Medium Heading (500)</Typography>
        <Typography variant="heading" weight="bold">Bold Heading (700)</Typography>
      </div>
      
      <div className="space-y-2">
        <Typography variant="subheading" weight="regular">Regular Subheading (400)</Typography>
        <Typography variant="subheading" weight="medium">Medium Subheading (500)</Typography>
        <Typography variant="subheading" weight="bold">Bold Subheading (700)</Typography>
      </div>
    </div>
  ),
};

// Semantic HTML elements
export const SemanticElements: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="space-y-4">
      <Typography variant="display" as="h1">H1 Element (Display)</Typography>
      <Typography variant="heading" as="h2">H2 Element (Heading)</Typography>
      <Typography variant="subheading" as="h3">H3 Element (Subheading)</Typography>
      <Typography variant="body" as="p">Paragraph Element (Body)</Typography>
      <Typography variant="small" as="span">Span Element (Small)</Typography>
      <div className="border p-4 mt-8">
        <Typography variant="body" as="label">
          This is a label element with body typography
        </Typography>
        <input 
          id="example-input" 
          type="text" 
          className="block mt-2 border p-2 w-full" 
          placeholder="Input with associated label"
        />
      </div>
    </div>
  ),
};

// Typography in context
export const TypographyInContext: Story = {
  args: { children: 'Placeholder' }, // Required by type but not used in render function
  render: () => (
    <div className="max-w-3xl space-y-8 p-6 border rounded-lg">
      <div>
        <DisplayText>Memorize less. Learn more.</DisplayText>
        <SubheadingText className="mt-4">
          Transform your notes into personalized spaced repetition.
        </SubheadingText>
      </div>
      
      <div className="space-y-4 mt-8">
        <HeadingText>How Scry works</HeadingText>
        <BodyText>
          Scry uses AI to transform your existing notes into personalized spaced repetition prompts,
          helping you retain knowledge with minimal effort.
        </BodyText>
        <BodyText>
          Our algorithm identifies the most important concepts from your notes and generates
          spaced repetition prompts that adapt to your learning progress.
        </BodyText>
      </div>
      
      <div className="bg-muted p-4 rounded-md">
        <SubheadingText>Get early access</SubheadingText>
        <BodyText className="mt-2">
          Join our waitlist to be among the first to try Scry.
        </BodyText>
        <SmallText className="mt-4">
          We respect your privacy and won&apos;t share your information.
        </SmallText>
      </div>
    </div>
  ),
};