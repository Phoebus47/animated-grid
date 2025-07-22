# Contributing to AnimatedGrid

Thank you for your interest in contributing to AnimatedGrid! This guide will help you get started.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR-USERNAME/animated-grid.git
   cd animated-grid
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development**
   ```bash
   pnpm storybook  # Start Storybook on http://localhost:6006
   ```

## Project Structure

```
animated-grid/
├── src/                    # Source code
│   ├── AnimatedGrid.tsx   # Main component
│   ├── AnimatedGrid.types.ts # TypeScript definitions
│   ├── plugin/            # Plugin examples
│   └── themes/            # Pre-built themes
├── stories/               # Storybook stories
├── __tests__/            # Jest tests
└── .storybook/           # Storybook configuration
```

## Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Edit source code in `src/`
   - Add/update tests in `__tests__/`
   - Update stories in `stories/`

3. **Test Your Changes**
   ```bash
   pnpm test        # Run tests
   pnpm build       # Test build
   pnpm storybook   # Visual testing
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/your-feature-name
   ```

5. **Open Pull Request**
   - Create PR from your branch to `main`
   - Describe your changes clearly
   - Link any related issues

## Code Standards

- **TypeScript** - All code must be typed
- **React 18+** - Use modern React patterns
- **Performance** - Consider mobile and accessibility
- **Tests** - Add tests for new features

## Plugin Development

Create plugins in `src/plugin/`:

```typescript
import type { AnimatedGridPlugin } from '../AnimatedGrid.types';

const myPlugin: AnimatedGridPlugin = {
  onDraw: ({ ctx, canvas, mouse, frame }) => {
    // Your custom rendering logic
  },
};

export default myPlugin;
```

## Theme Development

Create themes in `src/themes/`:

```typescript
export const myTheme = {
  gridColor: "rgba(255,255,255,0.1)",
  glowColor: "rgba(255,100,100,0.6)",
  rippleColor: "rgba(255,100,100,0.2)",
};
```

## Questions?

- 📚 Check the [Storybook examples](https://your-storybook-url.netlify.app)
- 💬 Open a [Discussion](https://github.com/YOUR-USERNAME/animated-grid/discussions)
- 🐛 Report [Issues](https://github.com/YOUR-USERNAME/animated-grid/issues)

We appreciate all contributions! 🙏
