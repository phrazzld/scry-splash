import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SplashPage } from '@/components/organisms/splash-page';

// Mock component interfaces
interface PageLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
  centered?: boolean;
  animate?: boolean;
  className?: string;
  [key: string]: unknown;
}

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  centered?: boolean;
}

interface BenefitTrioProps {
  benefits?: string[];
  layout?: string;
  centered?: boolean;
}

interface CTASectionProps {
  buttonText?: string;
  microcopy?: string;
  centered?: boolean;
  onButtonClick?: () => void;
}

// Mock the dependencies
jest.mock('@/components/organisms/page-layout', () => ({
  PageLayout: ({ children, backgroundColor, centered, animate, className, ...props }: PageLayoutProps) => (
    <div 
      data-testid="mock-page-layout" 
      data-background-color={backgroundColor}
      data-centered={centered}
      data-animate={animate}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('@/components/molecules/hero-section', () => ({
  HeroSection: ({ headline, subheadline, centered }: HeroSectionProps) => (
    <div 
      data-testid="mock-hero-section"
      data-headline={headline}
      data-subheadline={subheadline}
      data-centered={centered}
    >
      Hero Section
    </div>
  ),
}));

jest.mock('@/components/molecules/benefit-trio', () => ({
  BenefitTrio: ({ benefits, layout, centered }: BenefitTrioProps) => (
    <div 
      data-testid="mock-benefit-trio"
      data-benefits={benefits ? benefits.join(',') : ''}
      data-layout={layout}
      data-centered={centered}
    >
      Benefit Trio
    </div>
  ),
}));

jest.mock('@/components/molecules/cta-section', () => ({
  CTASection: ({ buttonText, microcopy, centered, onButtonClick }: CTASectionProps) => (
    <div 
      data-testid="mock-cta-section"
      data-button-text={buttonText}
      data-microcopy={microcopy}
      data-centered={centered}
      onClick={onButtonClick}
    >
      CTA Section
    </div>
  ),
}));

describe('SplashPage Component', () => {
  it('renders correctly with default props', () => {
    render(<SplashPage />);
    
    // Check if all sections are rendered
    const pageLayout = screen.getByTestId('mock-page-layout');
    expect(pageLayout).toBeInTheDocument();
    expect(pageLayout).toHaveAttribute('data-background-color', 'var(--background)');
    expect(pageLayout).toHaveAttribute('data-centered', 'false');
    expect(pageLayout).toHaveAttribute('data-animate', 'false');
    
    const heroSection = screen.getByTestId('mock-hero-section');
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveAttribute('data-headline', 'Remember effortlessly.');
    expect(heroSection).toHaveAttribute('data-subheadline', '');
    
    // BenefitTrio is no longer rendered in the splash page
    
    const ctaSection = screen.getByTestId('mock-cta-section');
    expect(ctaSection).toBeInTheDocument();
    expect(ctaSection).toHaveAttribute('data-button-text', 'Get early access');
    expect(ctaSection).toHaveAttribute('data-microcopy', '');
  });

  it('renders with custom headline and subheadline', () => {
    const customHeadline = 'Custom headline';
    const customSubheadline = 'Custom subheadline';
    
    render(<SplashPage headline={customHeadline} subheadline={customSubheadline} />);
    
    const heroSection = screen.getByTestId('mock-hero-section');
    expect(heroSection).toHaveAttribute('data-headline', customHeadline);
    expect(heroSection).toHaveAttribute('data-subheadline', customSubheadline);
  });

  // BenefitTrio is no longer rendered, so we don't need to test it

  it('renders with custom CTA text', () => {
    const customButtonText = 'Sign up now';
    const customMicrocopy = 'Custom microcopy';
    
    render(<SplashPage buttonText={customButtonText} microcopy={customMicrocopy} />);
    
    const ctaSection = screen.getByTestId('mock-cta-section');
    expect(ctaSection).toHaveAttribute('data-button-text', customButtonText);
    expect(ctaSection).toHaveAttribute('data-microcopy', customMicrocopy);
  });

  it('handles centered prop correctly', () => {
    render(<SplashPage centered={false} />);
    
    const pageLayout = screen.getByTestId('mock-page-layout');
    expect(pageLayout).toHaveAttribute('data-centered', 'false');
    
    const heroSection = screen.getByTestId('mock-hero-section');
    expect(heroSection).toHaveAttribute('data-centered', 'false');
    
    const ctaSection = screen.getByTestId('mock-cta-section');
    expect(ctaSection).toHaveAttribute('data-centered', 'false');
  });

  it('disables animation when animate is false', () => {
    render(<SplashPage animate={false} />);
    
    // Check that none of the sections have the animation class
    const heroSection = screen.getByTestId('mock-hero-section').parentElement;
    const ctaSection = screen.getByTestId('mock-cta-section').parentElement;
    
    expect(heroSection).not.toHaveClass('animate-fade-in');
    expect(ctaSection).not.toHaveClass('animate-fade-in');
  });

  it('applies animation when animate is true', () => {
    render(<SplashPage animate={true} />);
    
    // Check that all sections have the animation class
    const heroSection = screen.getByTestId('mock-hero-section').parentElement;
    const ctaSection = screen.getByTestId('mock-cta-section').parentElement;
    
    expect(heroSection).toHaveClass('animate-fade-in');
    expect(ctaSection).toHaveClass('animate-fade-in');
  });

  it('calls onCtaClick when CTA is clicked', async () => {
    const handleCtaClick = jest.fn();
    const user = userEvent.setup();
    
    render(<SplashPage onCtaClick={handleCtaClick} />);
    
    const ctaSection = screen.getByTestId('mock-cta-section');
    await user.click(ctaSection);
    
    expect(handleCtaClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<SplashPage className={customClass} />);
    
    const pageLayout = screen.getByTestId('mock-page-layout');
    expect(pageLayout.className).toContain(customClass);
  });

  it('passes additional props to PageLayout', () => {
    render(<SplashPage data-testprop="test-value" />);
    
    const pageLayout = screen.getByTestId('mock-page-layout');
    expect(pageLayout).toHaveAttribute('data-testprop', 'test-value');
  });

  it('applies custom background color', () => {
    const customBgColor = 'var(--custom-color)';
    render(<SplashPage backgroundColor={customBgColor} />);
    
    const pageLayout = screen.getByTestId('mock-page-layout');
    expect(pageLayout).toHaveAttribute('data-background-color', customBgColor);
  });

  // BenefitTrio is no longer used, so we don't need to test layout
});
