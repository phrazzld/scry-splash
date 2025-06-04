import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeScript } from "@/components/ui/theme-script";

describe("ThemeScript Component", () => {
  it("renders a script element with proper attributes", () => {
    const { container } = render(<ThemeScript />);

    const script = container.querySelector("script#theme-script");
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute("id", "theme-script");
  });

  it("renders minified script content", () => {
    const { container } = render(<ThemeScript />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // Check that the script is minified (no excessive whitespace)
    expect(scriptContent).not.toMatch(/\n\s+/);

    // Check that key functionality is present in the script
    expect(scriptContent).toContain("localStorage");
    expect(scriptContent).toContain("theme");
    expect(scriptContent).toContain("prefers-color-scheme");
  });

  it("uses default props when none are provided", () => {
    const { container } = render(<ThemeScript />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // Check default values are in the script
    expect(scriptContent).toContain("scry-ui-theme"); // default storageKey
    expect(scriptContent).toContain("system"); // default theme
  });

  it("uses custom props when provided", () => {
    const { container } = render(
      <ThemeScript defaultTheme="dark" storageKey="custom-theme-key" />,
    );

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // Check custom values are in the script
    expect(scriptContent).toContain("custom-theme-key");
    expect(scriptContent).toContain('"dark"');
  });

  it("renders noscript fallback for non-JS environments", () => {
    const { container } = render(<ThemeScript />);

    const noscript = container.querySelector("noscript");
    expect(noscript).toBeInTheDocument();

    // Verify noscript is rendered (React often doesn't render content inside noscript during tests)
    expect(noscript?.tagName.toLowerCase()).toBe("noscript");
  });

  it("handles light theme default correctly", () => {
    const { container } = render(<ThemeScript defaultTheme="light" />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // When defaultTheme is light, it should use light as fallback
    expect(scriptContent).toContain('setTheme("light")');
  });

  it("handles system theme default correctly", () => {
    const { container } = render(<ThemeScript defaultTheme="system" />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // When defaultTheme is system, fallback should be light
    expect(scriptContent).toContain("Apply fallback theme if error occurs");
    expect(scriptContent).toContain('setTheme("light")');
  });

  it("includes error handling in the script", () => {
    const { container } = render(<ThemeScript />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // Check that error handling is present
    expect(scriptContent).toContain("try");
    expect(scriptContent).toContain("catch");
    expect(scriptContent).toContain("console.warn");
  });

  it("includes event listener for system theme changes", () => {
    const { container } = render(<ThemeScript />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // Check that media query listener is added
    expect(scriptContent).toContain("addEventListener");
    expect(scriptContent).toContain("change");
  });

  it("creates theme indicator element for E2E testing", () => {
    const { container } = render(<ThemeScript />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // Check that indicator element creation is present
    expect(scriptContent).toContain("theme-applied-early");
    expect(scriptContent).toContain("createElement");
    expect(scriptContent).toContain("appendChild");
  });

  it("ignores the unused attribute parameter", () => {
    const { container } = render(<ThemeScript attribute="data-custom-theme" />);

    const script = container.querySelector("script#theme-script");
    const scriptContent = script?.innerHTML || "";

    // The attribute prop should not affect the script content
    expect(scriptContent).not.toContain("data-custom-theme");
  });
});
