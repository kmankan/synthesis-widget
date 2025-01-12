# Synthesis Widget

A dynamic, interactive widget for teaching numerical comparison concepts using stackable blocks.

## Features

- Two interactive stacks that can hold up to 10 blocks each
- Dual interaction modes:
  - **Add/Remove**: Click to add blocks, drag to remove them
  - **Draw**: Create comparison lines between stacks
- Visual comparison indicator (`>`, `<`, `=`) between stacks
- Control panel for:
  - Switching interaction modes
  - Manual stack size adjustment
  - Animation controls
- Animated blocks with isometric design
- Responsive layout with touch/mouse support

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
# or
yarn install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the widget.

## Usage

### Add/Remove Mode

- Click the + buttons to add blocks
- Drag blocks away to remove them
- Use control panel for precise adjustments

### Draw Mode

- Click and drag from one stack to another to create comparison lines
- Lines can only connect corresponding positions (top-to-top or bottom-to-bottom)
- Invalid connections are automatically discarded

### Animation

- Use the play button to animate the comparison between stacks

## Technical Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand for state management

---

**Note**: This widget is designed for educational purposes to help students understand numerical comparisons through visual and interactive learning.
