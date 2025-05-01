# Storybook Implementation Plan with shadcn/ui

## Overview
This plan outlines the tasks needed to implement a Storybook-driven approach for the Scry splash page, leveraging shadcn/ui components where appropriate. We'll follow atomic design principles, creating stories for atomic components first, then composing them into molecules and organisms.

## Setup & Configuration

- [x] **SB001 · Setup · P0: Configure Storybook with shadcn/ui integration**
    - **Action:**
        1. Set up Storybook with appropriate addons (a11y, viewport, controls, themes)
        2. Configure Tailwind CSS and CSS variables support in Storybook
        3. Configure shadcn/ui theme in Storybook
        4. Set up proper component aliasing to match components.json
    - **Done-when:**
        1. Storybook runs with proper styling
        2. shadcn/ui components render correctly in Storybook
        3. Theme variables are accessible in stories

- [x] **SB002 · Setup · P1: Create design token integration**
    - **Action:**
        1. Ensure Scry brand colors (Ink, Chalk, Cobalt) are properly integrated with shadcn/ui theming
        2. Create stories that demonstrate the theme configuration
        3. Document how custom brand tokens map to shadcn/ui theme properties
    - **Done-when:**
        1. Custom Scry theme is properly applied to shadcn/ui components
        2. Stories demonstrate both dark and light modes with correct colors

## Atomic Components

- [x] **SB003 · Component · P1: Implement Typography using shadcn/ui Typography**
    - **Action:**
        1. Add shadcn/ui Typography components
        2. Extend/customize to support Scry's typography scale (display, heading, subheading, body)
        3. Create variants for all weight combinations (regular, medium, bold)
        4. Add proper a11y props
    - **Done-when:**
        1. Component renders all typography variants with proper IBM Plex Sans styling
        2. Stories demonstrate each variant
        3. Stories include accessibility checks

- [x] **SB004 · Component · P1: Create Logo component**
    - **Action:**
        1. Extract the "Scry." logo into a standalone component
        2. Support size variants
        3. Include proper semantics and a11y attributes
    - **Done-when:**
        1. Logo component renders correctly
        2. Component includes proper aria-label

- [x] **SB005 · Component · P1: Implement Button using shadcn/ui Button**
    - **Action:**
        1. Add shadcn/ui Button component
        2. Customize variants to match Scry's design (primary/CTA with Cobalt Blue)
        3. Ensure hover and focus states match design requirements
        4. Add proper a11y support
    - **Done-when:**
        1. Button component renders all states (default, hover, focus)
        2. The component maintains the focus outline with the improved contrast
        3. Stories demonstrate interaction states
        4. Stories include accessibility checks

- [x] **SB006 · Component · P2: Create NoiseBackground component**
    - **Action:**
        1. Extract the noise overlay background into a standalone component
        2. Support customization of opacity and base color
        3. Ensure good performance
    - **Done-when:**
        1. Component renders the noise texture correctly
        2. Stories demonstrate configuration options

- [x] **SB007 · Component · P2: Implement shadcn/ui Container**
    - **Action:**
        1. Add shadcn/ui Container component
        2. Customize to support the 12-column grid system
        3. Create responsive variants that match Scry's layout requirements
    - **Done-when:**
        1. Container component properly implements the responsive grid
        2. Stories demonstrate different responsive behaviors

## Molecule Components

- [x] **SB008 · Component · P1: Create HeroSection component**
    - **Action:**
        1. Compose Logo and Typography components into a hero section
        2. Support customizable headline and subheadline
        3. Implement responsive behavior using shadcn/ui components
    - **Done-when:**
        1. Component renders with proper spacing and alignment
        2. Stories demonstrate responsive behavior
        3. Component uses the atomic components

- [x] **SB009 · Component · P2: Create BenefitTrio component**
    - **Action:**
        1. Create a component for the "Capture anything · Review in moments · Master for life" section
        2. Use shadcn/ui Typography for consistent text rendering
        3. Support customizable benefit points
        4. Implement proper spacing and alignment
    - **Done-when:**
        1. Component renders with proper spacing and typography
        2. Stories demonstrate different content options

- [x] **SB010 · Component · P1: Create CTASection component**
    - **Action:**
        1. Compose shadcn/ui Button and Typography components for CTA section
        2. Support customizable button text and microcopy
        3. Implement proper spacing
    - **Done-when:**
        1. Component renders with proper spacing
        2. Stories demonstrate different variants

## Organism Components

- [x] **SB011 · Component · P0: Create PageLayout component**
    - **Action:**
        1. Use shadcn/ui Container as the foundation
        2. Support configurable column spans for different breakpoints
        3. Implement background with NoiseBackground component
        4. Document the 12-column system
    - **Done-when:**
        1. Component properly implements the responsive page layout
        2. Stories demonstrate different layout configurations

- [x] **SB012 · Component · P0: Create SplashPage component**
    - **Action:**
        1. Compose all molecules into the complete page layout
        2. Ensure proper vertical spacing
        3. Implement fade-in animation
        4. Leverage shadcn/ui motion utilities if applicable
    - **Done-when:**
        1. Component renders the complete splash page
        2. Stories demonstrate responsive behavior
        3. Component uses all the molecule components

## Documentation & Tooling

- [x] **SB015 · Docs · P2: Create design system documentation**
    - **Action:**
        1. Document all color, typography, spacing, and animation tokens
        2. Create a story showcasing all tokens visually
        3. Document the integration between Scry design system and shadcn/ui
    - **Done-when:**
        1. All design tokens are documented and visualized in Storybook
        2. Integration patterns with shadcn/ui are clearly documented

- [ ] **SB016 · Tooling · P2: Implement visual regression testing**
    - **Action:**
        1. Set up Chromatic or similar tool for visual regression testing
        2. Create baseline snapshots for all components
    - **Done-when:**
        1. Visual regression tests run automatically
        2. Baseline snapshots are established

- [ ] **SB017 · Tooling · P1: Implement a11y testing in Storybook**
    - **Action:**
        1. Configure the a11y addon for all stories
        2. Ensure all components pass WCAG AA standards
    - **Done-when:**
        1. A11y tests run on all stories
        2. No violations are reported

## Refactoring Current Implementation

- [ ] **SB018 · Refactor · P0: Refactor page.tsx to use the component library**
    - **Action:**
        1. Replace the monolithic page implementation with the new shadcn/ui-based components
        2. Ensure visual parity with the current implementation
        3. Address any a11y issues discovered during component development
    - **Done-when:**
        1. Page renders using the component library
        2. No visual or functional regressions
        3. A11y improvements are implemented

## Testing & Verification

- [ ] **SB019 · Test · P1: Implement comprehensive component tests**
    - **Action:**
        1. Set up testing framework for components (React Testing Library)
        2. Write tests for all components focusing on behavior and a11y
        3. Test shadcn/ui component integrations
    - **Done-when:**
        1. All components have associated tests
        2. Tests cover interactions and a11y concerns

- [ ] **SB020 · Test · P2: Verify responsive behavior of all components**
    - **Action:**
        1. Test all components across various viewport sizes
        2. Document responsive behavior in stories
        3. Verify that shadcn/ui responsiveness works with Scry's design requirements
    - **Done-when:**
        1. All components behave correctly at all viewport sizes
        2. Responsive behavior is documented in stories
