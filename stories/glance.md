```
/Users/phaedrus/Development/scry/scry-splash/stories
```

This directory contains the Storybook stories and related components for the Scry Splash application. Its purpose is to provide a development and testing environment for UI components in isolation, using Storybook.

**Architecture:**

The directory utilizes a component-based architecture, with each React component having a corresponding story file. CSS files provide styling for the components. The `.stories.ts` files define different states and variations of the components, allowing developers to visualize and interact with them in Storybook. The `Configure.mdx` file provides documentation and links to external resources related to Storybook configuration.

**Key File Roles:**

*   `Button.tsx`: Defines the `Button` React component, a reusable UI element for user interaction.
*   `Button.stories.ts`: Contains Storybook stories for the `Button` component, showcasing different states (primary, secondary, large, small) and providing a testing ground for its functionality.
*   `Header.tsx`: Defines the `Header` React component, representing the application's header section, including branding and login/logout functionality.
*   `Header.stories.ts`: Contains Storybook stories for the `Header` component, showcasing logged-in and logged-out states.
*   `Page.tsx`: Defines the `Page` React component, a higher-level component that represents a typical page layout in the application.
*   `Page.stories.ts`: Contains Storybook stories for the `Page` component, demonstrating logged-in and logged-out states and including a simple interaction test.
*   `button.css`: Provides CSS styling for the `Button` component.
*   `header.css`: Provides CSS styling for the `Header` component.
*   `page.css`: Provides CSS styling for the `Page` component.
*   `Configure.mdx`: Contains documentation and links to external resources related to configuring Storybook. It utilizes static assets (images and SVGs) from the `assets` subdirectory.

**Dependencies/Gotchas:**

*   **Dependency:** The project relies on Storybook for component development and testing. Changes to Storybook's configuration or dependencies could impact the stories.
*   **Dependency:** React is a core dependency, as the components are built using React.
*   **Dependency:** The `storybook/test` library is used for component testing within the Storybook environment.
*   **Dependency:** The `next/image` component is used within the `Configure.mdx` file.
*   **Gotcha:** The CSS files are scoped using class names. Conflicts with global styles should be avoided.
*   **Gotcha:** The stories rely on consistent component interfaces. Changes to component props could break the stories.
*   **Gotcha:** The `Configure.mdx` file utilizes static assets from the `assets` subdirectory. The correct paths to these assets are crucial for proper rendering of the documentation.
*   **Gotcha:** The `Configure.mdx` file relies on specific CSS class names (`sb-container`, `sb-section`, etc.) for styling. Changes to these class names could affect the layout and appearance of the documentation.
*   **Gotcha:** The `Configure.mdx` file uses inline styles, which can be harder to maintain and override compared to CSS classes.

Directory: `/Users/phaedrus/Development/scry/scry-splash/stories/assets`

This directory serves as a repository for static asset files, specifically SVG (Scalable Vector Graphics) images, used within the Scry Splash stories. The primary purpose of these assets is to visually enhance the user interface and provide recognizable icons for various functionalities or integrations.

**Architecture:**

The directory follows a flat structure, directly containing the SVG files. There are no subdirectories or complex organizational patterns. Each SVG file represents a distinct visual element.

**Key File Roles:**

*   `youtube.svg`: Provides the YouTube icon, likely intended for linking to or representing YouTube-related content/functionality.
*   `accessibility.svg`: Offers an icon representing accessibility features or settings.
*   `discord.svg`: Contains the Discord icon, potentially used for integration with Discord or linking to a Discord community.
*   `github.svg`: Supplies the GitHub icon, likely for representing GitHub repositories or related actions.
*   `tutorials.svg`: Provides an icon representing tutorials or learning resources.
*   `styling.png`: An image representing styling technologies.
*   `context.png`: An image representing the composition of data for a component.
*   `assets.png`: An image representing typography and image assets.
*   `docs.png`: An image representing the autodocs tag being set.
*   `share.png`: An image showing a Storybook being published to a chromatic.com URL.
*   `figma-plugin.png`: An image showing the Storybook plugin in Figma.
*   `testing.png`: An image showing tests passing and failing.
*   `theming.png`: An image showing Storybook in light and dark mode.
*   `addon-library.png`: An image representing integrating tools with Storybook.

**Dependencies/Gotchas:**

*   **Dependency:** The components utilizing these assets depend on these SVG/PNG files being present in this directory and accessible via the correct file path. Any renaming or relocation of these files necessitates corresponding updates in the consuming components.
*   **Gotcha:** The visual appearance of these icons is directly tied to the SVG code itself. Modifications to the SVG code within these files directly impact the rendered appearance. Ensure consistency in styling and adherence to design guidelines when modifying these SVG files.
*   **Gotcha:** These files are likely optimized for a specific size. Using them at significantly different sizes could lead to rendering artifacts (blurriness, pixelation) if the consuming component doesn't handle scaling well.
*   **Gotcha:** Color definitions are embedded within the SVG files. Changing the branding colors would require manually editing the color values within each relevant SVG file.
```