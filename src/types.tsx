export type DragInfo = {
  point: {
    x: number;
    y: number;    // Current pointer coordinates
  };
  offset: {
    x: number;
    y: number;    // Distance dragged from start position
  };
  velocity: {
    x: number;
    y: number;    // Speed of drag in pixels per second
  };
}

export type Stacks = "left" | "right";

export type SetStacks = React.Dispatch<React.SetStateAction<number>>;

export type Point = {
  x: number;
  y: number;
  position: 'top' | 'bottom';
  whichStack: Stacks;
} | null;