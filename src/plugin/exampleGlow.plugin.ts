import type { AnimatedGridPlugin } from "../AnimatedGrid.types";

const exampleGlowPlugin: AnimatedGridPlugin = {
  onDraw: ({ ctx, frame, canvas }) => {
    if (frame % 120 < 10) {
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#85B100";
      ctx.strokeStyle = "#85B100";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.restore();
    }
  },
};

export default exampleGlowPlugin;
