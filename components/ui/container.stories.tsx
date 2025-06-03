import type { Meta, StoryObj } from "@storybook/react";
import { Container, GridItem } from "./container";
import { NoiseBackground } from "./noise-background";

const meta: Meta<typeof Container> = {
  title: "UI/Container",
  component: Container,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "2xl", "full"],
      description: "Maximum width of the container",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "responsive"],
      description: "Horizontal padding of the container",
    },
    center: {
      control: "boolean",
      description: "Center the container horizontally",
    },
    gap: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Gap between grid items",
    },
    gapX: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Horizontal gap between grid items",
    },
    gapY: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Vertical gap between grid items",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

// Helper component to visualize the grid
const GridVisualizer = ({
  span = 1,
  start,
  children,
  className,
  ...props
}: {
  span?: number;
  start?: number;
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) => (
  <GridItem
    span={span}
    start={start}
    className={`bg-cobalt/20 border border-cobalt p-4 text-center ${className || ""}`}
    {...props}
  >
    {children || `${span} cols`}
  </GridItem>
);

// Base example
export const Default: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4",
    children: (
      <>
        <div className="col-span-12 mb-4 text-center text-muted-foreground">
          12-column grid
        </div>
        {Array.from({ length: 12 }).map((_, i) => (
          <GridVisualizer key={i} span={1}>
            {i + 1}
          </GridVisualizer>
        ))}
      </>
    ),
  },
};

// Various column spans
export const ColumnSpans: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4 gap-4",
    children: (
      <>
        <div className="col-span-12 mb-4 text-center text-muted-foreground">
          Various column spans
        </div>
        <GridVisualizer span={12}>12 cols (full width)</GridVisualizer>
        <GridVisualizer span={6}>6 cols</GridVisualizer>
        <GridVisualizer span={6}>6 cols</GridVisualizer>
        <GridVisualizer span={4}>4 cols</GridVisualizer>
        <GridVisualizer span={4}>4 cols</GridVisualizer>
        <GridVisualizer span={4}>4 cols</GridVisualizer>
        <GridVisualizer span={3}>3 cols</GridVisualizer>
        <GridVisualizer span={3}>3 cols</GridVisualizer>
        <GridVisualizer span={3}>3 cols</GridVisualizer>
        <GridVisualizer span={3}>3 cols</GridVisualizer>
      </>
    ),
  },
};

// Responsive behavior
export const Responsive: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4 gap-4",
    children: (
      <>
        <div className="col-span-12 mb-4 text-center text-muted-foreground">
          Responsive grid (resize window to see changes)
        </div>
        <GridVisualizer span={12} md={6} lg={4}>
          12 cols on small, 6 on md, 4 on lg
        </GridVisualizer>
        <GridVisualizer span={12} md={6} lg={4}>
          12 cols on small, 6 on md, 4 on lg
        </GridVisualizer>
        <GridVisualizer span={12} md={12} lg={4}>
          12 cols on small, 12 on md, 4 on lg
        </GridVisualizer>
      </>
    ),
  },
};

// Column start positioning
export const ColumnPositioning: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4 gap-4",
    children: (
      <>
        <div className="col-span-12 mb-4 text-center text-muted-foreground">
          Column positioning with col-start
        </div>
        <GridVisualizer span={6} start={1}>
          span 6, start 1 (default)
        </GridVisualizer>
        <GridVisualizer span={6} start={7}>
          span 6, start 7
        </GridVisualizer>
        <GridVisualizer span={4} start={3}>
          span 4, start 3
        </GridVisualizer>
        <GridVisualizer span={6} start={7}>
          span 6, start 7
        </GridVisualizer>
      </>
    ),
  },
};

// Example page layout
export const PageLayout: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4 gap-y-8",
    children: (
      <>
        <GridItem
          span={12}
          md={10}
          mdStart={2}
          lg={8}
          lgStart={3}
          className="bg-background p-6 rounded-lg shadow"
        >
          <h1 className="text-2xl font-bold mb-4">Hero Section</h1>
          <p>
            This example shows a typical centered content layout that&apos;s
            responsive.
          </p>
        </GridItem>

        <GridItem span={12} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-2">Feature 1</h2>
            <p>Feature description goes here</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-2">Feature 2</h2>
            <p>Feature description goes here</p>
          </div>
          <div className="bg-background p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium mb-2">Feature 3</h2>
            <p>Feature description goes here</p>
          </div>
        </GridItem>

        <GridItem
          span={12}
          md={8}
          mdStart={3}
          className="bg-background p-6 rounded-lg shadow text-center"
        >
          <h2 className="text-xl font-medium mb-2">Call to Action</h2>
          <p className="mb-4">Sign up today to get started!</p>
          <button className="bg-cobalt text-chalk px-4 py-2 rounded-lg">
            Sign Up
          </button>
        </GridItem>
      </>
    ),
  },
};

// Gap options
export const GapOptions: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4",
    children: (
      <>
        <div className="col-span-12 mb-4 text-center text-muted-foreground">
          Container with gap=&quot;lg&quot;
        </div>
        <GridVisualizer span={6}>Column 1</GridVisualizer>
        <GridVisualizer span={6}>Column 2</GridVisualizer>
        <GridVisualizer span={4}>Column 3</GridVisualizer>
        <GridVisualizer span={4}>Column 4</GridVisualizer>
        <GridVisualizer span={4}>Column 5</GridVisualizer>
      </>
    ),
    gap: "lg",
  },
};

// Gap X and Gap Y options
export const DirectionalGaps: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    className: "bg-muted/20 p-4",
    children: (
      <>
        <div className="col-span-12 mb-4 text-center text-muted-foreground">
          Container with gapX=&quot;lg&quot; and gapY=&quot;sm&quot;
        </div>
        <GridVisualizer span={6}>Column 1</GridVisualizer>
        <GridVisualizer span={6}>Column 2</GridVisualizer>
        <GridVisualizer span={4}>Column 3</GridVisualizer>
        <GridVisualizer span={4}>Column 4</GridVisualizer>
        <GridVisualizer span={4}>Column 5</GridVisualizer>
      </>
    ),
    gap: "none",
    gapX: "lg",
    gapY: "sm",
  },
};

// Using with the NoiseBackground component
export const WithNoiseBackground: Story = {
  args: {
    maxWidth: "xl",
    padding: "md",
    center: true,
    gap: "lg",
    children: (
      <>
        <GridItem
          span={12}
          className="relative h-64 overflow-hidden rounded-lg"
        >
          <NoiseBackground
            baseColor="var(--color-ink)"
            noiseOpacity={0.02}
            className="h-full"
          >
            <div className="flex items-center justify-center h-full relative z-10">
              <h1 className="text-3xl font-bold text-chalk">
                Container with Noise Background
              </h1>
            </div>
          </NoiseBackground>
        </GridItem>

        <GridItem
          span={12}
          md={6}
          className="bg-background p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-medium mb-2">Left Column</h2>
          <p>
            This demonstrates using the grid with the NoiseBackground component.
          </p>
        </GridItem>

        <GridItem
          span={12}
          md={6}
          className="bg-background p-6 rounded-lg shadow"
        >
          <h2 className="text-xl font-medium mb-2">Right Column</h2>
          <p>The container handles all the responsive grid layout.</p>
        </GridItem>
      </>
    ),
  },
};
