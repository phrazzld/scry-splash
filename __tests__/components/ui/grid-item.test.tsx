import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { GridItem } from '@/components/ui/container';

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
      <div className="grid-container">
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
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('GridItem Edge Cases', () => {
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
  
  it('has no accessibility violations when rendering empty GridItem', async () => {
    const { container } = render(
      <GridItem data-testid="empty-grid-item" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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