import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { GridItem } from '@/components/ui/container';

describe('GridItem Component', () => {
  describe('Basic Rendering', () => {
    it('renders correctly with default props', () => {
      render(<GridItem>Content</GridItem>);

      const gridItem = screen.getByText('Content').parentElement;
      expect(gridItem).toBeInTheDocument();
      expect(gridItem).toHaveTextContent('Content');
      expect(gridItem?.tagName).toBe('DIV');
    });

    it('renders complex children correctly', () => {
      render(
        <GridItem>
          <div>First Child</div>
          <span>Second Child</span>
        </GridItem>
      );

      const firstChild = screen.getByText('First Child');
      const secondChild = screen.getByText('Second Child');
      const gridItem = firstChild.parentElement;

      expect(gridItem).toContainElement(firstChild);
      expect(gridItem).toContainElement(secondChild);
      expect(firstChild).toHaveTextContent('First Child');
      expect(secondChild).toHaveTextContent('Second Child');
    });

    it('applies custom className and merges with default classes', () => {
      const customClass = 'test-class';
      render(
        <GridItem
          className={customClass}
          span={6}
          role="region"
          aria-label="Custom class grid item"
        >
          Custom Class Content
        </GridItem>
      );

      const gridItem = screen.getByRole('region', { name: 'Custom class grid item' });
      expect(gridItem).toHaveClass(customClass);
      // Verify merging with generated classes
      expect(gridItem).toHaveClass('col-span-6');
    });

    it('forwards refs correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<GridItem ref={ref}>Ref Content</GridItem>);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe('DIV');
      expect(ref.current?.textContent).toBe('Ref Content');
    });
  });

  describe('Props and Variants', () => {
    describe('Custom Element', () => {
      it('renders with custom element via as prop', () => {
        // Test with section element (has implicit role=region)
        const { rerender } = render(
          <GridItem as="section" aria-label="Section content">
            Content
          </GridItem>
        );

        let gridItem = screen.getByRole('region', { name: 'Section content' });
        expect(gridItem.tagName).toBe('SECTION');

        // Test with article element (has implicit role=article)
        rerender(
          <GridItem as="article" aria-label="Article content">
            Content
          </GridItem>
        );

        gridItem = screen.getByRole('article', { name: 'Article content' });
        expect(gridItem.tagName).toBe('ARTICLE');

        // Test with header element (has implicit role=banner)
        rerender(
          <GridItem as="header" aria-label="Header content">
            Content
          </GridItem>
        );

        gridItem = screen.getByRole('banner', { name: 'Header content' });
        expect(gridItem.tagName).toBe('HEADER');
      });
    });

    describe('Span Props', () => {
      it('processes default span value when no span prop is provided', () => {
        render(
          <GridItem role="region" aria-label="Default span grid item">
            Default span content
          </GridItem>
        );

        const gridItem = screen.getByRole('region', { name: 'Default span grid item' });
        expect(gridItem).toBeInTheDocument();

        // Verify the component renders correctly
        expect(gridItem).toHaveTextContent('Default span content');
        expect(gridItem.tagName).toBe('DIV');

        // Verify no span attributes are leaked to the DOM
        expect(gridItem).not.toHaveAttribute('span');
      });

      it('processes span prop correctly', () => {
        const { rerender } = render(
          <GridItem
            span={6}
            role="region"
            aria-label="Span 6 grid item"
          >
            Span 6 content
          </GridItem>
        );

        let gridItem = screen.getByRole('region', { name: 'Span 6 grid item' });
        // Verify the span prop is processed and not passed to DOM
        expect(gridItem).not.toHaveAttribute('span');

        // Test different span value
        rerender(
          <GridItem
            span={3}
            role="region"
            aria-label="Span 6 grid item"
          >
            Span 6 content
          </GridItem>
        );

        gridItem = screen.getByRole('region', { name: 'Span 6 grid item' });
        // Verify the span prop is still processed and not passed to DOM
        expect(gridItem).not.toHaveAttribute('span');

        // Get classNames to verify they are different
        const firstClassName = gridItem.className;

        // Test with no span prop
        rerender(
          <GridItem
            role="region"
            aria-label="Span 6 grid item"
          >
            Span 6 content
          </GridItem>
        );

        gridItem = screen.getByRole('region', { name: 'Span 6 grid item' });
        // Verify the className is different when span is not provided (should use default)
        expect(gridItem.className).not.toBe(firstClassName);
      });

      it('applies different styling for different span values', () => {
        // Render multiple GridItems with different span values
        const { getByRole } = render(
          <>
            <GridItem span={1} role="region" aria-label="span 1">Span 1 content</GridItem>
            <GridItem span={4} role="region" aria-label="span 4">Span 4 content</GridItem>
            <GridItem span={6} role="region" aria-label="span 6">Span 6 content</GridItem>
            <GridItem span={12} role="region" aria-label="span 12">Span 12 content</GridItem>
          </>
        );

        // Get all grid items
        const spans = [
          getByRole('region', { name: 'span 1' }),
          getByRole('region', { name: 'span 4' }),
          getByRole('region', { name: 'span 6' }),
          getByRole('region', { name: 'span 12' }),
        ];

        // Verify all have different class combinations
        const classNames = spans.map(item => item.className);
        const uniqueClassNames = new Set(classNames);

        // Each span value should result in a different className
        expect(uniqueClassNames.size).toBe(spans.length);
      });
    });

    describe('Responsive Span Props', () => {
      it('processes responsive span props correctly', () => {
        render(
          <GridItem
            span={6}
            sm={4}
            md={3}
            lg={2}
            xl={1}
            role="region"
            aria-label="Responsive grid item"
          >
            Responsive content
          </GridItem>
        );

        const gridItem = screen.getByRole('region', { name: 'Responsive grid item' });

        // Verify all props are processed (not passed to DOM)
        expect(gridItem).not.toHaveAttribute('span');
        expect(gridItem).not.toHaveAttribute('sm');
        expect(gridItem).not.toHaveAttribute('md');
        expect(gridItem).not.toHaveAttribute('lg');
        expect(gridItem).not.toHaveAttribute('xl');
      });

      it('processes individual responsive span props correctly', () => {
        // Test with each breakpoint individually
        const breakpoints = ['sm', 'md', 'lg', 'xl'];

        breakpoints.forEach(breakpoint => {
          const props = {
            [breakpoint]: 4,
            role: 'region',
            'aria-label': `${breakpoint} breakpoint item`
          };

          const { getByRole } = render(
            <GridItem {...props}>Content for {breakpoint}</GridItem>
          );

          const gridItem = getByRole('region', { name: `${breakpoint} breakpoint item` });
          expect(gridItem).toBeInTheDocument();
          expect(gridItem).not.toHaveAttribute(breakpoint);
        });
      });

      it('applies different styling for different responsive span combinations', () => {
        // Render multiple GridItems with different responsive spans
        const { getByRole } = render(
          <>
            <GridItem span={12} sm={6} role="region" aria-label="combo 1">Combo 1 content</GridItem>
            <GridItem span={12} md={6} role="region" aria-label="combo 2">Combo 2 content</GridItem>
            <GridItem span={12} lg={6} role="region" aria-label="combo 3">Combo 3 content</GridItem>
            <GridItem span={12} xl={6} role="region" aria-label="combo 4">Combo 4 content</GridItem>
            <GridItem sm={6} md={4} lg={3} xl={2} role="region" aria-label="combo 5">Combo 5 content</GridItem>
          </>
        );

        // Get all grid items
        const combos = [
          getByRole('region', { name: 'combo 1' }),
          getByRole('region', { name: 'combo 2' }),
          getByRole('region', { name: 'combo 3' }),
          getByRole('region', { name: 'combo 4' }),
          getByRole('region', { name: 'combo 5' }),
        ];

        // Verify all have different class combinations
        const classNames = combos.map(item => item.className);
        const uniqueClassNames = new Set(classNames);

        // Each responsive combination should result in a different className
        expect(uniqueClassNames.size).toBe(combos.length);
      });
    });

    describe('Start Props', () => {
      it('processes start prop correctly', () => {
        const { rerender } = render(
          <GridItem
            start={2}
            role="region"
            aria-label="Start position item"
          >
            Start position content
          </GridItem>
        );

        let gridItem = screen.getByRole('region', { name: 'Start position item' });
        // Verify the start prop is processed and not passed to DOM
        expect(gridItem).not.toHaveAttribute('start');

        // Store the className
        const firstClassName = gridItem.className;

        // Test different start value
        rerender(
          <GridItem
            start={5}
            role="region"
            aria-label="Start position item"
          >
            Start position content
          </GridItem>
        );

        gridItem = screen.getByRole('region', { name: 'Start position item' });
        // Verify the start prop is still processed and not passed to DOM
        expect(gridItem).not.toHaveAttribute('start');

        // Verify className changed with different start value
        expect(gridItem.className).not.toBe(firstClassName);
      });

      it('applies different styling for different start values', () => {
        // Render multiple GridItems with different start values
        const { getByRole } = render(
          <>
            <GridItem start={1} role="region" aria-label="start 1">Start 1 content</GridItem>
            <GridItem start={3} role="region" aria-label="start 3">Start 3 content</GridItem>
            <GridItem start={5} role="region" aria-label="start 5">Start 5 content</GridItem>
            <GridItem start={9} role="region" aria-label="start 9">Start 9 content</GridItem>
          </>
        );

        // Get all grid items
        const starts = [
          getByRole('region', { name: 'start 1' }),
          getByRole('region', { name: 'start 3' }),
          getByRole('region', { name: 'start 5' }),
          getByRole('region', { name: 'start 9' }),
        ];

        // Verify all have different class combinations
        const classNames = starts.map(item => item.className);
        const uniqueClassNames = new Set(classNames);

        // Each start value should result in a different className
        expect(uniqueClassNames.size).toBe(starts.length);
      });
    });

    describe('Responsive Start Props', () => {
      it('processes responsive start props correctly', () => {
        render(
          <GridItem
            start={2}
            smStart={3}
            mdStart={4}
            lgStart={5}
            xlStart={6}
            role="region"
            aria-label="Responsive start item"
          >
            Responsive start content
          </GridItem>
        );

        const gridItem = screen.getByRole('region', { name: 'Responsive start item' });

        // Verify all props are processed (not passed to DOM)
        expect(gridItem).not.toHaveAttribute('start');
        expect(gridItem).not.toHaveAttribute('smStart');
        expect(gridItem).not.toHaveAttribute('mdStart');
        expect(gridItem).not.toHaveAttribute('lgStart');
        expect(gridItem).not.toHaveAttribute('xlStart');
      });

      it('processes individual responsive start props correctly', () => {
        // Test with each breakpoint individually
        const breakpoints = ['smStart', 'mdStart', 'lgStart', 'xlStart'];

        breakpoints.forEach(breakpoint => {
          const props = {
            [breakpoint]: 3,
            role: 'region',
            'aria-label': `${breakpoint} responsive item`
          };

          render(
            <GridItem {...props}>Content for {breakpoint}</GridItem>
          );

          const gridItem = screen.getByRole('region', { name: `${breakpoint} responsive item` });
          expect(gridItem).toBeInTheDocument();
          expect(gridItem).not.toHaveAttribute(breakpoint);
        });
      });
    });

    describe('Combined Props', () => {
      it('processes combined span and start props correctly', () => {
        // Test with complex combination of props
        render(
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
            role="region"
            aria-label="Complex combo item"
          >
            Complex combination content
          </GridItem>
        );

        const gridItem = screen.getByRole('region', { name: 'Complex combo item' });

        // Verify all props are processed (not passed to DOM)
        expect(gridItem).not.toHaveAttribute('span');
        expect(gridItem).not.toHaveAttribute('sm');
        expect(gridItem).not.toHaveAttribute('md');
        expect(gridItem).not.toHaveAttribute('lg');
        expect(gridItem).not.toHaveAttribute('xl');
        expect(gridItem).not.toHaveAttribute('start');
        expect(gridItem).not.toHaveAttribute('smStart');
        expect(gridItem).not.toHaveAttribute('mdStart');
        expect(gridItem).not.toHaveAttribute('lgStart');
        expect(gridItem).not.toHaveAttribute('xlStart');
      });

      it('applies different styling for different prop combinations', () => {
        // Render multiple GridItems with different combinations
        const { getByRole } = render(
          <>
            <GridItem span={6} start={2} role="region" aria-label="combo 1">Combo 1 content</GridItem>
            <GridItem span={6} md={4} start={2} mdStart={3} role="region" aria-label="combo 2">Combo 2 content</GridItem>
            <GridItem span={12} sm={6} md={4} lg={3} xl={2} role="region" aria-label="combo 3">Combo 3 content</GridItem>
            <GridItem start={2} smStart={3} mdStart={4} lgStart={5} xlStart={6} role="region" aria-label="combo 4">Combo 4 content</GridItem>
          </>
        );

        // Get all grid items
        const combos = [
          getByRole('region', { name: 'combo 1' }),
          getByRole('region', { name: 'combo 2' }),
          getByRole('region', { name: 'combo 3' }),
          getByRole('region', { name: 'combo 4' }),
        ];

        // Verify all have different class combinations
        const classNames = combos.map(item => item.className);
        const uniqueClassNames = new Set(classNames);

        // Each combination should result in a different className
        expect(uniqueClassNames.size).toBe(combos.length);
      });
    });
  });

  describe('Accessibility', () => {
    describe('Basic Accessibility', () => {
      it('has no accessibility violations in default state', async () => {
        const { container } = render(
          <GridItem data-testid="grid-item">
            <p>Content for testing</p>
          </GridItem>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Semantic Element Variants', () => {
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

      it('has no accessibility violations with header element', async () => {
        const { container } = render(
          <GridItem as="header" data-testid="grid-item">
            <h1>Site Title</h1>
            <nav>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </nav>
          </GridItem>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Grid Properties Variants', () => {
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
    });

    describe('Responsive Grid Variants', () => {
      it('has no accessibility violations with individual responsive span props', async () => {
        const { container: smContainer } = render(
          <GridItem sm={4} data-testid="grid-item">
            <p>Small breakpoint content</p>
          </GridItem>
        );

        let results = await axe(smContainer);
        expect(results).toHaveNoViolations();

        const { container: mdContainer } = render(
          <GridItem md={6} data-testid="grid-item">
            <p>Medium breakpoint content</p>
          </GridItem>
        );

        results = await axe(mdContainer);
        expect(results).toHaveNoViolations();

        const { container: lgContainer } = render(
          <GridItem lg={8} data-testid="grid-item">
            <p>Large breakpoint content</p>
          </GridItem>
        );

        results = await axe(lgContainer);
        expect(results).toHaveNoViolations();

        const { container: xlContainer } = render(
          <GridItem xl={10} data-testid="grid-item">
            <p>Extra large breakpoint content</p>
          </GridItem>
        );

        results = await axe(xlContainer);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with individual responsive start props', async () => {
        const { container: smStartContainer } = render(
          <GridItem smStart={2} data-testid="grid-item">
            <p>Small breakpoint start content</p>
          </GridItem>
        );

        let results = await axe(smStartContainer);
        expect(results).toHaveNoViolations();

        const { container: mdStartContainer } = render(
          <GridItem mdStart={3} data-testid="grid-item">
            <p>Medium breakpoint start content</p>
          </GridItem>
        );

        results = await axe(mdStartContainer);
        expect(results).toHaveNoViolations();

        const { container: lgStartContainer } = render(
          <GridItem lgStart={4} data-testid="grid-item">
            <p>Large breakpoint start content</p>
          </GridItem>
        );

        results = await axe(lgStartContainer);
        expect(results).toHaveNoViolations();

        const { container: xlStartContainer } = render(
          <GridItem xlStart={5} data-testid="grid-item">
            <p>Extra large breakpoint start content</p>
          </GridItem>
        );

        results = await axe(xlStartContainer);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with partial responsive prop combinations', async () => {
        const { container: partialComboContainer } = render(
          <GridItem
            span={12}
            md={6}
            xl={4}
            start={1}
            lgStart={3}
            data-testid="grid-item"
          >
            <p>Partial responsive combination content</p>
          </GridItem>
        );

        const results = await axe(partialComboContainer);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Complex Content Accessibility', () => {
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

    describe('HTML Attribute Accessibility', () => {
      it('has no accessibility violations with aria attributes', async () => {
        const { container } = render(
          <GridItem
            span={6}
            aria-label="Important content section"
            aria-describedby="description-id"
            data-testid="grid-item"
          >
            <p id="description-id">This content describes the section.</p>
            <p>Additional content.</p>
          </GridItem>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with role attribute', async () => {
        const { container } = render(
          <GridItem
            span={6}
            role="region"
            aria-label="Special region"
            data-testid="grid-item"
          >
            <p>Content within a region.</p>
          </GridItem>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });

      it('has no accessibility violations with tabIndex attribute', async () => {
        const { container } = render(
          <GridItem
            span={6}
            tabIndex={0}
            aria-label="Focusable grid item"
            data-testid="grid-item"
          >
            <p>This grid item can receive focus.</p>
          </GridItem>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('Edge Case Accessibility', () => {
      it('has no accessibility violations with additional HTML attributes', async () => {
        const { container } = render(
          <GridItem
            span={6}
            id="custom-id"
            title="Custom title"
            lang="en-US"
            dir="ltr"
            data-testid="grid-item"
          >
            <p>Content with additional HTML attributes.</p>
          </GridItem>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('Edge Cases', () => {
    it('renders GridItem correctly with no children', () => {
      render(<GridItem data-testid="empty-grid-item" />);

      const gridItem = screen.getByTestId('empty-grid-item');
      expect(gridItem).toBeInTheDocument();
      expect(gridItem.tagName).toBe('DIV');  // Default element type
      expect(gridItem.childNodes.length).toBe(0);
    });

    it('renders GridItem correctly with null children', () => {
      render(<GridItem data-testid="null-grid-item">{null}</GridItem>);

      const gridItem = screen.getByTestId('null-grid-item');
      expect(gridItem).toBeInTheDocument();
      expect(gridItem.tagName).toBe('DIV');
      expect(gridItem.childNodes.length).toBe(0);
    });

    it('renders GridItem correctly with undefined children', () => {
      render(<GridItem data-testid="undefined-grid-item">{undefined}</GridItem>);

      const gridItem = screen.getByTestId('undefined-grid-item');
      expect(gridItem).toBeInTheDocument();
      expect(gridItem.tagName).toBe('DIV');
      expect(gridItem.childNodes.length).toBe(0);
    });

    it('applies default props when no explicit props are provided', () => {
      // Render a basic GridItem with no props
      render(<GridItem data-testid="default-grid-item">Content</GridItem>);

      const gridItem = screen.getByTestId('default-grid-item');

      // Verify it renders with default props applied
      expect(gridItem).toBeInTheDocument();
      expect(gridItem).toHaveTextContent('Content');
      expect(gridItem.tagName).toBe('DIV');
    });

    it('has no accessibility violations when rendering empty GridItem', async () => {
      const { container } = render(
        <GridItem data-testid="empty-grid-item" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('HTML Attribute Passthrough', () => {
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
        >
          Content
        </GridItem>
      );

      const gridItem = screen.getByRole('region', { name: 'GridItem Label' });
      expect(gridItem).toHaveAttribute('id', id);
      expect(gridItem).toHaveAttribute('tabindex', tabIndex.toString());
      expect(gridItem).toHaveAttribute('title', title);
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

      // Verify component props are processed (not passed to DOM)
      expect(gridItem).not.toHaveAttribute('span');
      expect(gridItem).not.toHaveAttribute('start');
      expect(gridItem).not.toHaveAttribute('sm');
      expect(gridItem).not.toHaveAttribute('mdStart');

      // Verify HTML attributes are passed through correctly
      expect(gridItem).toHaveAttribute('id', 'grid-item-id');
      expect(gridItem).toHaveAttribute('aria-label', 'Grid section');

      // Store the className to verify it's different from default
      const className = gridItem.className;

      // Render GridItem with default props for comparison
      const { getByTestId } = render(
        <GridItem data-testid="default-grid-item">Content</GridItem>
      );

      const defaultGridItem = getByTestId('default-grid-item');

      // Verify the className is different when GridItem has props
      expect(className).not.toBe(defaultGridItem.className);
    });
  });
});
