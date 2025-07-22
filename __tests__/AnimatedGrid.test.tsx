import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AnimatedGrid from "../src/AnimatedGrid";

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now()),
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("AnimatedGrid", () => {
  beforeEach(() => {
    // Reset window dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 800 });
  });

  it("renders fallback image on mobile", () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 320 });
    render(<AnimatedGrid />);
    expect(screen.getByTestId("animated-grid-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("animated-grid-canvas")).toHaveAttribute("src", "/bg-grid-static.webp");
  });

  it("renders canvas on desktop", () => {
    render(<AnimatedGrid />);
    expect(screen.getByTestId("animated-grid-canvas")).toBeInTheDocument();
  });

  it("calls onLoad callback when component loads", async () => {
    const onLoad = jest.fn();
    render(<AnimatedGrid onLoad={onLoad} />);
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it("calls onPerformanceChange callback", async () => {
    const onPerformanceChange = jest.fn();
    render(<AnimatedGrid onPerformanceChange={onPerformanceChange} />);
    
    // Simulate time passing for performance monitoring
    await waitFor(() => {
      expect(onPerformanceChange).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it("respects disableAnimation prop", () => {
    render(<AnimatedGrid disableAnimation />);
    expect(screen.getByTestId("animated-grid-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("animated-grid-canvas")).toHaveAttribute("src", "/bg-grid-static.webp");
  });

  it("handles mouse movement", () => {
    render(<AnimatedGrid />);
    const canvas = screen.getByTestId("animated-grid-canvas");
    
    fireEvent.mouseMove(canvas, {
      clientX: 100,
      clientY: 100
    });
    
    // Should not throw errors
    expect(canvas).toBeInTheDocument();
  });

  it("supports custom props", () => {
    render(
      <AnimatedGrid 
        intensity={2}
        mouseInfluence={1.5}
        particleTrails={true}
        targetFPS={30}
        adaptiveQuality={false}
      />
    );
    
    expect(screen.getByTestId("animated-grid-canvas")).toBeInTheDocument();
  });
});
