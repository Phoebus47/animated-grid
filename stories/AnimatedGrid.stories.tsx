import React from "react";
import { AnimatedGrid, AnimatedGridProps, matrixTheme, neonTheme, techTheme } from "../src";
import exampleGlowPlugin from "../src/plugin/exampleGlow.plugin";
import bloomPlugin from "../src/plugin/bloom.plugin";
import lightningPlugin from "../src/plugin/lightning.plugin";

export default {
  title: "AnimatedGrid/Core",
  component: AnimatedGrid,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
  argTypes: {
    gridColor: { control: "color" },
    glowColor: { control: "color" },
    rippleColor: { control: "color" },
    maxParticles: { control: { type: "number", min: 0, max: 300 } },
    intensity: { control: { type: "number", min: 0.1, max: 3, step: 0.1 } },
    mouseInfluence: { control: { type: "number", min: 0, max: 3, step: 0.1 } },
    targetFPS: { control: { type: "number", min: 30, max: 120 } },
    adaptiveQuality: { control: "boolean" },
    gpuAcceleration: { control: "boolean" },
    particleTrails: { control: "boolean" },
  },
};

export const Default = (args: AnimatedGridProps) => (
  <div style={{ position: "relative", height: "100vh", width: "100vw", backgroundColor: "#000" }}>
    <AnimatedGrid {...args} />
    <div style={{ 
      position: "absolute", 
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)",
      zIndex: 10, 
      padding: 40, 
      color: "white",
      textAlign: "center",
      background: "rgba(0,0,0,0.3)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      border: "1px solid rgba(0,200,150,0.2)"
    }}>
      <h2 style={{ margin: "0 0 16px", fontSize: "2.5rem", fontWeight: 300 }}>AnimatedGrid</h2>
      <p style={{ margin: "8px 0", opacity: 0.8 }}>Interactive animated background grid</p>
      <p style={{ margin: "8px 0", opacity: 0.6, fontSize: "0.9rem" }}>Move your mouse to see the ripple effect</p>
    </div>
  </div>
);

Default.parameters = {
  layout: 'fullscreen',
};

Default.args = {
  gridColor: "rgba(133,177,0,0.16)",
  glowColor: "rgba(133,177,0,0.5)",
  rippleColor: "rgba(133,177,0,0.12)",
  maxParticles: 120,
  intensity: 1,
  mouseInfluence: 1,
  targetFPS: 60,
  adaptiveQuality: true,
  particleTrails: false,
};

export const MatrixTheme = (args: AnimatedGridProps) => (
  <div style={{ position: "relative", height: "100vh", width: "100vw", backgroundColor: "#001100" }}>
    <AnimatedGrid {...args} {...matrixTheme} />
    <div style={{ 
      position: "absolute", 
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)",
      zIndex: 10, 
      padding: 40, 
      color: "#00ff00",
      textAlign: "center",
      background: "rgba(0,20,0,0.4)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      border: "1px solid rgba(0,255,0,0.3)"
    }}>
      <h2 style={{ margin: "0 0 16px", fontSize: "2.5rem", fontWeight: 300 }}>Matrix Theme</h2>
      <p style={{ margin: "8px 0", opacity: 0.8 }}>Enter the Matrix digital rain</p>
      <p style={{ margin: "8px 0", opacity: 0.6, fontSize: "0.9rem" }}>Follow the white rabbit...</p>
    </div>
  </div>
);

MatrixTheme.parameters = {
  layout: 'fullscreen',
};

export const NeonCyberpunk = (args: AnimatedGridProps) => (
  <div style={{ position: "relative", height: "100vh", width: "100vw", backgroundColor: "#1a0a1a" }}>
    <AnimatedGrid {...args} {...neonTheme} />
    <div style={{ 
      position: "absolute", 
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)",
      zIndex: 10, 
      padding: 40, 
      color: "#ff0096",
      textAlign: "center",
      background: "rgba(30,0,15,0.4)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      border: "1px solid rgba(255,0,150,0.3)"
    }}>
      <h2 style={{ margin: "0 0 16px", fontSize: "2.5rem", fontWeight: 300 }}>Neon Cyberpunk</h2>
      <p style={{ margin: "8px 0", opacity: 0.8 }}>Pink neon cyberpunk style with particle trails</p>
      <p style={{ margin: "8px 0", opacity: 0.6, fontSize: "0.9rem" }}>Electric dreams and digital landscapes</p>
    </div>
  </div>
);

NeonCyberpunk.parameters = {
  layout: 'fullscreen',
};

export const WithPlugins = (args: AnimatedGridProps) => (
  <div style={{ position: "relative", height: "100vh", width: "100vw", backgroundColor: "#000011" }}>
    <AnimatedGrid 
      {...args} 
      {...techTheme}
      plugins={[exampleGlowPlugin, bloomPlugin, lightningPlugin]} 
    />
    <div style={{ 
      position: "absolute", 
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)",
      zIndex: 10, 
      padding: 40, 
      color: "#0096ff",
      textAlign: "center",
      background: "rgba(0,0,20,0.4)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      border: "1px solid rgba(0,150,255,0.3)"
    }}>
      <h2 style={{ margin: "0 0 16px", fontSize: "2.5rem", fontWeight: 300 }}>Plugin Showcase</h2>
      <p style={{ margin: "8px 0", opacity: 0.8 }}>All plugins enabled: Glow, Bloom, Lightning</p>
      <p style={{ margin: "8px 0", opacity: 0.6, fontSize: "0.9rem" }}>Experience enhanced visual effects</p>
    </div>
  </div>
);

WithPlugins.parameters = {
  layout: 'fullscreen',
};

export const PerformanceOptimized = (args: AnimatedGridProps) => {
  const [fps, setFPS] = React.useState(60);
  
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw", backgroundColor: "#000" }}>
      <AnimatedGrid 
        {...args}
        adaptiveQuality={true}
        targetFPS={60}
        onPerformanceChange={setFPS}
      />
      <div style={{ 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)",
        zIndex: 10, 
        padding: 40, 
        color: "white",
        textAlign: "center",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: "1px solid rgba(0,200,150,0.3)"
      }}>
        <h2 style={{ margin: "0 0 16px", fontSize: "2.5rem", fontWeight: 300 }}>Performance Monitor</h2>
        <p style={{ margin: "8px 0", opacity: 0.8 }}>Current FPS: {fps}</p>
        <p style={{ margin: "8px 0", opacity: 0.6, fontSize: "0.9rem" }}>Adaptive quality enabled for smooth performance</p>
      </div>
    </div>
  );
};

PerformanceOptimized.parameters = {
  layout: 'fullscreen',
};
