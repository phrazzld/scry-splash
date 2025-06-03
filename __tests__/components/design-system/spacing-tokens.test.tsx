import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { SpacingTokens } from "@/components/design-system/spacing-tokens";

describe("SpacingTokens Component", () => {
  it("renders without errors", () => {
    render(<SpacingTokens />);

    // Check main heading is present - HeadingText doesn't use h1 by default
    expect(screen.getByText("Spacing Tokens")).toBeInTheDocument();

    // Check introductory text is present
    expect(
      screen.getByText(
        /Scry uses an 8px grid system as the foundation for all spacing/,
      ),
    ).toBeInTheDocument();
  });

  it("renders all spacing token sections", () => {
    render(<SpacingTokens />);

    // Check main sections
    expect(screen.getByText("Spacing Tokens")).toBeInTheDocument();
    expect(screen.getByText("Base Spacing Units")).toBeInTheDocument();
    expect(screen.getByText("Special Spacing Values")).toBeInTheDocument();
    expect(screen.getByText("Container Gap Options")).toBeInTheDocument();
    expect(screen.getByText("Usage Examples")).toBeInTheDocument();
  });

  it("renders base spacing units correctly", () => {
    render(<SpacingTokens />);

    // Check base spacing units using exact queries
    const descriptions = [
      "Extra small spacing for tight layouts",
      "Minimal spacing, 1 unit in 8px grid",
      "Standard spacing, 2 units in 8px grid",
      "Medium spacing, 3 units in 8px grid",
      "Large spacing, 4 units in 8px grid",
      "Extra large spacing, 6 units in 8px grid",
    ];

    descriptions.forEach((desc) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });

    // Check for the presence of code elements for Tailwind classes
    // We can't check exact text matches because the text is split
    const codeElements = screen.getAllByRole("code");
    expect(codeElements.length).toBeGreaterThanOrEqual(6); // At least 6 code elements for spacing units
  });

  it("renders special spacing values correctly", () => {
    render(<SpacingTokens />);

    // Check for the special spacing section heading
    expect(screen.getByText("Special Spacing Values")).toBeInTheDocument();

    // Check for vertical large value
    expect(screen.getByText("Vertical Large")).toBeInTheDocument();

    // Check for code element for spacing variable
    const codeElements = screen.getAllByRole("code");
    expect(codeElements.length).toBeGreaterThan(0);

    // Check for my-vertical-lg class somewhere in the document
    const verticalLgElements = screen.getAllByText(/my-vertical-lg/i);
    expect(verticalLgElements.length).toBeGreaterThan(0);
  });

  it("renders container gap options table correctly", () => {
    render(<SpacingTokens />);

    // Check table headers
    const tableHeaders = screen.getAllByRole("columnheader");
    expect(tableHeaders[0]).toHaveTextContent("Name");
    expect(tableHeaders[1]).toHaveTextContent("Value");
    expect(tableHeaders[2]).toHaveTextContent("Component Prop");
    expect(tableHeaders[3]).toHaveTextContent("Description");

    // Check container gap options data
    expect(screen.getByText("None")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText('gap="none"')).toBeInTheDocument();
    expect(screen.getByText("No gap between grid items")).toBeInTheDocument();

    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getAllByText("0.5rem (8px)")).not.toHaveLength(0);
    expect(screen.getByText('gap="sm"')).toBeInTheDocument();
    expect(
      screen.getByText("Small gap between grid items"),
    ).toBeInTheDocument();

    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getAllByText("1rem (16px)")).not.toHaveLength(0);
    expect(screen.getByText('gap="md"')).toBeInTheDocument();
    expect(
      screen.getByText("Medium gap between grid items"),
    ).toBeInTheDocument();

    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getAllByText("2rem (32px)")).not.toHaveLength(0);
    expect(screen.getByText('gap="lg"')).toBeInTheDocument();
    expect(
      screen.getByText("Large gap between grid items"),
    ).toBeInTheDocument();

    expect(screen.getByText("Extra Large")).toBeInTheDocument();
    expect(screen.getAllByText("3rem (48px)")).not.toHaveLength(0);
    expect(screen.getByText('gap="xl"')).toBeInTheDocument();
    expect(
      screen.getByText("Extra large gap between grid items"),
    ).toBeInTheDocument();
  });

  it("renders visual examples of container gaps", () => {
    render(<SpacingTokens />);

    expect(
      screen.getByRole("heading", { name: "Visual Example" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Small Gap (8px)")).toBeInTheDocument();
    expect(screen.getByText("Large Gap (32px)")).toBeInTheDocument();
  });

  it("renders usage examples with code snippets", () => {
    render(<SpacingTokens />);

    // Check code examples presence using contains rather than exact text
    expect(screen.getByText(/\/\* Tailwind Classes \*\//)).toBeInTheDocument();
    expect(screen.getByText(/div className="p-4 m-8"/)).toBeInTheDocument();
    expect(screen.getByText(/h2 className="mb-4"/)).toBeInTheDocument();
    expect(screen.getByText(/Heading with bottom margin/)).toBeInTheDocument();
    expect(screen.getByText(/p className="mb-2"/)).toBeInTheDocument();
    expect(
      screen.getByText(/Paragraph with bottom margin/),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/\/\* Container with Gap \*\//),
    ).toBeInTheDocument();
    expect(screen.getByText(/Container gap="md"/)).toBeInTheDocument();
    expect(
      screen.getByText(/GridItem span=\{12\} md=\{6\}>Column 1/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/GridItem span=\{12\} md=\{6\}>Column 2/),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/\/\* Using Special Spacing \*\//),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/main className="my-vertical-lg"/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Content with vertical margin/),
    ).toBeInTheDocument();
  });

  it("correctly maps through base spacing units array", () => {
    render(<SpacingTokens />);

    // Just check that the correct number of spacing unit visualizations are rendered
    // Using the unique descriptions instead of the actual units which might appear multiple times
    const descriptions = [
      "Extra small spacing for tight layouts",
      "Minimal spacing, 1 unit in 8px grid",
      "Standard spacing, 2 units in 8px grid",
      "Medium spacing, 3 units in 8px grid",
      "Large spacing, 4 units in 8px grid",
      "Extra large spacing, 6 units in 8px grid",
    ];

    descriptions.forEach((desc) => {
      expect(screen.getByText(desc)).toBeInTheDocument();
    });
  });

  it("correctly maps through container gaps array", () => {
    render(<SpacingTokens />);

    // The component should render all container gap options
    const gapNames = ["None", "Small", "Medium", "Large", "Extra Large"];
    gapNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    const gapProps = [
      'gap="none"',
      'gap="sm"',
      'gap="md"',
      'gap="lg"',
      'gap="xl"',
    ];
    gapProps.forEach((prop) => {
      expect(screen.getByText(prop)).toBeInTheDocument();
    });
  });

  it("applies custom className when provided", () => {
    const { container } = render(<SpacingTokens className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes additional props to the container", () => {
    render(
      <SpacingTokens
        data-testid="spacing-tokens"
        aria-label="Spacing documentation"
      />,
    );
    const spacingTokensContainer = screen.getByTestId("spacing-tokens");
    expect(spacingTokensContainer).toHaveAttribute(
      "aria-label",
      "Spacing documentation",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SpacingTokens />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
