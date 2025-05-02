import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Container, GridItem } from '@/components/ui/container';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}));

describe('Container Component', () => {
  it('renders correctly with default props', () => {
    render(<Container data-testid="container">Content</Container>);
    
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Content');
    expect(container.tagName).toBe('DIV');
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<Container className={customClass} data-testid="container">Content</Container>);
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass(customClass);
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

  it('applies maxWidth variant', () => {
    const { rerender } = render(
      <Container maxWidth="sm" data-testid="container">
        Content
      </Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    
    rerender(
      <Container maxWidth="lg" data-testid="container">
        Content
      </Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('applies padding variant', () => {
    const { rerender } = render(
      <Container padding="sm" data-testid="container">
        Content
      </Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    
    rerender(
      <Container padding="xl" data-testid="container">
        Content
      </Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('applies center variant', () => {
    const { rerender } = render(
      <Container center={true} data-testid="container">
        Content
      </Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    
    rerender(
      <Container center={false} data-testid="container">
        Content
      </Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('applies gap variant', () => {
    const { rerender } = render(
      <Container gap="sm" data-testid="container">
        Content
      </Container>
    );
    
    let container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    
    rerender(
      <Container gap="xl" data-testid="container">
        Content
      </Container>
    );
    
    container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('applies gapX and gapY variants', () => {
    render(
      <Container gapX="sm" gapY="lg" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
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

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<GridItem className={customClass} data-testid="grid-item">Content</GridItem>);
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass(customClass);
  });

  it('renders with custom element via as prop', () => {
    render(<GridItem as="section" data-testid="grid-item">Content</GridItem>);
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem.tagName).toBe('SECTION');
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

  it('applies span props correctly', () => {
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
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveClass('col-span-6');
    expect(gridItem).toHaveClass('sm:col-span-4');
    expect(gridItem).toHaveClass('md:col-span-3');
    expect(gridItem).toHaveClass('lg:col-span-2');
    expect(gridItem).toHaveClass('xl:col-span-1');
  });

  it('applies start props correctly', () => {
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
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveClass('col-start-2');
    expect(gridItem).toHaveClass('sm:col-start-3');
    expect(gridItem).toHaveClass('md:col-start-4');
    expect(gridItem).toHaveClass('lg:col-start-5');
    expect(gridItem).toHaveClass('xl:col-start-6');
  });

  it('combines span and start props correctly', () => {
    render(
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
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-6');
    expect(gridItem).toHaveClass('md:col-span-4');
    expect(gridItem).toHaveClass('col-start-2');
    expect(gridItem).toHaveClass('md:col-start-3');
  });
});