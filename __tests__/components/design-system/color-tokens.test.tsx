import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { ColorTokens } from "@/components/design-system/color-tokens";

describe("ColorTokens Component", () => {
  it("renders without errors", () => {
    render(<ColorTokens />);
    expect(screen.getByText("Color Tokens")).toBeInTheDocument();
  });

  it("displays all brand colors", () => {
    render(<ColorTokens />);

    // Check brand colors section
    expect(screen.getByText("Brand Colors")).toBeInTheDocument();

    // Check individual colors
    expect(screen.getByText("Ink")).toBeInTheDocument();
    expect(screen.getByText("#121212")).toBeInTheDocument();
    expect(screen.getByText("--color-ink")).toBeInTheDocument();

    expect(screen.getByText("Chalk")).toBeInTheDocument();
    expect(screen.getByText("#FAFAFA")).toBeInTheDocument();
    expect(screen.getByText("--color-chalk")).toBeInTheDocument();

    expect(screen.getByText("Cobalt")).toBeInTheDocument();
    expect(screen.getByText("#0047AB")).toBeInTheDocument();
    expect(screen.getByText("--color-cobalt")).toBeInTheDocument();

    expect(screen.getByText("Cobalt Light")).toBeInTheDocument();
    expect(screen.getByText("#0051C4")).toBeInTheDocument();
    expect(screen.getByText("--color-cobalt-light")).toBeInTheDocument();
  });

  it("displays purple as brand color", () => {
    render(<ColorTokens />);

    // Purple is included in brand colors
    expect(screen.getByText("Purple")).toBeInTheDocument();
    expect(screen.getByText("#B494E9")).toBeInTheDocument();
    expect(screen.getByText("--color-purple")).toBeInTheDocument();
  });

  it("displays semantic colors", () => {
    render(<ColorTokens />);

    // Check semantic colors section
    expect(
      screen.getByText("Semantic Colors (shadcn/ui Integration)"),
    ).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Variable")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
  });

  it("displays color descriptions", () => {
    render(<ColorTokens />);

    // Check color descriptions
    expect(screen.getByText(/Primary dark color/)).toBeInTheDocument();
    expect(screen.getByText(/Primary light color/)).toBeInTheDocument();
    expect(screen.getByText(/Primary accent color/)).toBeInTheDocument();
  });

  it("displays contrast ratios", () => {
    render(<ColorTokens />);

    // Check for contrast ratio information (using getAllByText due to multiple entries)
    const highContrast = screen.getAllByText(/15.85:1/);
    expect(highContrast.length).toBeGreaterThan(0);

    expect(screen.getByText(/7.15:1/)).toBeInTheDocument();
  });

  it("displays code examples", () => {
    render(<ColorTokens />);

    // Check code examples section
    expect(screen.getByText("Code Examples")).toBeInTheDocument();

    // Check for CSS usage comment
    expect(screen.getByText(/\/\* CSS usage \*\//)).toBeInTheDocument();
  });

  it("displays usage guidelines", () => {
    render(<ColorTokens />);

    // Check usage guidelines section
    expect(screen.getByText("Usage Guidelines")).toBeInTheDocument();

    // Check Do and Don't sections
    expect(screen.getByText("Do")).toBeInTheDocument();
    expect(screen.getByText("Don't")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-color-tokens";
    const { container } = render(<ColorTokens className={customClass} />);

    const component = container.firstChild;
    expect(component).toHaveClass(customClass);
  });

  it("forwards additional props", () => {
    const testId = "color-tokens-test";
    render(<ColorTokens data-testid={testId} id="color-tokens" />);

    const component = screen.getByTestId(testId);
    expect(component).toHaveAttribute("id", "color-tokens");
  });

  it("renders color swatches", () => {
    const { container } = render(<ColorTokens />);

    // Color swatches are divs with inline styles for background color
    const colorDivs = container.querySelectorAll(
      'div[style*="background-color"]',
    );
    expect(colorDivs.length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders Typography components correctly", () => {
    render(<ColorTokens />);

    // Typography components should be used for headings
    const heading = screen.getByText("Color Tokens");
    expect(heading.tagName).toMatch(/H[1-6]/);
  });

  it("uses container and grid system correctly", () => {
    const { container } = render(<ColorTokens />);

    // Check for Container usage
    expect(
      container.querySelector(".container, .grid-container"),
    ).toBeInTheDocument();

    // Check for GridItem usage
    expect(container.querySelector('[class*="col-span"]')).toBeInTheDocument();
  });
});
