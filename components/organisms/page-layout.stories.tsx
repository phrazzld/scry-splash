import type { Meta, StoryObj } from "@storybook/react"
import { PageLayout, DefaultLayout } from "./page-layout"
import { GridItem } from "@/components/ui/container"
import { HeadingText, BodyText } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

const meta: Meta<typeof PageLayout> = {
  title: "Organisms/PageLayout",
  component: PageLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: {
      control: "color",
      description: "Background color for the NoiseBackground",
    },
    noiseOpacity: {
      control: { type: "range", min: 0, max: 0.2, step: 0.01 },
      description: "Opacity of the noise texture",
    },
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "2xl", "full", "none"],
      description: "Maximum width of the container",
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl", "responsive"],
      description: "Horizontal padding of the container",
    },
    centered: {
      control: "boolean",
      description: "Whether to center the container",
    },
    animate: {
      control: "boolean",
      description: "Whether to animate the content with fade-in",
    },
  },
}

export default meta
type Story = StoryObj<typeof PageLayout>

// Default PageLayout (with 12-column grid demo)
export const Default: Story = {
  args: {
    backgroundColor: "var(--color-ink)",
    noiseOpacity: 0.02,
    maxWidth: "xl",
    padding: "md",
    centered: true,
    animate: true,
    children: (
      <>
        <GridItem span={12} className="mb-8 text-center">
          <HeadingText className="text-chalk">12-Column Grid System</HeadingText>
          <BodyText className="text-chalk mt-2">This demonstrates the responsive grid layout</BodyText>
        </GridItem>
        
        {/* Grid demonstration */}
        {Array.from({ length: 12 }).map((_, i) => (
          <GridItem key={i} span={1} className="h-16 bg-cobalt/20 border border-cobalt rounded-md flex items-center justify-center">
            <BodyText className="text-chalk font-medium">{i + 1}</BodyText>
          </GridItem>
        ))}
        
        {/* Common layouts examples */}
        <GridItem span={12} className="mt-12 mb-4">
          <HeadingText as="h3" variant="subheading" className="text-chalk">Common Layouts</HeadingText>
        </GridItem>
        
        <GridItem span={12} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">Full width (span 12)</BodyText>
        </GridItem>
        
        <GridItem span={12} md={6} mdStart={4} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">Centered content (span 6, start 4 on md+)</BodyText>
        </GridItem>
        
        <GridItem span={12} md={6} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">Left column (span 6 on md+)</BodyText>
        </GridItem>
        
        <GridItem span={12} md={6} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">Right column (span 6 on md+)</BodyText>
        </GridItem>
        
        <GridItem span={12} lg={4} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">3-column: First (span 4 on lg+)</BodyText>
        </GridItem>
        
        <GridItem span={12} lg={4} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">3-column: Second (span 4 on lg+)</BodyText>
        </GridItem>
        
        <GridItem span={12} lg={4} className="bg-cobalt/10 p-6 rounded-lg border border-cobalt mb-4">
          <BodyText className="text-chalk">3-column: Third (span 4 on lg+)</BodyText>
        </GridItem>
      </>
    ),
  },
}

// DefaultLayout example (centered content)
export const WithDefaultLayout: Story = {
  render: (args) => (
    <DefaultLayout {...args}>
      <div className="text-center">
        <Logo className="mb-8" />
        <HeadingText className="text-chalk mb-4">DefaultLayout Example</HeadingText>
        <BodyText className="text-chalk mb-8 opacity-80">
          This uses the DefaultLayout which centers content in a responsive column
        </BodyText>
        <Button size="xl" variant="cta">Call to Action</Button>
      </div>
    </DefaultLayout>
  ),
}

// With different background color
export const AlternativeBackground: Story = {
  args: {
    backgroundColor: "#1a1a1a",
    noiseOpacity: 0.05,
    maxWidth: "xl",
    padding: "md",
    centered: true,
    animate: true,
    children: (
      <GridItem span={12} md={8} mdStart={3} className="text-center py-12">
        <HeadingText className="text-chalk mb-4">Alternative Background</HeadingText>
        <BodyText className="text-chalk opacity-80">
          This demonstrates a different background color and noise opacity
        </BodyText>
      </GridItem>
    ),
  },
}

// Hero section example
export const HeroSectionExample: Story = {
  args: {
    backgroundColor: "var(--color-ink)",
    noiseOpacity: 0.02,
    maxWidth: "xl",
    padding: "md",
    centered: true,
    animate: true,
    children: (
      <>
        <GridItem span={12} md={10} lg={8} mdStart={2} lgStart={3} className="text-center py-16">
          <Logo size="large" className="mb-8" />
          <HeadingText className="text-chalk mb-4">Remember effortlessly</HeadingText>
          <BodyText className="text-chalk opacity-80 mb-8">
            Turns your notes into spaced-repetition prompts—automatically
          </BodyText>
          <Button size="xl" variant="cta">Join the wait‑list</Button>
        </GridItem>
      </>
    ),
  },
}