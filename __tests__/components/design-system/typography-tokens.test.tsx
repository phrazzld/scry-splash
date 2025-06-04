import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { TypographyTokens } from "@/components/design-system/typography-tokens";

describe("TypographyTokens Component", () => {
  it("renders without errors", () => {
    render(<TypographyTokens />);

    // Check main heading is present
    expect(screen.getByText("Typography Tokens")).toBeInTheDocument();

    // Check introductory text is present
    expect(
      screen.getByText(/Scry uses IBM Plex Sans as its primary typeface/),
    ).toBeInTheDocument();
  });

  it("renders all typography token sections", () => {
    render(<TypographyTokens />);

    // Check main sections
    expect(screen.getByText("Typography Tokens")).toBeInTheDocument();
    expect(screen.getByText("Font Family")).toBeInTheDocument();
    expect(screen.getByText("Font Sizes & Line Heights")).toBeInTheDocument();
    expect(screen.getByText("Font Weights")).toBeInTheDocument();
    expect(screen.getByText("Typography Components")).toBeInTheDocument();
    expect(screen.getByText("Usage Examples")).toBeInTheDocument();
  });

  it("renders font family section correctly", () => {
    render(<TypographyTokens />);

    expect(screen.getByText("IBM Plex Sans")).toBeInTheDocument();
    expect(
      screen.getByText(
        /A modern sans-serif typeface with excellent readability/,
      ),
    ).toBeInTheDocument();

    // Check font weight examples
    expect(screen.getByText("Regular 400")).toBeInTheDocument();
    expect(screen.getByText("Medium 500")).toBeInTheDocument();
    expect(screen.getByText("Bold 700")).toBeInTheDocument();

    // Check the preview text is present (at least 3 instances)
    const previewElements = screen.getAllByText("AaBbCcDd");
    expect(previewElements.length).toBe(3);
  });

  it("renders font sizes section correctly", () => {
    render(<TypographyTokens />);

    // Check font size categories are present
    expect(
      screen.getByText("Display - The quick brown fox jumps over the lazy dog"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Heading - The quick brown fox jumps over the lazy dog"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Subheading - The quick brown fox jumps over the lazy dog",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Body - The quick brown fox jumps over the lazy dog"),
    ).toBeInTheDocument();

    // Check for size properties
    expect(screen.getAllByText("Size:")).toHaveLength(4);
    expect(screen.getAllByText("Line Height:")).toHaveLength(4);
    expect(screen.getAllByText("CSS Class:")).toHaveLength(7); // 4 sizes + 3 weights
    expect(screen.getAllByText("Tailwind Class:")).toHaveLength(7); // 4 sizes + 3 weights

    // Check specific font size values
    expect(screen.getByText("5.33rem (85.3px)")).toBeInTheDocument();
    expect(screen.getByText("2.67rem (42.7px)")).toBeInTheDocument();
    expect(screen.getByText("1.5rem (24px)")).toBeInTheDocument();
    expect(screen.getByText("1.17rem (18.7px)")).toBeInTheDocument();

    // Check specific line height values
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("1.2")).toBeInTheDocument();
    expect(screen.getByText("1.3")).toBeInTheDocument();
    expect(screen.getByText("1.5")).toBeInTheDocument();
  });

  it("renders font weights section correctly", () => {
    render(<TypographyTokens />);

    // Check font weight categories
    expect(screen.getByText("Regular")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Bold")).toBeInTheDocument();

    // Check for weight properties
    expect(screen.getAllByText("Variable:")).toHaveLength(3);
    expect(screen.getAllByText("Value:")).toHaveLength(3);

    // Check specific font weight values
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("700")).toBeInTheDocument();

    // Check descriptions
    expect(screen.getByText("Used for most body text")).toBeInTheDocument();
    expect(
      screen.getByText("Used for subheadings and emphasis"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Used for headings and strong emphasis"),
    ).toBeInTheDocument();
  });

  it("renders typography components table correctly", () => {
    render(<TypographyTokens />);

    // Check table headers
    const tableHeaders = screen.getAllByRole("columnheader");
    expect(tableHeaders[0]).toHaveTextContent("Component");
    expect(tableHeaders[1]).toHaveTextContent("Description");
    expect(tableHeaders[2]).toHaveTextContent("Example");
    expect(tableHeaders[3]).toHaveTextContent("Props");

    // Check component rows
    expect(screen.getByText("HeadingText")).toBeInTheDocument();
    expect(screen.getByText("SubheadingText")).toBeInTheDocument();
    expect(screen.getByText("BodyText")).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText("Used for headings with configurable styles"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Used for subheadings with configurable styles"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Used for body text with configurable styles"),
    ).toBeInTheDocument();

    // Check examples
    expect(
      screen.getByText("<HeadingText>Heading Example</HeadingText>"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("<SubheadingText>Subheading Example</SubheadingText>"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("<BodyText>Body text example</BodyText>"),
    ).toBeInTheDocument();

    // Check props
    expect(screen.getAllByText("as, weight, className")).toHaveLength(3);
  });

  it("renders usage examples with code snippets", () => {
    render(<TypographyTokens />);

    // Check code examples
    expect(
      screen.getByText(/\/\* Using Typography Components \*\//),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/import { HeadingText, SubheadingText, BodyText } from/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/<HeadingText>Main Heading<\/HeadingText>/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/<SubheadingText>Subheading<\/SubheadingText>/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/<BodyText>This is body text content...<\/BodyText>/),
    ).toBeInTheDocument();

    expect(screen.getByText(/\/\* Using CSS Classes \*\//)).toBeInTheDocument();
    expect(
      screen.getByText(
        /<h1 className="text-display font-bold">Main Heading<\/h1>/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /<h2 className="text-subheading font-medium">Subheading<\/h2>/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /<p className="text-body font-regular">This is body text content...<\/p>/,
      ),
    ).toBeInTheDocument();
  });

  it("correctly maps through font sizes array", () => {
    render(<TypographyTokens />);

    // Check font size CSS variables are rendered
    const fontSizeVariables = [
      "--font-display-size",
      "--font-heading-size",
      "--font-subheading-size",
      "--font-body-size",
    ];

    fontSizeVariables.forEach((variable) => {
      expect(screen.getByText(variable)).toBeInTheDocument();
    });

    // Check line height CSS variables are rendered
    const lineHeightVariables = [
      "--font-display-line-height",
      "--font-heading-line-height",
      "--font-subheading-line-height",
      "--font-body-line-height",
    ];

    lineHeightVariables.forEach((variable) => {
      expect(screen.getByText(variable)).toBeInTheDocument();
    });
  });

  it("correctly maps through font weights array", () => {
    render(<TypographyTokens />);

    // Check font weight variables are rendered
    const fontWeightVariables = [
      "--font-regular",
      "--font-medium",
      "--font-bold",
    ];

    fontWeightVariables.forEach((variable) => {
      expect(screen.getByText(variable)).toBeInTheDocument();
    });

    // Check font weight classes are rendered
    const fontWeightClasses = [".font-regular", ".font-medium", ".font-bold"];

    fontWeightClasses.forEach((className) => {
      expect(screen.getByText(className)).toBeInTheDocument();
    });
  });

  it("correctly maps through typography components array", () => {
    render(<TypographyTokens />);

    // Check all typography components are rendered in the table
    const componentNames = ["HeadingText", "SubheadingText", "BodyText"];

    // Get all component cells from the table
    const componentCells = screen.getAllByRole("cell", {
      name: new RegExp(`^(${componentNames.join("|")})$`),
    });
    expect(componentCells.length).toBe(componentNames.length);
  });

  it("applies custom className when provided", () => {
    const { container } = render(<TypographyTokens className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes additional props to the container", () => {
    render(
      <TypographyTokens
        data-testid="typography-tokens"
        aria-label="Typography documentation"
      />,
    );
    const typographyTokensContainer = screen.getByTestId("typography-tokens");
    expect(typographyTokensContainer).toHaveAttribute(
      "aria-label",
      "Typography documentation",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TypographyTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
