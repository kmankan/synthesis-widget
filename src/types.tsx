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
export type SetMode = React.Dispatch<React.SetStateAction<string>>;
export type SetAnimate = React.Dispatch<React.SetStateAction<boolean>>;

export type ControlPanelProps = {
  leftStack: number;
  rightStack: number;
  setLeftStack: SetStacks;
  setRightStack: SetStacks;
  setMode: SetMode;
  mode: string;
  animate: boolean;
  setAnimate: SetAnimate;
}