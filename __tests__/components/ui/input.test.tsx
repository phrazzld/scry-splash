import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input } from "@/components/ui/input";

// Mock the cn utility function
jest.mock("@/lib/utils", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

describe("Input Component", () => {
  it("renders correctly with default props", () => {
    render(<Input data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex");
  });

  it("renders with correct type attribute", () => {
    render(<Input type="email" data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders with custom className", () => {
    const customClass = "custom-class";
    render(<Input className={customClass} data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toHaveClass(customClass);
  });

  it("renders with custom containerClassName", () => {
    const containerClass = "container-class";
    render(<Input containerClassName={containerClass} />);

    const container = screen.getByRole("textbox").parentElement;
    expect(container).toHaveClass(containerClass);
  });

  it("applies placeholder attribute", () => {
    const placeholder = "Enter your email";
    render(<Input placeholder={placeholder} data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("placeholder", placeholder);
  });

  it("applies disabled attribute", () => {
    render(<Input disabled data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toBeDisabled();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(ref.current).toBe(input);
  });

  it("passes additional props to the input element", () => {
    render(
      <Input
        aria-label="Email input"
        data-custom="custom-value"
        data-testid="test-input"
      />,
    );

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("aria-label", "Email input");
    expect(input).toHaveAttribute("data-custom", "custom-value");
  });
});
