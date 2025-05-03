Your consultation request shows you have a "broken" light mode: missing content, black background, and only the CTA button visible. This is a classic CSS theme application/inheritance issue, often caused by one or more of:

- Theme class (`light`) not being applied at the right DOM level
- CSS variable overrides not being active for light mode (e.g. `:root` vs `.light`)
- Components using hardcoded colors instead of CSS variables or semantic classes

Let’s break down the root problems and give you practical steps and code-level recommendations for a robust, maintainable Next.js theming system.

---

## 1. **ThemeProvider Is Correct: Theme Class Application**
Your `ThemeProvider` applies the correct class to the `<html>` element (via `document.documentElement.classList`). That’s the best practice for Next.js/shadcn/ui/Tailwind systems. **This is good.**

### But: In `layout.tsx` you have:
```tsx
<html lang="en" className="dark" suppressHydrationWarning>
```
This **hardcodes** the `dark` class on your `<html>`. This will *always* start in dark mode, and even if your ThemeProvider later adds `light`, you end up with both `dark` and `light` classes on the root, resulting in broken variable cascade or an override mess.

**Fix: Remove the hardcoded class!**

```tsx
<html lang="en" suppressHydrationWarning>
```
Let your ThemeProvider take full control.

---

## 2. **CSS Variable Scope/Overrides**
Your `theme.css` defines variables like:

```css
:root { ... }          /* Base, then overridden below */
:root { /* dark mode */ ... }
.light { /* light mode */ ... }
```

In dark mode, everything is fine because **:root** applies dark as default, and your HTML starts with `class="dark"`.  
But in light mode, unless `.light` is present on `<html>`, the `.light` overrides do NOT apply. If both `light` and `dark` are present (see above), the cascade is unpredictable (often `dark` wins).

**Summary:** If `<html class="light">`, then `.light` rules are in effect and CSS variables should update. If not, or if both classes are present, you get broken theming.

---

## 3. **Broken Content: Typography, Logo, Hero**
This is usually caused by:
- Components using hardcoded class names (e.g. `text-chalk`, `bg-ink`) instead of semantic ones (`text-foreground`, `bg-background`)
- Component code using Tailwind classes that resolve to wrong values in light mode

### Example:

```css
.text-chalk { color: var(--foreground); }
.text-ink   { color: var(--background); }
```
But in light mode, `--foreground` is `#121212` (Ink), so `.text-chalk` becomes *black* text on a white background.  
If your logo or hero uses `.text-chalk`, it will become black text, possibly blending into a black background if `--background` is not overridden.

**If the background is not updating (still black in light mode),** it's likely that:
- The `.light` class is not present on `<html>`
- Or, some component is using `bg-ink` or a hardcoded `#121212` rather than `bg-background`

---

## 4. **Button Is Visible?**
Your CTA button probably uses `variant="gradient"` or `variant="cta"` which uses semantic colors (`bg-primary`, `text-primary-foreground`), and these map correctly to variables for both light/dark in your theme.

---

## 5. **Storybook: Works, But App Fails?**
If Storybook shows both themes working, but your app doesn’t, it’s further evidence that the `<html class="dark">` hardcoding is the culprit.

---

# **Action Plan and Solution Checklist**

1. **Remove Hardcoded `class="dark"` from `<html>`**
   - Only `ThemeProvider` should apply `.light` or `.dark` at runtime.

2. **Sanity-Check ThemeProvider Effect**
   - After user/system switch, inspect `<html>`: it should have *only* `.dark` or `.light` or neither (for default).

3. **Check CSS Variable Application**
   - In DevTools, inspect `<html>` and see if CSS variables like `--background` are updating when you toggle themes.

4. **Audit All Component Color Classes**
   - Replace all `text-chalk`, `bg-ink`, etc. with semantic classes:
     - `text-foreground`, `bg-background`, `text-primary`, etc.
   - Reserve `text-chalk` etc. for rare explicit branding, not general use.

5. **Check Storybook/Chromatic**
   - In Storybook, manually add `.light` to the root in the preview and verify all components look correct.
   - Set up stories for both themes (with backgrounds).

6. **Reset Any Local Storage Old Values**
   - If you had previously set a theme in localStorage, clear it to test system theme detection.

---

# **Patch Example: `layout.tsx`**

### Before:
```tsx
<html lang="en" className="dark" suppressHydrationWarning>
```
### After:
```tsx
<html lang="en" suppressHydrationWarning>
```

---

# **Patch Example: Component Usage**

### Before:
```tsx
<Logo color="chalk" ... />  // logo uses text-chalk
<DisplayText className="text-chalk" ... />
<BodyText className="text-chalk" ... />
```

### After:
```tsx
<Logo color="foreground" ... />  // or just omit color for default (= semantic)
<DisplayText className="text-foreground" ... />
<BodyText className="text-foreground" ... />
```

Or (best) use *no* explicit color for semantic mapping.

---

# **Patch Example: ThemeProvider**  
Nothing really needs to change; your implementation is solid as long as you remove the hardcoded class on `<html>`.

---

# **Summary Table**

| Component    | Use Semantic Classes      | Use CSS Variables           |
|--------------|--------------------------|-----------------------------|
| Logo         | text-foreground          | var(--foreground)           |
| Headline     | text-foreground          | var(--foreground)           |
| Hero         | bg-background, text-foreground | var(--background), var(--foreground) |
| CTA Button   | bg-primary, text-primary-foreground | var(--primary), var(--primary-foreground) |
| All others   | text-foreground, bg-background, etc. | ...                       |

---

# **What To Do Now**

1. **Fix `layout.tsx`**: Remove `className="dark"` from `<html>`.
2. **Verify `<html>` has only `.light` or `.dark` as appropriate.**
3. **Check your color classes in components:** use only semantic ones.
4. **Test both light/dark mode in browser and Storybook.**
5. **All content should appear, background should switch, and theming will be robust.**

---

## **If you follow these steps, your theming will be robust, maintainable, and follow best practices.**

If you want a single PR checklist:

- [ ] Remove `className="dark"` from `<html>` in `layout.tsx`
- [ ] Review all components for hardcoded color classes, convert to semantic
- [ ] Sanity-check all content in both light and dark modes
- [ ] Test with system theme, manual overrides, and Storybook

**This will resolve your current problem.** If issues persist after this, it's either a caching issue or a missed hardcoded color somewhere.