import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "@/components/molecules/footer";

// Mock component interfaces
interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  "data-testid"?: string;
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  gap?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}

interface GridItemProps {
  children: React.ReactNode;
  span?: number;
  md?: number;
  lg?: number;
  className?: string;
}

// Mock the dependencies of Footer
jest.mock("@/components/ui/typography", () => ({
  BodyText: ({
    children,
    className,
    as,
    "data-testid": dataTestId,
    ...props
  }: BodyTextProps) => (
    <div
      data-testid={dataTestId || "mock-body"}
      data-as={as}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock("@/components/ui/container", () => ({
  Container: ({ children, className, gap, as, ...props }: ContainerProps) => (
    <div
      data-testid={props["data-testid"] || "mock-container"}
      data-gap={gap}
      data-as={as}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
  GridItem: ({ children, span, md, lg, className }: GridItemProps) => (
    <div
      data-testid="mock-grid-item"
      data-span={span}
      data-md={md}
      data-lg={lg}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe("Footer Component", () => {
  it("renders correctly with default props", () => {
    render(<Footer />);

    // Check if the component renders correctly
    const container = screen.getByTestId("footer");
    expect(container).toBeInTheDocument();
    expect(container.tagName.toLowerCase()).toBe("footer");

    // Check that the text content is correct
    const body = screen.getByTestId("footer-attribution");
    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent("a misty step project");
    expect(body).toHaveAttribute("data-as", "p");

    // Check that the default text color is applied
    expect(body.className).toContain("text-foreground/40");
  });

  it("renders with custom project text", () => {
    const customText = "built with ❤️ by misty step";
    render(<Footer projectText={customText} />);

    const body = screen.getByTestId("footer-attribution");
    expect(body).toHaveTextContent(customText);
  });

  it("handles centered prop correctly", () => {
    // Test with centered=false (default)
    const { rerender } = render(<Footer centered={false} />);

    const gridItem = screen.getByTestId("mock-grid-item");
    // Check that with centered=false, we use flex items-center
    expect(gridItem.className).toContain("flex");
    expect(gridItem.className).toContain("items-center");
    expect(gridItem.className).not.toContain("flex-col");

    // Rerender with centered=true
    rerender(<Footer centered={true} />);

    const updatedGridItem = screen.getByTestId("mock-grid-item");
    expect(updatedGridItem.className).toContain("items-center");
    expect(updatedGridItem.className).toContain("text-center");
    expect(updatedGridItem.className).toContain("flex-col");
  });

  it("applies custom text color", () => {
    const customTextColor = "text-cobalt/50";
    render(<Footer textColor={customTextColor} />);

    const body = screen.getByTestId("footer-attribution");
    expect(body.className).toContain(customTextColor);
    expect(body.className).not.toContain("text-foreground/40");
  });

  it("applies custom className", () => {
    const customClass = "custom-footer-class";
    render(<Footer className={customClass} />);

    const container = screen.getByTestId("footer");
    expect(container.className).toContain(customClass);
  });

  it("passes additional props to container", () => {
    render(<Footer data-testprop="test-value" />);

    const container = screen.getByTestId("footer");
    expect(container).toHaveAttribute("data-testprop", "test-value");
  });
});
