import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Container } from '@/components/ui/container';

describe('Container Component', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      // Add a specific role for easier querying without data-testid
      render(<Container role="region" aria-label="Default container">Content</Container>);

      const container = screen.getByRole('region', { name: 'Default container' });
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent('Content');
      expect(container.tagName).toBe('DIV');
    });

    it('applies custom className and merges with default classes', () => {
      const customClass = 'test-class';
      render(<Container className={customClass}>Content</Container>);

      const container = screen.getByText('Content').parentElement;
      expect(container).toHaveClass(customClass);
      // Verify merging with default classes
      expect(container).toHaveClass('grid-container');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('relative');
    });

    it('renders with custom element via as prop', () => {
      render(<Container as="section">Content</Container>);

      const container = screen.getByText('Content').parentElement;
      expect(container?.tagName).toBe('SECTION');
    });

    it('forwards refs correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Container ref={ref}>Content</Container>);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('DIV');
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('Props and Variants', () => {
    describe('maxWidth Variants', () => {
      it('processes maxWidth prop variants correctly', () => {
        // Test each maxWidth variant
        const variants = ['sm', 'md', 'lg', 'xl', '2xl', 'full', 'none'];

        variants.forEach(variant => {
          const { container, getByTestId } = render(
            <Container
              maxWidth={variant as any}
              data-testid={`container-${variant}`}
            >
              Content
            </Container>
          );

          // Verify the component renders
          const containerElement = getByTestId(`container-${variant}`);
          expect(containerElement).toBeInTheDocument();

          // Verify the maxWidth prop is processed (not passed to DOM)
          expect(containerElement).not.toHaveAttribute('maxWidth');

          // Cleanup
          container.remove();
        });
      });

      it('applies different styling for each maxWidth variant', () => {
        // Render all variants at once for comparison
        const { getByTestId } = render(
          <>
            <Container maxWidth="sm" data-testid="container-sm">Content</Container>
            <Container maxWidth="md" data-testid="container-md">Content</Container>
            <Container maxWidth="lg" data-testid="container-lg">Content</Container>
            <Container maxWidth="xl" data-testid="container-xl">Content</Container>
            <Container maxWidth="2xl" data-testid="container-2xl">Content</Container>
            <Container maxWidth="full" data-testid="container-full">Content</Container>
            <Container maxWidth="none" data-testid="container-none">Content</Container>
          </>
        );

        // Get all containers
        const containers = [
          getByTestId('container-sm'),
          getByTestId('container-md'),
          getByTestId('container-lg'),
          getByTestId('container-xl'),
          getByTestId('container-2xl'),
          getByTestId('container-full'),
          getByTestId('container-none'),
        ];

        // Verify they all have the base classes
        containers.forEach(container => {
          expect(container).toHaveClass('grid-container');
          expect(container).toHaveClass('w-full');
          expect(container).toHaveClass('relative');
        });

        // Verify that the className differs between variants
        // This tests that the variant is applied without depending on specific class names
        const classNames = containers.map(container => container.className);
        const uniqueClassNames = new Set(classNames);

        // All variants should have different class combinations
        // except possibly "none" which might match default
        expect(uniqueClassNames.size).toBeGreaterThan(4);
      });
    });

    describe('padding Variants', () => {
      it('processes padding prop variants correctly', () => {
        // Test each padding variant
        const variants = ['none', 'sm', 'md', 'lg', 'xl', 'responsive'];

        variants.forEach(variant => {
          const { container, getByTestId } = render(
            <Container
              padding={variant as any}
              data-testid={`container-${variant}`}
            >
              Content
            </Container>
          );

          // Verify the component renders
          const containerElement = getByTestId(`container-${variant}`);
          expect(containerElement).toBeInTheDocument();

          // Verify the padding prop is processed (not passed to DOM)
          expect(containerElement).not.toHaveAttribute('padding');

          // Cleanup
          container.remove();
        });
      });

      it('applies different styling for each padding variant', () => {
        // Render all variants at once for comparison
        const { getByTestId } = render(
          <>
            <Container padding="none" data-testid="container-none">Content</Container>
            <Container padding="sm" data-testid="container-sm">Content</Container>
            <Container padding="md" data-testid="container-md">Content</Container>
            <Container padding="lg" data-testid="container-lg">Content</Container>
            <Container padding="xl" data-testid="container-xl">Content</Container>
            <Container padding="responsive" data-testid="container-responsive">Content</Container>
          </>
        );

        // Get all containers
        const containers = [
          getByTestId('container-none'),
          getByTestId('container-sm'),
          getByTestId('container-md'),
          getByTestId('container-lg'),
          getByTestId('container-xl'),
          getByTestId('container-responsive'),
        ];

        // Verify they all have the base classes
        containers.forEach(container => {
          expect(container).toHaveClass('grid-container');
          expect(container).toHaveClass('w-full');
          expect(container).toHaveClass('relative');
        });

        // Verify that the className differs between variants
        const classNames = containers.map(container => container.className);
        const uniqueClassNames = new Set(classNames);

        // All padding variants should have different class combinations
        expect(uniqueClassNames.size).toBe(containers.length);
      });
    });

    describe('center Variant', () => {
      it('processes center prop correctly', () => {
        // Test center={true} vs center={false}
        const { rerender, getByTestId } = render(
          <Container center={true} data-testid="container">
            Content
          </Container>
        );

        let container = getByTestId('container');
        // Verify the center prop is processed (not passed to DOM)
        expect(container).not.toHaveAttribute('center');

        // Get the className with center=true
        const centeredClassName = container.className;

        // Test with center=false
        rerender(
          <Container center={false} data-testid="container">
            Content
          </Container>
        );

        container = getByTestId('container');
        // Verify prop is processed
        expect(container).not.toHaveAttribute('center');

        // Get the className with center=false
        const nonCenteredClassName = container.className;

        // Verify the two classNames are different
        expect(centeredClassName).not.toBe(nonCenteredClassName);
      });
    });

    describe('gap Variant', () => {
      it('processes gap prop variants correctly', () => {
        // Test each gap variant
        const variants = ['none', 'sm', 'md', 'lg', 'xl'];

        variants.forEach(variant => {
          const { container, getByTestId } = render(
            <Container
              gap={variant as any}
              data-testid={`container-${variant}`}
            >
              Content
            </Container>
          );

          // Verify the component renders
          const containerElement = getByTestId(`container-${variant}`);
          expect(containerElement).toBeInTheDocument();

          // Verify the gap prop is processed (not passed to DOM)
          expect(containerElement).not.toHaveAttribute('gap');

          // Cleanup
          container.remove();
        });
      });

      it('applies different styling for each gap variant', () => {
        // Render all variants at once for comparison
        const { getByTestId } = render(
          <>
            <Container gap="none" data-testid="container-none">Content</Container>
            <Container gap="sm" data-testid="container-sm">Content</Container>
            <Container gap="md" data-testid="container-md">Content</Container>
            <Container gap="lg" data-testid="container-lg">Content</Container>
            <Container gap="xl" data-testid="container-xl">Content</Container>
          </>
        );

        // Get all containers
        const containers = [
          getByTestId('container-none'),
          getByTestId('container-sm'),
          getByTestId('container-md'),
          getByTestId('container-lg'),
          getByTestId('container-xl'),
        ];

        // Verify they all have the base classes
        containers.forEach(container => {
          expect(container).toHaveClass('grid-container');
          expect(container).toHaveClass('w-full');
          expect(container).toHaveClass('relative');
        });

        // Verify that the className differs between variants
        const classNames = containers.map(container => container.className);
        const uniqueClassNames = new Set(classNames);

        // All gap variants should have different class combinations
        expect(uniqueClassNames.size).toBe(containers.length);
      });
    });

    describe('gapX and gapY Variants', () => {
      it('processes gapX and gapY props correctly', () => {
        // Test with both gapX and gapY props
        const { getByTestId } = render(
          <Container
            gapX="sm"
            gapY="lg"
            data-testid="container"
          >
            Content
          </Container>
        );

        const container = getByTestId('container');

        // Verify the props are processed (not passed to DOM)
        expect(container).not.toHaveAttribute('gapX');
        expect(container).not.toHaveAttribute('gapY');
      });

      it('applies different styling for different gapX and gapY combinations', () => {
        // Render different combinations
        const { getByTestId } = render(
          <>
            <Container gapX="sm" gapY="lg" data-testid="container-1">Content</Container>
            <Container gapX="xl" gapY="none" data-testid="container-2">Content</Container>
            <Container gapX="md" data-testid="container-3">Content</Container>
            <Container gapY="md" data-testid="container-4">Content</Container>
          </>
        );

        // Get all containers
        const containers = [
          getByTestId('container-1'),
          getByTestId('container-2'),
          getByTestId('container-3'),
          getByTestId('container-4'),
        ];

        // Verify that the className differs between variants
        const classNames = containers.map(container => container.className);
        const uniqueClassNames = new Set(classNames);

        // All combinations should have different class combinations
        expect(uniqueClassNames.size).toBe(containers.length);
      });
    });
  });

  describe('HTML Attribute Passthrough', () => {
    it('passes additional props to the element', () => {
      const customAttr = 'custom-attr';
      render(
        <Container data-custom={customAttr}>
          Content
        </Container>
      );

      const container = screen.getByText('Content').parentElement;
      expect(container).toHaveAttribute('data-custom', customAttr);
    });

    it('passes through standard HTML attributes to the underlying element', () => {
      const id = 'test-container-id';
      const role = 'main';
      const tabIndex = 0;
      const title = 'Container Title';
      const ariaLabel = 'Container Label';

      render(
        <Container
          id={id}
          role={role}
          tabIndex={tabIndex}
          title={title}
          aria-label={ariaLabel}
        >
          Content
        </Container>
      );

      // Use getByRole since we explicitly set role="main"
      const container = screen.getByRole('main');
      expect(container).toHaveAttribute('id', id);
      expect(container).toHaveAttribute('tabindex', tabIndex.toString());
      expect(container).toHaveAttribute('title', title);
      expect(container).toHaveAttribute('aria-label', ariaLabel);
    });

    it('passes through multiple data-* attributes', () => {
      render(
        <Container
          data-custom="custom-value"
          data-analytics-id="analytics-123"
          data-automation="test-automation"
        >
          Content
        </Container>
      );

      const container = screen.getByText('Content').parentElement;
      expect(container).toHaveAttribute('data-custom', 'custom-value');
      expect(container).toHaveAttribute('data-analytics-id', 'analytics-123');
      expect(container).toHaveAttribute('data-automation', 'test-automation');
    });

    it('passes through event handler attributes', () => {
      const onClickMock = jest.fn();
      const onKeyDownMock = jest.fn();

      render(
        <Container
          onClick={onClickMock}
          onKeyDown={onKeyDownMock}
        >
          Click Me
        </Container>
      );

      const container = screen.getByText('Click Me').parentElement;
      container?.click();
      expect(onClickMock).toHaveBeenCalledTimes(1);

      // Simulate keydown event
      container?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(onKeyDownMock).toHaveBeenCalledTimes(1);
    });

    it('passes through style attribute correctly', () => {
      render(
        <Container
          style={{ color: 'red', marginTop: '10px' }}
        >
          Styled Content
        </Container>
      );

      const container = screen.getByText('Styled Content').parentElement;
      expect(container).toHaveStyle({
        color: 'red',
        marginTop: '10px'
      });
    });
  });

  describe('Edge Cases', () => {
    it('renders Container correctly with no children', () => {
      render(<Container role="region" aria-label="Empty container" />);

      const container = screen.getByRole('region', { name: 'Empty container' });
      expect(container).toBeInTheDocument();
      // Test for base container functionality without requiring specific class names
      expect(container.tagName).toBe('DIV');  // Default element type
      expect(container.childNodes.length).toBe(0);

      // We only check for 'grid-container' which is considered part of the public API
      expect(container).toHaveClass('grid-container');
    });

    it('renders Container correctly with null children', () => {
      render(<Container role="region" aria-label="Null children container">{null}</Container>);

      const container = screen.getByRole('region', { name: 'Null children container' });
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
      expect(container.childNodes.length).toBe(0);
    });

    it('renders Container correctly with undefined children', () => {
      render(<Container role="region" aria-label="Undefined children container">{undefined}</Container>);

      const container = screen.getByRole('region', { name: 'Undefined children container' });
      expect(container).toBeInTheDocument();
      expect(container.tagName).toBe('DIV');
      expect(container.childNodes.length).toBe(0);
    });

    it('applies default props when no explicit variants are provided', () => {
      // Render a basic container with no variant props
      render(<Container>Default Content</Container>);

      const container = screen.getByText('Default Content').parentElement;

      // Verify it renders with default props applied
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent('Default Content');

      // The exact classes may change, but 'grid-container' is part of the public API
      expect(container).toHaveClass('grid-container');
    });
  });
});

describe('Accessibility', () => {
  describe('Basic Accessibility', () => {
    it('has no accessibility violations in default state', async () => {
      const { container } = render(
        <Container data-testid="container">
          <p>Content for testing</p>
        </Container>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with different semantic elements', async () => {
      const { container: sectionContainer } = render(
        <Container as="section" data-testid="container">
          <h2>Section Heading</h2>
          <p>Content for testing</p>
        </Container>
      );

      let results = await axe(sectionContainer);
      expect(results).toHaveNoViolations();

      const { container: articleContainer } = render(
        <Container as="article" data-testid="container">
          <h2>Article Heading</h2>
          <p>Content for testing</p>
        </Container>
      );

      results = await axe(articleContainer);
      expect(results).toHaveNoViolations();

      const { container: mainContainer } = render(
        <Container as="main" data-testid="container">
          <h1>Main Content</h1>
          <p>Content for testing</p>
        </Container>
      );

      results = await axe(mainContainer);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations with complex nested content', async () => {
      const { container } = render(
        <Container data-testid="container">
          <h2>Complex Content</h2>
          <p>This is a paragraph with <a href="#test">a link</a> inside it.</p>
          <div>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
              <li>List item 3</li>
            </ul>
          </div>
          <button type="button">Click me</button>
        </Container>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when rendering empty Container', async () => {
      const { container } = render(
        <Container data-testid="empty-container" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Props and Variants Accessibility', () => {
    describe('maxWidth Variants', () => {
      it('has no accessibility violations with maxWidth="sm" variant', async () => {
        const { container } = render(
          <Container maxWidth="sm" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with maxWidth="md" variant', async () => {
        const { container } = render(
          <Container maxWidth="md" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with maxWidth="lg" variant', async () => {
        const { container } = render(
          <Container maxWidth="lg" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with maxWidth="xl" variant', async () => {
        const { container } = render(
          <Container maxWidth="xl" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with maxWidth="2xl" variant', async () => {
        const { container } = render(
          <Container maxWidth="2xl" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with maxWidth="full" variant', async () => {
        const { container } = render(
          <Container maxWidth="full" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with maxWidth="none" variant', async () => {
        const { container } = render(
          <Container maxWidth="none" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('padding Variants', () => {
      it('has no accessibility violations with padding="none" variant', async () => {
        const { container } = render(
          <Container padding="none" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with padding="sm" variant', async () => {
        const { container } = render(
          <Container padding="sm" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with padding="md" variant', async () => {
        const { container } = render(
          <Container padding="md" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with padding="lg" variant', async () => {
        const { container } = render(
          <Container padding="lg" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with padding="xl" variant', async () => {
        const { container } = render(
          <Container padding="xl" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with padding="responsive" variant', async () => {
        const { container } = render(
          <Container padding="responsive" data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('center Variant', () => {
      it('has no accessibility violations with center={true} variant', async () => {
        const { container } = render(
          <Container center={true} data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with center={false} variant', async () => {
        const { container } = render(
          <Container center={false} data-testid="container">
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('gap Variant', () => {
      it('has no accessibility violations with gap="none" variant', async () => {
        const { container } = render(
          <Container gap="none" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with gap="sm" variant', async () => {
        const { container } = render(
          <Container gap="sm" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with gap="md" variant', async () => {
        const { container } = render(
          <Container gap="md" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with gap="lg" variant', async () => {
        const { container } = render(
          <Container gap="lg" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with gap="xl" variant', async () => {
        const { container } = render(
          <Container gap="xl" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('gapX and gapY Variants', () => {
      it('has no accessibility violations with gapX="sm" and gapY="lg" variants', async () => {
        const { container } = render(
          <Container gapX="sm" gapY="lg" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with gapX="xl" and gapY="none" variants', async () => {
        const { container } = render(
          <Container gapX="xl" gapY="none" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with only gapX="md" variant', async () => {
        const { container } = render(
          <Container gapX="md" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with only gapY="md" variant', async () => {
        const { container } = render(
          <Container gapY="md" data-testid="container">
            <p>First paragraph</p>
            <p>Second paragraph</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Combined Props', () => {
      it('has no accessibility violations with combined width, padding, center and gap props', async () => {
        const { container } = render(
          <Container
            maxWidth="xl"
            padding="lg"
            center={true}
            gap="md"
            data-testid="container"
          >
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with all props configured', async () => {
        const { container } = render(
          <Container
            maxWidth="lg"
            padding="sm"
            center={true}
            gap="none"
            gapX="xl"
            gapY="sm"
            as="section"
            data-testid="container"
          >
            <h2>Section Title</h2>
            <p>Content for testing</p>
          </Container>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });
});