/**
 * Design system constants for the Scry application
 * This file serves as the single source of truth for design tokens
 */

/**
 * Brand and UI color palette
 *
 * Core color tokens that define the visual identity of the application.
 * These are referenced in the Tailwind theme configuration and used
 * directly in component styles.
 *
 * @example
 * ```tsx
 * import { COLORS } from "@/lib/constants";
 *
 * // Direct usage in inline styles
 * <div style={{ backgroundColor: COLORS.INK }}>Dark background</div>
 *
 * // References via Tailwind classes
 * <div className="bg-ink text-chalk">Content</div>
 * ```
 */
export const COLORS = {
  /** Primary dark color used for text and backgrounds */
  INK: "#121212", // Ink Black

  /** Primary light color used for text and backgrounds */
  CHALK: "#FAFAFA", // Chalk White

  /** Brand accent color for buttons and highlights */
  COBALT: "#0047AB", // Cobalt Blue

  /** Secondary accent color used for specific links and UI elements */
  PURPLE: "#b494e9", // Accent purple used for "Learn more"
};

/**
 * Typography size scale
 *
 * Font size tokens that ensure consistent typographic hierarchy.
 * Mapped to tailwind theme and typography components.
 */
export const FONT_SIZES = {
  /** For primary headlines and hero text - 64pt */
  DISPLAY: "5.33rem", // 64pt ≈ 85.3px ≈ 5.33rem

  /** For section titles - 32pt */
  HEADING: "2.67rem", // 32pt ≈ 42.7px ≈ 2.67rem

  /** For subsection titles and large UI elements - 18pt */
  SUBHEADING: "1.5rem", // 18pt ≈ 24px ≈ 1.5rem

  /** For standard body text - 14pt */
  BODY: "1.17rem", // 14pt ≈ 18.7px ≈ 1.17rem
};

/**
 * Font weight tokens
 *
 * Consistent weights for typography used throughout the application
 */
export const FONT_WEIGHTS = {
  /** Normal text weight */
  REGULAR: 400,

  /** Medium emphasis */
  MEDIUM: 500,

  /** Strong emphasis and headlines */
  BOLD: 700,
};

/**
 * Spacing system tokens
 *
 * Defines common spacing values for margins, padding, and layout
 */
export const SPACING = {
  /** Large vertical spacing, typically used for section separation */
  VERTICAL_LG: "10rem", // 160px (120pt) - for vertical margins
};

/**
 * FormSpark integration constants
 *
 * Configures the external FormSpark service for form submissions
 *
 * @example
 * ```tsx
 * import { FORMSPARK } from "@/lib/constants";
 *
 * // Form submission
 * const handleSubmit = async (data) => {
 *   await fetch(FORMSPARK.SUBMIT_URL, {
 *     method: "POST",
 *     body: JSON.stringify(data)
 *   });
 * };
 * ```
 */
export const FORMSPARK = {
  /** FormSpark form ID from environment or fallback */
  FORM_ID: process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID || "rq22voxgX",

  /** FormSpark API endpoint base URL */
  FORM_ACTION: "https://submit-form.com/",

  /**
   * Complete submission URL combining base and form ID
   * @returns Full submission URL
   */
  get SUBMIT_URL() {
    return `${this.FORM_ACTION}${this.FORM_ID}`;
  },
};
