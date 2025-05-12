import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Container } from '@/components/ui/container';

describe('Container Component', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      render(<Container data-testid="container">Content</Container>);
      
      const container = screen.getByTestId('container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveTextContent('Content');
      expect(container.tagName).toBe('DIV');
    });

    it('applies custom className and merges with default classes', () => {
      const customClass = 'test-class';
      render(<Container className={customClass} data-testid="container">Content</Container>);
      
      const container = screen.getByTestId('container');
      expect(container).toHaveClass(customClass);
      // Verify merging with default classes
      expect(container).toHaveClass('grid-container');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('relative');
    });

    it('renders with custom element via as prop', () => {
      render(<Container as="section" data-testid="container">Content</Container>);
      
      const container = screen.getByTestId('container');
      expect(container.tagName).toBe('SECTION');
    });

    it('forwards refs correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Container ref={ref} data-testid="container">Content</Container>);
      
      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('DIV');
      expect(ref.current?.textContent).toBe('Content');
    });
  });

  describe('Props and Variants', () => {
    describe('maxWidth Variants', () => {
      it('applies maxWidth variant with correct classes', () => {
        // Test 'sm' variant
        const { rerender } = render(
          <Container maxWidth="sm" data-testid="container">
            Content
          </Container>
        );
        
        let container = screen.getByTestId('container');
        expect(container).toHaveClass('max-w-screen-sm');
        
        // Test 'md' variant
        rerender(
          <Container maxWidth="md" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('max-w-screen-md');
        
        // Test 'lg' variant
        rerender(
          <Container maxWidth="lg" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('max-w-screen-lg');
        
        // Test 'xl' variant
        rerender(
          <Container maxWidth="xl" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('max-w-screen-xl');
        
        // Test '2xl' variant
        rerender(
          <Container maxWidth="2xl" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('max-w-screen-2xl');
        
        // Test 'full' variant
        rerender(
          <Container maxWidth="full" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('max-w-full');
        
        // Test 'none' variant
        rerender(
          <Container maxWidth="none" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        // 'none' variant doesn't add a class
        expect(container).not.toHaveClass('max-w-screen-sm');
        expect(container).not.toHaveClass('max-w-screen-md');
        expect(container).not.toHaveClass('max-w-screen-lg');
        expect(container).not.toHaveClass('max-w-screen-xl');
        expect(container).not.toHaveClass('max-w-screen-2xl');
        expect(container).not.toHaveClass('max-w-full');
      });
    });

    describe('padding Variants', () => {
      it('applies padding variant with correct classes', () => {
        // Test 'none' variant
        const { rerender } = render(
          <Container padding="none" data-testid="container">
            Content
          </Container>
        );
        
        let container = screen.getByTestId('container');
        expect(container).toHaveClass('px-0');
        
        // Test 'sm' variant
        rerender(
          <Container padding="sm" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('px-4');
        
        // Test 'md' variant
        rerender(
          <Container padding="md" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('px-6');
        
        // Test 'lg' variant
        rerender(
          <Container padding="lg" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('px-8');
        
        // Test 'xl' variant
        rerender(
          <Container padding="xl" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('px-12');
        
        // Test 'responsive' variant
        rerender(
          <Container padding="responsive" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('px-responsive');
      });
    });

    describe('center Variant', () => {
      it('applies center variant with correct classes', () => {
        // Test center={true}
        const { rerender } = render(
          <Container center={true} data-testid="container">
            Content
          </Container>
        );
        
        let container = screen.getByTestId('container');
        expect(container).toHaveClass('mx-auto');
        
        // Test center={false}
        rerender(
          <Container center={false} data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).not.toHaveClass('mx-auto');
      });
    });

    describe('gap Variant', () => {
      it('applies gap variant with correct classes', () => {
        // Test 'none' variant
        const { rerender } = render(
          <Container gap="none" data-testid="container">
            Content
          </Container>
        );
        
        let container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-0');
        
        // Test 'sm' variant
        rerender(
          <Container gap="sm" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-sm');
        
        // Test 'md' variant
        rerender(
          <Container gap="md" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-md');
        
        // Test 'lg' variant
        rerender(
          <Container gap="lg" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-lg');
        
        // Test 'xl' variant
        rerender(
          <Container gap="xl" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-xl');
      });
    });

    describe('gapX and gapY Variants', () => {
      it('applies gapX and gapY variants with correct classes', () => {
        // Test various combinations
        const { rerender } = render(
          <Container gapX="sm" gapY="lg" data-testid="container">
            Content
          </Container>
        );
        
        let container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-x-sm');
        expect(container).toHaveClass('gap-y-lg');
        
        // Test different combination
        rerender(
          <Container gapX="xl" gapY="none" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-x-xl');
        expect(container).toHaveClass('gap-y-0');
        
        // Test with only gapX
        rerender(
          <Container gapX="md" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-x-md');
        
        // Test with only gapY
        rerender(
          <Container gapY="md" data-testid="container">
            Content
          </Container>
        );
        
        container = screen.getByTestId('container');
        expect(container).toHaveClass('gap-y-md');
      });
    });
  });

  describe('HTML Attribute Passthrough', () => {
    it('passes additional props to the element', () => {
      const customAttr = 'custom-attr';
      render(
        <Container 
          data-testid="container" 
          data-custom={customAttr}
        >
          Content
        </Container>
      );
      
      const container = screen.getByTestId('container');
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
          data-testid="container"
        >
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveAttribute('id', id);
      expect(container).toHaveAttribute('role', role);
      expect(container).toHaveAttribute('tabindex', tabIndex.toString());
      expect(container).toHaveAttribute('title', title);
      expect(container).toHaveAttribute('aria-label', ariaLabel);
    });

    it('passes through multiple data-* attributes', () => {
      render(
        <Container
          data-testid="container"
          data-custom="custom-value"
          data-analytics-id="analytics-123"
          data-automation="test-automation"
        >
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveAttribute('data-custom', 'custom-value');
      expect(container).toHaveAttribute('data-analytics-id', 'analytics-123');
      expect(container).toHaveAttribute('data-automation', 'test-automation');
    });

    it('passes through event handler attributes', () => {
      const onClickMock = jest.fn();
      const onKeyDownMock = jest.fn();

      render(
        <Container
          data-testid="container"
          onClick={onClickMock}
          onKeyDown={onKeyDownMock}
        >
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      container.click();
      expect(onClickMock).toHaveBeenCalledTimes(1);

      // Simulate keydown event
      container.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(onKeyDownMock).toHaveBeenCalledTimes(1);
    });

    it('passes through style attribute correctly', () => {
      render(
        <Container
          data-testid="container"
          style={{ color: 'red', marginTop: '10px' }}
        >
          Content
        </Container>
      );

      const container = screen.getByTestId('container');
      expect(container).toHaveStyle({
        color: 'red',
        marginTop: '10px'
      });
    });
  });

  describe('Edge Cases', () => {
    it('renders Container correctly with no children', () => {
      render(<Container data-testid="empty-container" />);

      const container = screen.getByTestId('empty-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('grid-container');
      expect(container).toHaveClass('w-full');
      expect(container).toHaveClass('relative');
      expect(container.childNodes.length).toBe(0);
    });

    it('renders Container correctly with null children', () => {
      render(<Container data-testid="null-container">{null}</Container>);

      const container = screen.getByTestId('null-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('grid-container');
      expect(container.childNodes.length).toBe(0);
    });

    it('renders Container correctly with undefined children', () => {
      render(<Container data-testid="undefined-container">{undefined}</Container>);

      const container = screen.getByTestId('undefined-container');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('grid-container');
      expect(container.childNodes.length).toBe(0);
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