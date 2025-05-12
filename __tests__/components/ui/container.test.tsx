import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Container, GridItem } from '@/components/ui/container';

describe('Container Component', () => {
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

describe('GridItem Component', () => {
  it('renders correctly with default props', () => {
    render(<GridItem data-testid="grid-item">Content</GridItem>);
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveTextContent('Content');
    expect(gridItem.tagName).toBe('DIV');
  });
  
  it('renders complex children correctly', () => {
    render(
      <GridItem data-testid="grid-item">
        <div data-testid="child1">First Child</div>
        <span data-testid="child2">Second Child</span>
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    const child1 = screen.getByTestId('child1');
    const child2 = screen.getByTestId('child2');
    
    expect(gridItem).toContainElement(child1);
    expect(gridItem).toContainElement(child2);
    expect(child1).toHaveTextContent('First Child');
    expect(child2).toHaveTextContent('Second Child');
  });

  it('applies custom className and merges with default classes', () => {
    const customClass = 'test-class';
    render(
      <GridItem 
        className={customClass} 
        span={6} 
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass(customClass);
    // Verify merging with generated classes
    expect(gridItem).toHaveClass('col-span-6');
  });

  it('renders with custom element via as prop', () => {
    // Test with section element
    const { rerender } = render(
      <GridItem as="section" data-testid="grid-item">
        Content
      </GridItem>
    );
    
    let gridItem = screen.getByTestId('grid-item');
    expect(gridItem.tagName).toBe('SECTION');
    
    // Test with article element
    rerender(
      <GridItem as="article" data-testid="grid-item">
        Content
      </GridItem>
    );
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem.tagName).toBe('ARTICLE');
    
    // Test with header element
    rerender(
      <GridItem as="header" data-testid="grid-item">
        Content
      </GridItem>
    );
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem.tagName).toBe('HEADER');
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<GridItem ref={ref} data-testid="grid-item">Content</GridItem>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current?.textContent).toBe('Content');
  });

  it('passes additional props to the element', () => {
    const customAttr = 'custom-attr';
    render(
      <GridItem 
        data-testid="grid-item" 
        data-custom={customAttr}
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveAttribute('data-custom', customAttr);
  });

  it('applies default span value when no span prop is provided', () => {
    render(<GridItem data-testid="grid-item">Content</GridItem>);
    
    const gridItem = screen.getByTestId('grid-item');
    // Default span value is 12
    expect(gridItem).toHaveClass('col-span-12');
  });

  it('applies span prop correctly', () => {
    const { rerender } = render(
      <GridItem span={6} data-testid="grid-item">Content</GridItem>
    );
    
    let gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-6');
    
    // Test different span value
    rerender(<GridItem span={3} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-3');
    expect(gridItem).not.toHaveClass('col-span-6');
  });
  
  it('applies responsive span props correctly', () => {
    render(
      <GridItem 
        span={6} 
        sm={4} 
        md={3} 
        lg={2} 
        xl={1} 
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-6');
    expect(gridItem).toHaveClass('sm:col-span-4');
    expect(gridItem).toHaveClass('md:col-span-3');
    expect(gridItem).toHaveClass('lg:col-span-2');
    expect(gridItem).toHaveClass('xl:col-span-1');
  });
  
  it('applies individual responsive span props correctly', () => {
    // Test with only sm breakpoint
    const { rerender } = render(
      <GridItem sm={4} data-testid="grid-item">Content</GridItem>
    );
    
    let gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-12'); // Default span
    expect(gridItem).toHaveClass('sm:col-span-4');
    
    // Test with only md breakpoint
    rerender(<GridItem md={3} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-12'); // Default span
    expect(gridItem).toHaveClass('md:col-span-3');
    
    // Test with only lg breakpoint
    rerender(<GridItem lg={2} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-12'); // Default span
    expect(gridItem).toHaveClass('lg:col-span-2');
    
    // Test with only xl breakpoint
    rerender(<GridItem xl={1} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-12'); // Default span
    expect(gridItem).toHaveClass('xl:col-span-1');
  });

  it('applies start prop correctly', () => {
    const { rerender } = render(
      <GridItem start={2} data-testid="grid-item">Content</GridItem>
    );
    
    let gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-start-2');
    
    // Test different start value
    rerender(<GridItem start={5} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-start-5');
    expect(gridItem).not.toHaveClass('col-start-2');
    
    // Test no start prop (no col-start class should be present)
    rerender(<GridItem data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).not.toHaveClass('col-start-5');
    expect(gridItem).not.toHaveClass('col-start-2');
  });
  
  it('applies responsive start props correctly', () => {
    render(
      <GridItem 
        start={2} 
        smStart={3} 
        mdStart={4} 
        lgStart={5} 
        xlStart={6} 
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-start-2');
    expect(gridItem).toHaveClass('sm:col-start-3');
    expect(gridItem).toHaveClass('md:col-start-4');
    expect(gridItem).toHaveClass('lg:col-start-5');
    expect(gridItem).toHaveClass('xl:col-start-6');
  });
  
  it('applies individual responsive start props correctly', () => {
    // Test with only smStart breakpoint
    const { rerender } = render(
      <GridItem smStart={3} data-testid="grid-item">Content</GridItem>
    );
    
    let gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('sm:col-start-3');
    expect(gridItem).not.toHaveClass('col-start-'); // No default start
    
    // Test with only mdStart breakpoint
    rerender(<GridItem mdStart={4} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('md:col-start-4');
    
    // Test with only lgStart breakpoint
    rerender(<GridItem lgStart={5} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('lg:col-start-5');
    
    // Test with only xlStart breakpoint
    rerender(<GridItem xlStart={6} data-testid="grid-item">Content</GridItem>);
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('xl:col-start-6');
  });

  it('combines span and start props correctly for various breakpoints', () => {
    // Test combining span and start at base level
    const { rerender } = render(
      <GridItem 
        span={6} 
        start={2} 
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    let gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-6');
    expect(gridItem).toHaveClass('col-start-2');
    
    // Test combining at multiple breakpoints
    rerender(
      <GridItem 
        span={6} 
        md={4} 
        start={2} 
        mdStart={3} 
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-6');
    expect(gridItem).toHaveClass('md:col-span-4');
    expect(gridItem).toHaveClass('col-start-2');
    expect(gridItem).toHaveClass('md:col-start-3');
    
    // Test complex combinations across all breakpoints
    rerender(
      <GridItem 
        span={12} 
        sm={10} 
        md={8} 
        lg={6} 
        xl={4}
        start={1} 
        smStart={2}
        mdStart={3} 
        lgStart={4}
        xlStart={5}
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    gridItem = screen.getByTestId('grid-item');
    // Span classes
    expect(gridItem).toHaveClass('col-span-12');
    expect(gridItem).toHaveClass('sm:col-span-10');
    expect(gridItem).toHaveClass('md:col-span-8');
    expect(gridItem).toHaveClass('lg:col-span-6');
    expect(gridItem).toHaveClass('xl:col-span-4');
    // Start classes
    expect(gridItem).toHaveClass('col-start-1');
    expect(gridItem).toHaveClass('sm:col-start-2');
    expect(gridItem).toHaveClass('md:col-start-3');
    expect(gridItem).toHaveClass('lg:col-start-4');
    expect(gridItem).toHaveClass('xl:col-start-5');
  });
});

describe('Container Accessibility', () => {
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

  describe('maxWidth variants', () => {
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

  describe('padding variants', () => {
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

  describe('center variants', () => {
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

  describe('gap variants', () => {
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

  describe('gapX and gapY variants', () => {
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

  describe('combined prop variants', () => {
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

describe('GridItem Accessibility', () => {
  it('has no accessibility violations in default state', async () => {
    const { container } = render(
      <GridItem data-testid="grid-item">
        <p>Content for testing</p>
      </GridItem>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with different semantic elements', async () => {
    const { container: sectionContainer } = render(
      <GridItem as="section" data-testid="grid-item">
        <h2>Section Heading</h2>
        <p>Content for testing</p>
      </GridItem>
    );
    
    let results = await axe(sectionContainer);
    expect(results).toHaveNoViolations();
    
    const { container: articleContainer } = render(
      <GridItem as="article" data-testid="grid-item">
        <h2>Article Heading</h2>
        <p>Content for testing</p>
      </GridItem>
    );
    
    results = await axe(articleContainer);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with span and start props', async () => {
    const { container: spanContainer } = render(
      <GridItem span={6} start={2} data-testid="grid-item">
        <p>Content for testing</p>
      </GridItem>
    );
    
    let results = await axe(spanContainer);
    expect(results).toHaveNoViolations();
    
    const { container: responsiveContainer } = render(
      <GridItem 
        span={12} 
        sm={10} 
        md={8} 
        lg={6} 
        xl={4}
        start={1} 
        smStart={2}
        mdStart={3} 
        lgStart={4}
        xlStart={5}
        data-testid="grid-item"
      >
        <p>Responsive grid item content</p>
      </GridItem>
    );
    
    results = await axe(responsiveContainer);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations with complex nested content', async () => {
    const { container } = render(
      <GridItem span={6} data-testid="grid-item">
        <h3>Complex Grid Content</h3>
        <p>This is a paragraph with <a href="#test">a link</a> inside it.</p>
        <div>
          <form>
            <label htmlFor="test-input">Test Input</label>
            <input id="test-input" type="text" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </GridItem>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations when rendering a grid layout', async () => {
    const { container } = render(
      <Container data-testid="container">
        <GridItem span={6} data-testid="grid-item-1">
          <h2>Left Content</h2>
          <p>This content should be in the left half of the grid.</p>
        </GridItem>
        <GridItem span={6} data-testid="grid-item-2">
          <h2>Right Content</h2>
          <p>This content should be in the right half of the grid.</p>
        </GridItem>
        <GridItem span={12} data-testid="grid-item-3">
          <h2>Full Width Content</h2>
          <p>This content should span the full width of the grid.</p>
        </GridItem>
      </Container>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Container and GridItem Edge Cases', () => {
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
  
  it('renders GridItem correctly with no children', () => {
    render(<GridItem data-testid="empty-grid-item" />);
    
    const gridItem = screen.getByTestId('empty-grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveClass('col-span-12'); // Default span
    expect(gridItem.childNodes.length).toBe(0);
  });
  
  it('renders GridItem correctly with null children', () => {
    render(<GridItem data-testid="null-grid-item">{null}</GridItem>);
    
    const gridItem = screen.getByTestId('null-grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveClass('col-span-12');
    expect(gridItem.childNodes.length).toBe(0);
  });
  
  it('renders GridItem correctly with undefined children', () => {
    render(<GridItem data-testid="undefined-grid-item">{undefined}</GridItem>);
    
    const gridItem = screen.getByTestId('undefined-grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveClass('col-span-12');
    expect(gridItem.childNodes.length).toBe(0);
  });

  it('has no accessibility violations when rendering empty Container', async () => {
    const { container } = render(
      <Container data-testid="empty-container" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('has no accessibility violations when rendering empty GridItem', async () => {
    const { container } = render(
      <GridItem data-testid="empty-grid-item" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('HTML Attribute Passthrough Tests', () => {
  describe('Container HTML Attribute Passthrough', () => {
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
  
  describe('GridItem HTML Attribute Passthrough', () => {
    it('passes through standard HTML attributes to the underlying element', () => {
      const id = 'test-grid-item-id';
      const role = 'region';
      const tabIndex = 0;
      const title = 'GridItem Title';
      const ariaLabel = 'GridItem Label';
      
      render(
        <GridItem 
          id={id}
          role={role}
          tabIndex={tabIndex}
          title={title}
          aria-label={ariaLabel}
          data-testid="grid-item"
        >
          Content
        </GridItem>
      );
      
      const gridItem = screen.getByTestId('grid-item');
      expect(gridItem).toHaveAttribute('id', id);
      expect(gridItem).toHaveAttribute('role', role);
      expect(gridItem).toHaveAttribute('tabindex', tabIndex.toString());
      expect(gridItem).toHaveAttribute('title', title);
      expect(gridItem).toHaveAttribute('aria-label', ariaLabel);
    });
    
    it('passes through multiple data-* attributes', () => {
      render(
        <GridItem 
          data-testid="grid-item"
          data-custom="custom-value"
          data-analytics-id="analytics-123"
          data-automation="test-automation"
        >
          Content
        </GridItem>
      );
      
      const gridItem = screen.getByTestId('grid-item');
      expect(gridItem).toHaveAttribute('data-custom', 'custom-value');
      expect(gridItem).toHaveAttribute('data-analytics-id', 'analytics-123');
      expect(gridItem).toHaveAttribute('data-automation', 'test-automation');
    });
    
    it('passes through event handler attributes', () => {
      const onClickMock = jest.fn();
      const onMouseOverMock = jest.fn();
      
      render(
        <GridItem 
          data-testid="grid-item"
          onClick={onClickMock}
          onMouseOver={onMouseOverMock}
        >
          Content
        </GridItem>
      );
      
      const gridItem = screen.getByTestId('grid-item');
      gridItem.click();
      expect(onClickMock).toHaveBeenCalledTimes(1);
      
      // Simulate mouseover event
      gridItem.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      expect(onMouseOverMock).toHaveBeenCalledTimes(1);
    });
    
    it('passes through style attribute correctly', () => {
      render(
        <GridItem 
          data-testid="grid-item"
          style={{ color: 'blue', padding: '5px' }}
        >
          Content
        </GridItem>
      );
      
      const gridItem = screen.getByTestId('grid-item');
      expect(gridItem).toHaveStyle({
        color: 'blue',
        padding: '5px'
      });
    });
    
    it('correctly applies both props and HTML attributes', () => {
      render(
        <GridItem 
          span={6}
          start={2}
          sm={4}
          mdStart={3}
          id="grid-item-id"
          aria-label="Grid section"
          data-testid="grid-item"
        >
          Content
        </GridItem>
      );
      
      const gridItem = screen.getByTestId('grid-item');
      
      // Check component props applied correctly
      expect(gridItem).toHaveClass('col-span-6');
      expect(gridItem).toHaveClass('col-start-2');
      expect(gridItem).toHaveClass('sm:col-span-4');
      expect(gridItem).toHaveClass('md:col-start-3');
      
      // Check HTML attributes passed through correctly
      expect(gridItem).toHaveAttribute('id', 'grid-item-id');
      expect(gridItem).toHaveAttribute('aria-label', 'Grid section');
    });
  });
});