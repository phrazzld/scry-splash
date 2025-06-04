import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { TokensOverview } from "@/components/design-system/tokens-overview";

describe("TokensOverview Component", () => {
  it("renders without errors", () => {
    render(<TokensOverview />);

    // Check main heading is present
    expect(screen.getByText("Scry Design System")).toBeInTheDocument();

    // Check introductory text is present
    expect(
      screen.getByText(
        /A comprehensive guide to design tokens, components, and patterns/,
      ),
    ).toBeInTheDocument();
  });

  it("renders all token categories", () => {
    render(<TokensOverview />);

    // Check all categories are rendered
    expect(screen.getByText("Colors")).toBeInTheDocument();
    expect(screen.getByText("Typography")).toBeInTheDocument();
    expect(screen.getByText("Spacing")).toBeInTheDocument();
    expect(screen.getByText("Animation")).toBeInTheDocument();
    expect(screen.getByText("Layout")).toBeInTheDocument();
    expect(screen.getByText("shadcn/ui")).toBeInTheDocument();
  });

  it("renders category descriptions correctly", () => {
    render(<TokensOverview />);

    // Check category descriptions
    expect(
      screen.getByText("Brand colors and semantic color tokens"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Font sizes, weights, and line heights"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Spacing scale and layout measurements"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Duration, timing functions, and transitions"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Grid system and container sizing"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Integration with shadcn/ui component library"),
    ).toBeInTheDocument();
  });

  it("renders view links for all categories", () => {
    render(<TokensOverview />);

    // Check all "View X" links
    expect(screen.getByText("View Colors →")).toBeInTheDocument();
    expect(screen.getByText("View Typography →")).toBeInTheDocument();
    expect(screen.getByText("View Spacing →")).toBeInTheDocument();
    expect(screen.getByText("View Animation →")).toBeInTheDocument();
    expect(screen.getByText("View Layout →")).toBeInTheDocument();
    expect(screen.getByText("View shadcn/ui →")).toBeInTheDocument();

    // Check href attributes on links
    const links = screen.getAllByText(/View .* →/);
    expect(links).toHaveLength(6);

    // Verify the first link has the correct href
    expect(links[0]).toHaveAttribute(
      "href",
      "?path=/story/design-system-colortokens--default",
    );
  });

  it("renders color examples for Colors category", () => {
    render(<TokensOverview />);

    // Find the Colors card which contains the color circles
    // The color circles don't have text content, so we can count them
    // by finding the parent div of the Colors category
    const colorsHeading = screen.getByText("Colors");
    const colorsCard = colorsHeading.closest(".p-6");

    // Check that there are color circles inside the card
    // (this is a somewhat fragile test since it depends on the DOM structure)
    if (colorsCard) {
      const colorCircles = colorsCard.querySelectorAll(
        ".h-12.w-12.rounded-full",
      );
      expect(colorCircles.length).toBe(3); // Ink, Chalk, and Cobalt
    }
  });

  it("renders typography examples for Typography category", () => {
    render(<TokensOverview />);

    // Check for typography example text
    expect(screen.getByText("Display")).toBeInTheDocument();
    expect(screen.getByText("Heading")).toBeInTheDocument();
    expect(screen.getByText("Subheading")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();

    // Find the Typography card
    const typographyHeading = screen.getByText("Typography");
    const typographyCard = typographyHeading.closest(".p-6");

    // Check that there are styled text examples inside the card
    if (typographyCard) {
      // Display text with text-display class
      const displayText = typographyCard.querySelector(".text-display");
      expect(displayText).toBeInTheDocument();

      // Heading text with text-heading class
      const headingText = typographyCard.querySelector(".text-heading");
      expect(headingText).toBeInTheDocument();

      // Subheading text with text-subheading class
      const subheadingText = typographyCard.querySelector(".text-subheading");
      expect(subheadingText).toBeInTheDocument();

      // Body text with text-body class
      const bodyText = typographyCard.querySelector(".text-body");
      expect(bodyText).toBeInTheDocument();
    }
  });

  it("renders grid demos for Spacing and Layout categories", () => {
    render(<TokensOverview />);

    // Find the Spacing and Layout cards
    const spacingHeading = screen.getByText("Spacing");
    const spacingCard = spacingHeading.closest(".p-6");

    const layoutHeading = screen.getByText("Layout");
    const layoutCard = layoutHeading.closest(".p-6");

    // Check that there are grid demos inside both cards
    if (spacingCard) {
      const spacingGridDemo = spacingCard.querySelector(".grid.grid-cols-4");
      expect(spacingGridDemo).toBeInTheDocument();
    }

    if (layoutCard) {
      const layoutGridDemo = layoutCard.querySelector(".grid.grid-cols-4");
      expect(layoutGridDemo).toBeInTheDocument();
    }
  });

  it("renders animation demo for Animation category", () => {
    render(<TokensOverview />);

    // Find the Animation card
    const animationHeading = screen.getByText("Animation");
    const animationCard = animationHeading.closest(".p-6");

    // Check that there is an animation demo inside the card
    if (animationCard) {
      const animationDemo = animationCard.querySelector(".animate-fade-in");
      expect(animationDemo).toBeInTheDocument();
    }
  });

  it("correctly maps through token categories array", () => {
    render(<TokensOverview />);

    // Count all category cards
    const categoryCards = screen.getAllByText(/View .* →/);
    expect(categoryCards.length).toBe(6); // 6 categories in total

    // Count categories - there might be other text matching the regex,
    // so we'll make sure the length is at least 6
    const descriptions = screen.getAllByText(
      /tokens|sizes|scale|functions|system|library/,
    );
    expect(descriptions.length).toBeGreaterThanOrEqual(6);
  });

  it("applies custom className when provided", () => {
    const { container } = render(<TokensOverview className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes additional props to the container", () => {
    render(
      <TokensOverview
        data-testid="tokens-overview"
        aria-label="Design system overview"
      />,
    );
    const container = screen.getByTestId("tokens-overview");
    expect(container).toHaveAttribute("aria-label", "Design system overview");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TokensOverview />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
