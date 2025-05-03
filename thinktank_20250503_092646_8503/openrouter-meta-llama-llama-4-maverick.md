To address the issue of broken light mode implementation in the Scry Splash page, we need to examine the provided codebase and identify the root cause of the problem. 

The issue is described as follows: when switching to light mode, content is missing (no logo, no headline text), the background remains black instead of becoming light, and only the CTA button remains visible.

1. **CSS Variable Inheritance**: The first step is to verify that CSS variables are correctly defined and inherited across different themes. The `/app/theme.css` file contains theme variables, and it seems that the `.light` class is used to define the light mode theme. We should check if this class is being applied correctly when the theme is switched to light mode.

2. **Class Application**: The next step is to ensure that the `.light` class is being applied to the root element (usually the `html` or `body` tag) when the user switches to light mode. The `ThemeProvider` component in `/components/ui/theme-provider.tsx` seems to be responsible for handling theme switching. We need to verify that it correctly applies the `.light` class when the theme is set to light.

3. **Component Styling**: We should review the styling of components like `Logo`, `HeroSection`, and `NoiseBackground` to ensure they properly respect theme variables. For instance, the `Logo` component's color is set based on the `logoColor` prop, which defaults to "chalk". In the `HeroSection` component, `logoColor="chalk"` is used, and "chalk" maps to `text-foreground` in `logoVariants`. We need to check if `text-foreground` has the correct color value in both dark and light themes.

4. **Background Color**: The `NoiseBackground` component's background color is set to `baseColor`, which defaults to `var(--background)`. We should verify that `var(--background)` is correctly set to the light background color when the `.light` class is applied.

Upon reviewing the code, we notice that the `RootLayout` component in `/app/layout.tsx` sets the `lang` attribute of the `html` element to "en" and includes a `className="dark"` attribute. This could potentially cause issues with theme switching if not handled correctly by the `ThemeProvider`.

To fix the broken light mode, we should:
- Ensure the `ThemeProvider` correctly applies the `.light` class to the root element when the theme is set to light.
- Verify that all components use the correct theme variables for their styling.
- Check that the `NoiseBackground` component's background color updates correctly when the theme changes.

Here's an example of how the `ThemeProvider` could be modified to apply the theme class to the root element:

```typescript
// components/ui/theme-provider.tsx
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "scry-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system") {
        return storedTheme;
      }
    }
    return defaultTheme;
  });
  
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setSystemTheme(isDarkMode ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      root.classList.add(systemTheme);
      root.dataset.theme = systemTheme;
    } else {
      root.classList.add(theme);
      root.dataset.theme = theme;
    }
    localStorage.setItem(storageKey, theme);
  }, [theme, systemTheme, storageKey]);

  const value = {
    theme,
    systemTheme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
```

And here's how you could adjust the `RootLayout` to not force a dark theme:

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.variable}`}>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

By making these adjustments, we should be able to fix the issues with the light mode implementation and ensure that all components are properly styled across different themes.