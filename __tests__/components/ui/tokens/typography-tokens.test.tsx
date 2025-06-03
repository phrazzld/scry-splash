import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { TypographyTokens } from "@/components/ui/tokens/typography-tokens";

describe("TypographyTokens Component", () => {
  it("renders without errors", () => {
    render(<TypographyTokens />);

    // Check main sections are present
    expect(screen.getByText("Typography Scale")).toBeInTheDocument();
    expect(screen.getByText("Font Weights")).toBeInTheDocument();
  });

  it("renders all typography tokens", () => {
    render(<TypographyTokens />);

    // Test each typography token is rendered
    expect(screen.getByText("Display Text")).toBeInTheDocument();
    expect(screen.getByText("Heading Text")).toBeInTheDocument();
    expect(screen.getByText("Subheading Text")).toBeInTheDocument();
    expect(
      screen.getByText(/Body text which is used for regular paragraphs/),
    ).toBeInTheDocument();
  });

  it("displays correct typography properties for each token", () => {
    render(<TypographyTokens />);

    // Check that we have 4 tokens with their properties
    const nameLabels = screen.getAllByText("Name:");
    const sizeLabels = screen.getAllByText("Size:");
    const lineHeightLabels = screen.getAllByText("Line Height:");
    const weightLabels = screen.getAllByText("Weight:");

    expect(nameLabels).toHaveLength(4);
    expect(sizeLabels).toHaveLength(4);
    expect(lineHeightLabels).toHaveLength(4);
    expect(weightLabels).toHaveLength(4);

    // Check specific values for display token
    expect(screen.getByText("display")).toBeInTheDocument();
    expect(screen.getByText("5.33rem")).toBeInTheDocument();
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("700")).toBeInTheDocument();

    // Check specific values for heading token
    expect(screen.getByText("heading")).toBeInTheDocument();
    expect(screen.getByText("2.67rem")).toBeInTheDocument();
    expect(screen.getByText("1.2")).toBeInTheDocument();
    expect(screen.getAllByText("400")).toHaveLength(2); // Two 400 weights (heading and body)

    // Check specific values for subheading token
    expect(screen.getByText("subheading")).toBeInTheDocument();
    expect(screen.getByText("1.5rem")).toBeInTheDocument();
    expect(screen.getByText("1.3")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();

    // Check specific values for body token
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByText("1.17rem")).toBeInTheDocument();
    expect(screen.getByText("1.5")).toBeInTheDocument();
  });

  it("renders font weight section correctly", () => {
    render(<TypographyTokens />);

    // Check all font weight examples are displayed
    expect(screen.getByText("Regular (400)")).toBeInTheDocument();
    expect(screen.getByText("font-regular")).toBeInTheDocument();

    expect(screen.getByText("Medium (500)")).toBeInTheDocument();
    expect(screen.getByText("font-medium")).toBeInTheDocument();

    expect(screen.getByText("Bold (700)")).toBeInTheDocument();
    expect(screen.getByText("font-bold")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const customClass = "my-custom-typography-class";
    const { container } = render(<TypographyTokens className={customClass} />);

    // Check container has the custom class
    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass(customClass);
    expect(containerDiv).toHaveClass("space-y-8");
  });

  it("applies correct inline styles to typography token examples", () => {
    const { container } = render(<TypographyTokens />);

    // Find all divs with style attributes that should contain typography samples
    const styledDivs = container.querySelectorAll("div[style]");

    // We expect at least 4 styled divs (one for each typography token)
    expect(styledDivs.length).toBeGreaterThanOrEqual(4);

    // Verify the display text exists and is rendered properly
    const displayText = screen.getByText("Display Text");
    expect(displayText).toBeInTheDocument();

    // Verify the body text exists and is rendered properly
    const bodyText = screen.getByText(
      /Body text which is used for regular paragraphs/,
    );
    expect(bodyText).toBeInTheDocument();

    // Check that at least one styled div contains our text to ensure styles are applied to typography
    let foundStyledText = false;
    styledDivs.forEach((div) => {
      if (
        div.textContent?.includes("Display Text") ||
        div.textContent?.includes("Body text")
      ) {
        foundStyledText = true;
      }
    });
    expect(foundStyledText).toBe(true);
  });

  it("has proper responsive grid layout", () => {
    render(<TypographyTokens />);

    // Check property grids have responsive classes
    const propertyGrids = screen.getAllByText("Name:")[0].closest(".grid");
    expect(propertyGrids).toHaveClass("grid-cols-1", "md:grid-cols-2");

    // Check font weight grid has responsive classes
    const fontWeightGrid = screen.getByText("Font Weights").nextElementSibling;
    expect(fontWeightGrid).toHaveClass("grid", "grid-cols-1", "md:grid-cols-3");
  });

  it("passes accessibility tests", async () => {
    const { container } = render(<TypographyTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
