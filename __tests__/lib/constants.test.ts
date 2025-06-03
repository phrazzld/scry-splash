import {
  COLORS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SPACING,
  FORMSPARK,
} from "@/lib/constants";

describe("Constants", () => {
  describe("COLORS", () => {
    it("should have all required color values", () => {
      expect(COLORS.INK).toBe("#121212");
      expect(COLORS.CHALK).toBe("#FAFAFA");
      expect(COLORS.COBALT).toBe("#0047AB");
      expect(COLORS.PURPLE).toBe("#b494e9");
    });

    it("should have valid hex color format", () => {
      const hexPattern = /^#[0-9A-Fa-f]{6}$/;

      expect(COLORS.INK).toMatch(hexPattern);
      expect(COLORS.CHALK).toMatch(hexPattern);
      expect(COLORS.COBALT).toMatch(hexPattern);
      expect(COLORS.PURPLE).toMatch(hexPattern);
    });

    it("should have exactly 4 colors", () => {
      const colorKeys = Object.keys(COLORS);
      expect(colorKeys).toHaveLength(4);
      expect(colorKeys).toEqual(["INK", "CHALK", "COBALT", "PURPLE"]);
    });
  });

  describe("FONT_SIZES", () => {
    it("should have all required font sizes", () => {
      expect(FONT_SIZES.DISPLAY).toBe("5.33rem");
      expect(FONT_SIZES.HEADING).toBe("2.67rem");
      expect(FONT_SIZES.SUBHEADING).toBe("1.5rem");
      expect(FONT_SIZES.BODY).toBe("1.17rem");
    });

    it("should have valid rem format", () => {
      const remPattern = /^\d+(\.\d+)?rem$/;

      expect(FONT_SIZES.DISPLAY).toMatch(remPattern);
      expect(FONT_SIZES.HEADING).toMatch(remPattern);
      expect(FONT_SIZES.SUBHEADING).toMatch(remPattern);
      expect(FONT_SIZES.BODY).toMatch(remPattern);
    });

    it("should have sizes in descending order", () => {
      const sizes = [
        parseFloat(FONT_SIZES.DISPLAY),
        parseFloat(FONT_SIZES.HEADING),
        parseFloat(FONT_SIZES.SUBHEADING),
        parseFloat(FONT_SIZES.BODY),
      ];

      for (let i = 0; i < sizes.length - 1; i++) {
        expect(sizes[i]).toBeGreaterThan(sizes[i + 1]);
      }
    });

    it("should have exactly 4 font sizes", () => {
      const sizeKeys = Object.keys(FONT_SIZES);
      expect(sizeKeys).toHaveLength(4);
      expect(sizeKeys).toEqual(["DISPLAY", "HEADING", "SUBHEADING", "BODY"]);
    });
  });

  describe("FONT_WEIGHTS", () => {
    it("should have all required font weights", () => {
      expect(FONT_WEIGHTS.REGULAR).toBe(400);
      expect(FONT_WEIGHTS.MEDIUM).toBe(500);
      expect(FONT_WEIGHTS.BOLD).toBe(700);
    });

    it("should have valid numeric weight values", () => {
      expect(typeof FONT_WEIGHTS.REGULAR).toBe("number");
      expect(typeof FONT_WEIGHTS.MEDIUM).toBe("number");
      expect(typeof FONT_WEIGHTS.BOLD).toBe("number");
    });

    it("should have weights in ascending order", () => {
      expect(FONT_WEIGHTS.REGULAR).toBeLessThan(FONT_WEIGHTS.MEDIUM);
      expect(FONT_WEIGHTS.MEDIUM).toBeLessThan(FONT_WEIGHTS.BOLD);
    });

    it("should have standard CSS font-weight values", () => {
      // CSS font-weight values are multiples of 100 from 100-900
      expect(FONT_WEIGHTS.REGULAR % 100).toBe(0);
      expect(FONT_WEIGHTS.MEDIUM % 100).toBe(0);
      expect(FONT_WEIGHTS.BOLD % 100).toBe(0);

      expect(FONT_WEIGHTS.REGULAR).toBeGreaterThanOrEqual(100);
      expect(FONT_WEIGHTS.BOLD).toBeLessThanOrEqual(900);
    });

    it("should have exactly 3 font weights", () => {
      const weightKeys = Object.keys(FONT_WEIGHTS);
      expect(weightKeys).toHaveLength(3);
      expect(weightKeys).toEqual(["REGULAR", "MEDIUM", "BOLD"]);
    });
  });

  describe("SPACING", () => {
    it("should have vertical large spacing", () => {
      expect(SPACING.VERTICAL_LG).toBe("10rem");
    });

    it("should have valid rem format", () => {
      const remPattern = /^\d+(\.\d+)?rem$/;
      expect(SPACING.VERTICAL_LG).toMatch(remPattern);
    });

    it("should have exactly 1 spacing value", () => {
      const spacingKeys = Object.keys(SPACING);
      expect(spacingKeys).toHaveLength(1);
      expect(spacingKeys).toEqual(["VERTICAL_LG"]);
    });
  });

  describe("FORMSPARK", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("should have correct form action URL", () => {
      expect(FORMSPARK.FORM_ACTION).toBe("https://submit-form.com/");
    });

    it("should use environment variable for form ID when available", () => {
      process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID = "test-form-id";

      // Need to re-import to get the new environment value
      jest.resetModules();
      const { FORMSPARK: updatedFormSpark } = require("@/lib/constants");

      expect(updatedFormSpark.FORM_ID).toBe("test-form-id");
    });

    it("should use fallback form ID when environment variable is not set", () => {
      delete process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID;

      // Need to re-import to get the fallback value
      jest.resetModules();
      const { FORMSPARK: updatedFormSpark } = require("@/lib/constants");

      expect(updatedFormSpark.FORM_ID).toBe("rq22voxgX");
    });

    it("should generate correct submit URL", () => {
      expect(FORMSPARK.SUBMIT_URL).toBe(
        `${FORMSPARK.FORM_ACTION}${FORMSPARK.FORM_ID}`,
      );
      expect(FORMSPARK.SUBMIT_URL).toBe("https://submit-form.com/rq22voxgX");
    });

    it("should have exactly 3 FormSpark properties", () => {
      const formSparkKeys = Object.keys(FORMSPARK);
      expect(formSparkKeys).toHaveLength(3);
      expect(formSparkKeys).toContain("FORM_ID");
      expect(formSparkKeys).toContain("FORM_ACTION");
      expect(formSparkKeys).toContain("SUBMIT_URL");
    });

    it("should generate submit URL dynamically with custom form ID", () => {
      process.env.NEXT_PUBLIC_FORMSPARK_FORM_ID = "custom-id";

      jest.resetModules();
      const { FORMSPARK: customFormSpark } = require("@/lib/constants");

      expect(customFormSpark.SUBMIT_URL).toBe(
        "https://submit-form.com/custom-id",
      );
    });
  });
});
