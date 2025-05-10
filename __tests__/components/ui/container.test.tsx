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

  it('has no accessibility violations with various props combinations', async () => {
    // Test with maxWidth variant
    const { container: maxWidthContainer } = render(
      <Container maxWidth="xl" padding="lg" center={true} gap="md" data-testid="container">
        <p>Content for testing</p>
      </Container>
    );
    
    let results = await axe(maxWidthContainer);
    expect(results).toHaveNoViolations();
    
    // Test with gapX and gapY variants
    const { container: gapContainer } = render(
      <Container gapX="lg" gapY="sm" data-testid="container">
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </Container>
    );
    
    results = await axe(gapContainer);
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