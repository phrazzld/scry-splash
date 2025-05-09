import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
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
    expect(container).toHaveClass('grid-container');
    expect(container).toHaveClass('w-full');
    expect(container).toHaveClass('relative');
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<Container className={customClass} data-testid="container">Content</Container>);
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass(customClass);
    expect(container).toHaveClass('grid-container'); // Should still have default classes
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
        id="test-id"
      >
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('data-custom', customAttr);
    expect(container).toHaveAttribute('id', 'test-id');
  });

  it('applies maxWidth="none" variant correctly', () => {
    render(
      <Container maxWidth="none" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).not.toHaveClass('max-w-screen-sm');
    expect(container).not.toHaveClass('max-w-screen-md');
    expect(container).not.toHaveClass('max-w-screen-lg');
    expect(container).not.toHaveClass('max-w-screen-xl');
    expect(container).not.toHaveClass('max-w-screen-2xl');
    expect(container).not.toHaveClass('max-w-full');
  });

  it('applies maxWidth="sm" variant correctly', () => {
    render(
      <Container maxWidth="sm" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-sm');
  });

  it('applies maxWidth="md" variant correctly', () => {
    render(
      <Container maxWidth="md" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-md');
  });

  it('applies maxWidth="lg" variant correctly', () => {
    render(
      <Container maxWidth="lg" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-lg');
  });

  it('applies maxWidth="xl" variant correctly', () => {
    render(
      <Container maxWidth="xl" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-xl');
  });

  it('applies maxWidth="2xl" variant correctly', () => {
    render(
      <Container maxWidth="2xl" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-2xl');
  });

  it('applies maxWidth="full" variant correctly', () => {
    render(
      <Container maxWidth="full" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-full');
  });

  it('applies padding="none" variant correctly', () => {
    render(
      <Container padding="none" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('px-0');
  });

  it('applies padding="sm" variant correctly', () => {
    render(
      <Container padding="sm" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('px-4');
  });

  it('applies padding="md" variant correctly', () => {
    render(
      <Container padding="md" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('px-6');
  });

  it('applies padding="lg" variant correctly', () => {
    render(
      <Container padding="lg" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('px-8');
  });

  it('applies padding="xl" variant correctly', () => {
    render(
      <Container padding="xl" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('px-12');
  });

  it('applies padding="responsive" variant correctly', () => {
    render(
      <Container padding="responsive" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('px-responsive');
  });

  it('applies center=true variant correctly', () => {
    render(
      <Container center={true} data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('mx-auto');
  });

  it('does not apply center class when center=false', () => {
    render(
      <Container center={false} data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).not.toHaveClass('mx-auto');
  });

  it('applies gap="none" variant correctly', () => {
    render(
      <Container gap="none" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-0');
  });

  it('applies gap="sm" variant correctly', () => {
    render(
      <Container gap="sm" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-sm');
  });

  it('applies gap="md" variant correctly', () => {
    render(
      <Container gap="md" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-md');
  });

  it('applies gap="lg" variant correctly', () => {
    render(
      <Container gap="lg" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-lg');
  });

  it('applies gap="xl" variant correctly', () => {
    render(
      <Container gap="xl" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-xl');
  });

  it('applies gapX="none" variant correctly', () => {
    render(
      <Container gapX="none" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-x-0');
  });

  it('applies gapX="sm" variant correctly', () => {
    render(
      <Container gapX="sm" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-x-sm');
  });

  it('applies gapY="none" variant correctly', () => {
    render(
      <Container gapY="none" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-y-0');
  });

  it('applies gapY="sm" variant correctly', () => {
    render(
      <Container gapY="sm" data-testid="container">
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('gap-y-sm');
  });

  it('combines multiple variants correctly', () => {
    render(
      <Container 
        maxWidth="lg" 
        padding="sm" 
        center={true} 
        gap="md"
        gapX="lg"
        gapY="sm"
        data-testid="container"
      >
        Content
      </Container>
    );
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('max-w-screen-lg');
    expect(container).toHaveClass('px-4');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('gap-md');
    expect(container).toHaveClass('gap-x-lg');
    expect(container).toHaveClass('gap-y-sm');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Container>
        <p>Accessible content</p>
      </Container>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('GridItem Component', () => {
  it('renders correctly with default props', () => {
    render(<GridItem data-testid="grid-item">Content</GridItem>);
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toBeInTheDocument();
    expect(gridItem).toHaveTextContent('Content');
    expect(gridItem.tagName).toBe('DIV');
    expect(gridItem).toHaveClass('col-span-12'); // Default span
  });

  it('applies custom className', () => {
    const customClass = 'test-class';
    render(<GridItem className={customClass} data-testid="grid-item">Content</GridItem>);
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass(customClass);
    expect(gridItem).toHaveClass('col-span-12'); // Should still have default span
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
        id="test-id"
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveAttribute('data-custom', customAttr);
    expect(gridItem).toHaveAttribute('id', 'test-id');
  });

  it('applies custom span prop correctly', () => {
    render(
      <GridItem 
        span={6}
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-span-6');
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

  it('applies start prop correctly', () => {
    render(
      <GridItem 
        start={2}
        data-testid="grid-item"
      >
        Content
      </GridItem>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveClass('col-start-2');
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

  it('has no accessibility violations', async () => {
    const { container } = render(
      <GridItem>
        <p>Accessible grid item content</p>
      </GridItem>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a complex grid layout without accessibility violations', async () => {
    const { container } = render(
      <Container>
        <GridItem span={6} md={4}>Item 1</GridItem>
        <GridItem span={6} md={4}>Item 2</GridItem>
        <GridItem span={12} md={4}>Item 3</GridItem>
      </Container>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});