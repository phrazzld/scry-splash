import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { ColorTokens } from "@/components/ui/tokens/color-tokens";

describe("ColorTokens Component", () => {
  it("renders without errors", () => {
    render(<ColorTokens />);

    // Check main sections are present
    expect(screen.getByText("Brand Colors")).toBeInTheDocument();
    expect(screen.getByText("Accent Colors")).toBeInTheDocument();
  });

  it("renders all brand color tokens", () => {
    render(<ColorTokens />);

    // Check brand colors using getAllByText since each color appears twice
    const inkElements = screen.getAllByText("ink");
    const chalkElements = screen.getAllByText("chalk");
    const cobaltElements = screen.getAllByText("cobalt");

    expect(inkElements).toHaveLength(2);
    expect(chalkElements).toHaveLength(2);
    expect(cobaltElements).toHaveLength(2);

    // Check values
    expect(screen.getByText("#121212")).toBeInTheDocument();
    expect(screen.getByText("#FAFAFA")).toBeInTheDocument();
    expect(screen.getByText("#0047AB")).toBeInTheDocument();
  });

  it("renders all accent color tokens", () => {
    render(<ColorTokens />);

    // Check accent colors using getAllByText since each color appears twice
    const cobaltLightElements = screen.getAllByText("cobalt-light");
    const focusOutlineElements = screen.getAllByText("focus-outline");
    const purpleElements = screen.getAllByText("purple");

    expect(cobaltLightElements).toHaveLength(2);
    expect(focusOutlineElements).toHaveLength(2);
    expect(purpleElements).toHaveLength(2);

    // Check values
    expect(screen.getByText("#0051c4")).toBeInTheDocument();
    expect(screen.getByText("#0060E6")).toBeInTheDocument();
    expect(screen.getByText("#b494e9")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(<ColorTokens className="custom-class" />);
    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass("custom-class");
  });

  it("renders color swatches with correct background colors", () => {
    render(<ColorTokens />);

    // Find the hex values which are unique
    const inkHex = screen.getByText("#121212");
    const inkColorSwatch = inkHex
      .closest(".flex.flex-col")
      ?.querySelector(".w-full.h-16");
    expect(inkColorSwatch).toHaveStyle({ backgroundColor: "rgb(18, 18, 18)" });

    const chalkHex = screen.getByText("#FAFAFA");
    const chalkColorSwatch = chalkHex
      .closest(".flex.flex-col")
      ?.querySelector(".w-full.h-16");
    expect(chalkColorSwatch).toHaveStyle({
      backgroundColor: "rgb(250, 250, 250)",
    });
  });

  it("uses correct text colors for contrast", () => {
    render(<ColorTokens />);

    // Find by hex values which are unique
    const chalkHex = screen.getByText("#FAFAFA");
    const chalkColorSwatch = chalkHex
      .closest(".flex.flex-col")
      ?.querySelector(".w-full.h-16");
    expect(chalkColorSwatch).toHaveStyle({ color: "rgb(18, 18, 18)" });

    const purpleHex = screen.getByText("#b494e9");
    const purpleColorSwatch = purpleHex
      .closest(".flex.flex-col")
      ?.querySelector(".w-full.h-16");
    expect(purpleColorSwatch).toHaveStyle({ color: "rgb(18, 18, 18)" });
  });

  it("renders color tokens in correct grid layout", () => {
    const { container } = render(<ColorTokens />);

    // Check grid structure
    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(2);

    // Each section should have a grid of color tokens
    sections.forEach((section) => {
      const grid = section.querySelector(".grid");
      expect(grid).toBeInTheDocument();
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ColorTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
