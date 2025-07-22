import type { AnimatedGridPlugin } from "../AnimatedGrid.types";

// Lightning Effect Plugin
const lightningPlugin: AnimatedGridPlugin = {
  onDraw: ({ ctx, canvas, mouse, frame }) => {
    if (frame % 180 < 5) { // Lightning every 3 seconds for 5 frames
      const branches = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < branches; i++) {
        const startX = mouse.x + (Math.random() - 0.5) * 100;
        const startY = mouse.y + (Math.random() - 0.5) * 100;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = startY + (Math.random() - 0.5) * 200;
        
        // Lightning path with random segments
        ctx.save();
        ctx.strokeStyle = `rgba(135, 206, 250, ${0.8 + Math.random() * 0.2})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#87CEEB';
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Create jagged lightning path
        const segments = 8;
        for (let j = 1; j <= segments; j++) {
          const progress = j / segments;
          const x = startX + (endX - startX) * progress + (Math.random() - 0.5) * 20;
          const y = startY + (endY - startY) * progress + (Math.random() - 0.5) * 20;
          ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        ctx.restore();
      }
    }
  },
};

export default lightningPlugin;
