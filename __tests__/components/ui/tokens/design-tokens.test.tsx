import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { DesignTokens } from "@/components/ui/tokens/design-tokens";

describe("DesignTokens Component", () => {
  it("renders without errors", () => {
    render(<DesignTokens />);

    // Check main heading is present
    expect(screen.getByText("Design Tokens")).toBeInTheDocument();

    // Check introductory text
    expect(
      screen.getByText(/These design tokens form the foundation/),
    ).toBeInTheDocument();
  });

  it("renders all design token sections", () => {
    render(<DesignTokens />);

    // Check all sections are present
    expect(screen.getByText("Color System")).toBeInTheDocument();
    expect(screen.getByText("Typography System")).toBeInTheDocument();
    expect(screen.getByText("Spacing System")).toBeInTheDocument();
    expect(screen.getByText("shadcn/ui Mapping")).toBeInTheDocument();
  });

  it("renders color mapping table correctly", () => {
    render(<DesignTokens />);

    // Check color mapping section
    expect(screen.getByText("Color Mapping")).toBeInTheDocument();
    expect(
      screen.getByText(
        "How Scry design tokens map to shadcn/ui semantic tokens:",
      ),
    ).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText("Scry Token")).toBeInTheDocument();
    expect(screen.getByText("shadcn/ui Semantic Token")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();

    // Check specific mappings
    expect(screen.getByText("ink (#121212)")).toBeInTheDocument();
    expect(screen.getByText("--background")).toBeInTheDocument();
    expect(screen.getByText("Dark mode background")).toBeInTheDocument();

    expect(screen.getByText("chalk (#FAFAFA)")).toBeInTheDocument();
    expect(screen.getByText("--foreground")).toBeInTheDocument();
    expect(screen.getByText("Dark mode text")).toBeInTheDocument();

    expect(screen.getByText("cobalt (#0047AB)")).toBeInTheDocument();
    expect(screen.getByText("--primary")).toBeInTheDocument();
    expect(screen.getByText("Primary action color")).toBeInTheDocument();
  });

  it("renders typography mapping table correctly", () => {
    render(<DesignTokens />);

    // Check typography mapping section
    expect(screen.getByText("Typography Mapping")).toBeInTheDocument();
    expect(
      screen.getByText("How Scry typography maps to shadcn/ui components:"),
    ).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText("Scry Type Scale")).toBeInTheDocument();
    expect(screen.getByText("shadcn/ui Component")).toBeInTheDocument();

    // Check specific mappings
    expect(screen.getByText("display (5.33rem)")).toBeInTheDocument();
    expect(screen.getByText("Typography.h1")).toBeInTheDocument();

    expect(screen.getByText("heading (2.67rem)")).toBeInTheDocument();
    expect(screen.getByText("Typography.h2")).toBeInTheDocument();

    expect(screen.getByText("body (1.17rem)")).toBeInTheDocument();
    expect(screen.getByText("Typography.p")).toBeInTheDocument();
  });

  it("includes all child token components", () => {
    render(<DesignTokens />);

    // Test that color tokens section renders (from ColorTokens component)
    expect(screen.getByText("Brand Colors")).toBeInTheDocument();

    // Test that typography scale renders (from TypographyTokens component)
    expect(screen.getByText("Typography Scale")).toBeInTheDocument();

    // Test that spacing scale renders (from SpacingTokens component)
    expect(screen.getByText("Spacing Scale")).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(<DesignTokens className="custom-class" />);
    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass("custom-class");
  });

  it("renders all mapping tables with correct structure", () => {
    const { container } = render(<DesignTokens />);

    // Find all tables
    const tables = container.querySelectorAll("table");
    expect(tables).toHaveLength(2); // Color mapping and Typography mapping

    // Each table should have thead and tbody
    tables.forEach((table) => {
      expect(table.querySelector("thead")).toBeInTheDocument();
      expect(table.querySelector("tbody")).toBeInTheDocument();
    });
  });

  it("has proper spacing between sections", () => {
    const { container } = render(<DesignTokens />);

    // Check for spacing classes on sections
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(3);

    // Some sections should have padding-top classes
    const sectionsWithPadding = Array.from(sections).filter((section) =>
      section.className.includes("pt-8"),
    );
    expect(sectionsWithPadding.length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<DesignTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
