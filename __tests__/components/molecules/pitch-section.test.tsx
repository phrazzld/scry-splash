import React from "react"
import { render, screen } from "@testing-library/react"
import { PitchSection } from "@/components/molecules/pitch-section"

describe("PitchSection", () => {
  it("renders correctly with default props", () => {
    render(<PitchSection />)
    
    // Check that main heading is rendered
    expect(screen.getByText("AI-powered spaced repetition that works")).toBeInTheDocument()
    
    // Check that key feature headings are present
    expect(screen.getByText("Capture anything")).toBeInTheDocument()
    expect(screen.getByText("Review effortlessly")).toBeInTheDocument()
    expect(screen.getByText("Achieve mastery")).toBeInTheDocument()
    
    // Check for the summary sentence
    expect(screen.getByText("No more manual flashcards. No more subjective feedback. Just knowledge that sticks.")).toBeInTheDocument()
  })
  
  it("applies centered class when centered prop is true", () => {
    const { container } = render(<PitchSection centered />)
    
    // Check for the centered class on the GridItem
    const gridItem = container.querySelector("[class*='items-center text-center']")
    expect(gridItem).toBeInTheDocument()
  })
  
  it("applies custom text color when provided", () => {
    const customColor = "text-purple-500"
    const { container } = render(<PitchSection textColor={customColor} />)
    
    // Check if the heading has the custom color class
    const heading = container.querySelector(`[class*='${customColor}']`)
    expect(heading).toBeInTheDocument()
  })
  
  it("applies additional className when provided", () => {
    const customClass = "test-custom-class"
    const { container } = render(<PitchSection className={customClass} />)
    
    // Check if the container has the custom class
    const containerElement = container.querySelector(`.${customClass}`)
    expect(containerElement).toBeInTheDocument()
  })
})
