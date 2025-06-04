import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { SpacingTokens } from "@/components/ui/tokens/spacing-tokens";

describe("SpacingTokens Component", () => {
  it("renders without errors", () => {
    render(<SpacingTokens />);

    // Check main heading is present
    expect(screen.getByText("Spacing Scale")).toBeInTheDocument();

    // Check description
    expect(
      screen.getByText("Based on an 8pt grid system (0.5rem = 8px)"),
    ).toBeInTheDocument();
  });

  it("renders all spacing tokens", () => {
    render(<SpacingTokens />);

    // Check standard spacing tokens
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();

    // Check special token
    expect(screen.getByText("vertical-lg")).toBeInTheDocument();
  });

  it("renders correct values for spacing tokens", () => {
    render(<SpacingTokens />);

    // Check rem values
    expect(screen.getByText("0.25rem")).toBeInTheDocument();
    expect(screen.getByText("0.5rem")).toBeInTheDocument();
    expect(screen.getByText("1rem")).toBeInTheDocument();
    expect(screen.getByText("2rem")).toBeInTheDocument();
    expect(screen.getByText("3rem")).toBeInTheDocument();
    expect(screen.getByText("10rem")).toBeInTheDocument();
  });

  it("renders descriptions for spacing tokens", () => {
    render(<SpacingTokens />);

    // Check pixel descriptions
    expect(screen.getByText("4px")).toBeInTheDocument();
    expect(screen.getByText("8px - baseline grid unit")).toBeInTheDocument();
    expect(screen.getByText("16px")).toBeInTheDocument();
    expect(screen.getByText("32px")).toBeInTheDocument();
    expect(
      screen.getByText("160px (120pt) - large vertical spacing"),
    ).toBeInTheDocument();
  });

  it("renders visual spacing bars with correct widths", () => {
    render(<SpacingTokens />);

    // Find bars by their container structure
    const spacingBars = screen
      .getAllByRole("generic")
      .filter(
        (el) =>
          el.classList.contains("bg-cobalt") && el.classList.contains("h-6"),
      );

    expect(spacingBars.length).toBeGreaterThan(0);

    // Check that at least one bar has the correct style
    const firstBar = spacingBars[0];
    expect(firstBar).toHaveStyle({ minWidth: "8px" });
  });

  it("applies custom className when provided", () => {
    const { container } = render(<SpacingTokens className="custom-class" />);
    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass("custom-class");
  });

  it("renders spacing tokens in correct layout", () => {
    const { container } = render(<SpacingTokens />);

    // Check for the container structure
    const tokenList = container.querySelector(".space-y-4");
    expect(tokenList).toBeInTheDocument();

    // Check individual token structure
    const tokenItems = container.querySelectorAll(".flex.items-center.mb-4");
    expect(tokenItems.length).toBe(12); // 12 spacing tokens total
  });

  it("uses proper grid layout for token details", () => {
    const { container } = render(<SpacingTokens />);

    // Check for grid layout in token details
    const gridLayouts = container.querySelectorAll(".grid.grid-cols-3");
    expect(gridLayouts.length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SpacingTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
