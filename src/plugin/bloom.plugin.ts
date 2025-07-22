import type { AnimatedGridPlugin } from "../AnimatedGrid.types";

// Bloom Effect Plugin
const bloomPlugin: AnimatedGridPlugin = {
  onDraw: ({ ctx, canvas, frame }) => {
    const intensity = 0.8 + Math.sin(frame * 0.02) * 0.2;
    
    // Create bloom effect
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.filter = `blur(${2 + intensity}px)`;
    
    // Redraw with reduced opacity for bloom
    ctx.globalAlpha = 0.3 * intensity;
    ctx.drawImage(canvas, 0, 0);
    
    ctx.restore();
  },
};

export default bloomPlugin;
