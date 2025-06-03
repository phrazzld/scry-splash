import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "jest-axe";
import { ShadcnIntegration } from "@/components/design-system/shadcn-integration";

describe("ShadcnIntegration Component", () => {
  it("renders without errors", () => {
    render(<ShadcnIntegration />);

    // Check main heading is present
    expect(screen.getByText("shadcn/ui Integration")).toBeInTheDocument();

    // Check introductory text is present
    expect(
      screen.getByText(/Scry's design system builds on shadcn\/ui/),
    ).toBeInTheDocument();
  });

  it("renders all integration documentation sections", () => {
    render(<ShadcnIntegration />);

    // Check main sections
    expect(screen.getByText("shadcn/ui Integration")).toBeInTheDocument();
    expect(screen.getByText("Color Mapping")).toBeInTheDocument();
    expect(screen.getByText("Component Customization")).toBeInTheDocument();
    expect(screen.getByText("Implementation Details")).toBeInTheDocument();
    expect(screen.getByText("Usage Guidelines")).toBeInTheDocument();
  });

  it("renders color mapping table correctly", () => {
    render(<ShadcnIntegration />);

    // Check table headers
    const tableHeaders = screen.getAllByRole("columnheader");
    expect(tableHeaders[0]).toHaveTextContent("Scry Token");
    expect(tableHeaders[1]).toHaveTextContent("Value");
    expect(tableHeaders[2]).toHaveTextContent("shadcn/ui Variable");
    expect(tableHeaders[3]).toHaveTextContent("Usage");

    // Check specific color mapping values
    expect(screen.getByText("--color-ink")).toBeInTheDocument();
    expect(screen.getByText("#121212")).toBeInTheDocument();
    expect(
      screen.getByText("--background, --card, --popover"),
    ).toBeInTheDocument();
    expect(screen.getByText("Dark background colors")).toBeInTheDocument();

    expect(screen.getByText("--color-chalk")).toBeInTheDocument();
    expect(screen.getByText("#FAFAFA")).toBeInTheDocument();
    expect(
      screen.getByText("--foreground, --card-foreground, --popover-foreground"),
    ).toBeInTheDocument();
    expect(screen.getByText("Text on dark backgrounds")).toBeInTheDocument();

    expect(screen.getByText("--color-cobalt")).toBeInTheDocument();
    expect(screen.getByText("#0047AB")).toBeInTheDocument();
    expect(screen.getByText("--primary")).toBeInTheDocument();
    expect(
      screen.getByText("Primary buttons and interactive elements"),
    ).toBeInTheDocument();
  });

  it("renders component customization table correctly", () => {
    render(<ShadcnIntegration />);

    // Check component table headers
    const componentTableHeaders = screen.getAllByRole("columnheader");
    // Table headers from first table are already checked above
    expect(componentTableHeaders[4]).toHaveTextContent("Component");
    expect(componentTableHeaders[5]).toHaveTextContent("Customization");
    expect(componentTableHeaders[6]).toHaveTextContent("Usage");

    // Check specific component customization entries
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(
      screen.getByText("Added 'cta' variant, customized colors and sizes"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("CTAs, form submissions, interactive elements"),
    ).toBeInTheDocument();

    expect(screen.getByText("Typography")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Customized with Scry's typography scale and IBM Plex Sans",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("All text elements in the application"),
    ).toBeInTheDocument();

    expect(screen.getByText("Container")).toBeInTheDocument();
    expect(
      screen.getByText("Added 12-column grid support and responsive utilities"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Page layout and component positioning"),
    ).toBeInTheDocument();
  });

  it("renders button component examples", () => {
    render(<ShadcnIntegration />);

    // Check button section heading
    expect(screen.getByText("Button Component Example")).toBeInTheDocument();

    // Check button variants headings
    expect(screen.getByText("Default Variant")).toBeInTheDocument();
    expect(screen.getByText("CTA Variant")).toBeInTheDocument();
    expect(screen.getByText("Secondary Variant")).toBeInTheDocument();
    expect(screen.getByText("Outline Variant")).toBeInTheDocument();

    // Check button instances
    expect(
      screen.getByRole("button", { name: "Default Button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "CTA Button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Secondary Button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Outline Button" }),
    ).toBeInTheDocument();

    // Check button descriptions
    expect(
      screen.getByText("The default button variant using primary colors."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Custom CTA variant designed for primary actions."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Secondary button for less prominent actions."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Outline button for tertiary actions."),
    ).toBeInTheDocument();
  });

  it("renders implementation details section correctly", () => {
    render(<ShadcnIntegration />);

    // Check implementation section headings
    expect(screen.getByText("Implementation Details")).toBeInTheDocument();
    expect(screen.getByText("Button Implementation")).toBeInTheDocument();
    expect(screen.getByText("Theme CSS Variables")).toBeInTheDocument();

    // Check for code examples
    expect(
      screen.getByText(/import { cva } from "class-variance-authority"/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/export const buttonVariants = cva/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/"bg-cobalt text-chalk hover:bg-cobalt-light"/),
    ).toBeInTheDocument();

    // Check for theme variables - use getAllByText since these appear in multiple code blocks
    const inkVariables = screen.getAllByText(/--color-ink: #121212;/);
    expect(inkVariables.length).toBeGreaterThan(0);

    const chalkVariables = screen.getAllByText(/--color-chalk: #FAFAFA;/);
    expect(chalkVariables.length).toBeGreaterThan(0);

    const cobaltVariables = screen.getAllByText(/--color-cobalt: #0047AB;/);
    expect(cobaltVariables.length).toBeGreaterThan(0);
  });

  it("renders usage guidelines section correctly", () => {
    render(<ShadcnIntegration />);

    // Check usage guidelines headings
    expect(screen.getByText("Usage Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Do")).toBeInTheDocument();
    expect(screen.getByText("Don't")).toBeInTheDocument();

    // Check do guidelines
    expect(
      screen.getByText("Use shadcn/ui components with Scry's customizations"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Follow shadcn/ui's documentation for component APIs"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Use semantic color variables (--primary, --background) instead of direct brand colors",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Check Storybook for examples of component usage"),
    ).toBeInTheDocument();

    // Check don't guidelines
    expect(
      screen.getByText(
        "Import components directly from shadcn/ui repositories",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Override component styling with inline styles"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Create new variants without documenting them"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Hard-code color values that are already available as variables",
      ),
    ).toBeInTheDocument();
  });

  it("correctly maps through color mapping array", () => {
    render(<ShadcnIntegration />);

    // Check all color tokens from the colorMapping array are rendered
    const colorTokens = [
      "--color-ink",
      "--color-chalk",
      "--color-cobalt",
      "--color-cobalt-light",
      "--color-purple",
      "--focus-outline-color",
    ];

    colorTokens.forEach((token) => {
      expect(screen.getByText(token)).toBeInTheDocument();
    });

    // Check color values
    expect(screen.getByText("#121212")).toBeInTheDocument();
    expect(screen.getByText("#FAFAFA")).toBeInTheDocument();
    expect(screen.getByText("#0047AB")).toBeInTheDocument();
    expect(screen.getByText("#0051C4")).toBeInTheDocument();
    expect(screen.getByText("#B494E9")).toBeInTheDocument();
    expect(screen.getByText("#0060E6")).toBeInTheDocument();
  });

  it("correctly maps through shadcn components array", () => {
    render(<ShadcnIntegration />);

    // Check all component names from the shadcnComponents array are rendered
    const componentNames = ["Button", "Typography", "Container"];

    componentNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <ShadcnIntegration className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes additional props to the container", () => {
    render(
      <ShadcnIntegration
        data-testid="shadcn-integration"
        aria-label="Shadcn integration documentation"
      />,
    );
    const container = screen.getByTestId("shadcn-integration");
    expect(container).toHaveAttribute(
      "aria-label",
      "Shadcn integration documentation",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ShadcnIntegration />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
