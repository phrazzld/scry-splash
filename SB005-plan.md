# SB005 · Component · P1: Implement Button using shadcn/ui Button

## Task Analysis

Task ID: SB005  
Title: Implement Button using shadcn/ui Button

### Requirements
1. Add shadcn/ui Button component
2. Customize variants to match Scry's design (primary/CTA with Cobalt Blue)
3. Ensure hover and focus states match design requirements
4. Add proper a11y support

### Done Criteria
1. Button component renders all states (default, hover, focus)
2. The component maintains the focus outline with the improved contrast
3. Stories demonstrate interaction states
4. Stories include accessibility checks

## Implementation Plan

This task involves enhancing the existing Button component and its stories to fully satisfy the requirements. I note that we already have a Button component implemented in `components/ui/button.tsx` and a basic story in `components/ui/button.stories.tsx`. 

### Current State Analysis

The current button component:
- Already uses shadcn/ui Button pattern with cva for variants
- Has multiple variants (default, destructive, outline, secondary, ghost, link)
- Has size variants (default, sm, lg, icon)
- Has basic focus state with the improved contrast outline color (`#0060E6`)
- Includes basic Storybook stories

### Needed Improvements

1. **CTA Button Variant**:
   - Add a dedicated "cta" variant matching the one used in page.tsx
   - The CTA button in page.tsx has additional styles not in the Button component:
     - Uses text-subheading (18pt Medium)
     - Has different padding (px-8 py-4)
     - Has active state scaling (active:scale-[0.98])
     - Uses btn-cta class with hover state

2. **Interactive States**:
   - Ensure all interactive states (hover, focus, active) are properly implemented
   - Add active state scaling for primary/CTA buttons

3. **Accessibility Improvements**:
   - Ensure proper contrast ratios for all variants
   - Add aria-label support
   - Configure Storybook a11y addon for the button stories

4. **Story Enhancements**:
   - Add stories that demonstrate interaction states
   - Add a11y checks to the stories
   - Add proper documentation

## Implementation Steps

1. Enhance the Button component by:
   - Updating the buttonVariants to match design requirements
   - Adding active state scaling
   - Supporting aria attributes properly

2. Update the Button stories to:
   - Add interaction state demonstrations
   - Add a11y checks
   - Document all variants and states properly
   - Include examples matching the CTA in page.tsx

3. Run linting and type checking

4. Verify accessibility compliance

5. Update TODO.md to mark task as complete