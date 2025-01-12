import { useEffect, useState } from "react";
import Stack from "./Stack";
import ControlPanel from "./ControlPanel";
import ComparisonSymbol from "./ComparisonSymbol";
import { useModeStore } from "@/app/store/modeStore";

export const MAX_STACK_SIZE = 10;

interface LineState {
  start: { x: number; y: number };
  end: { x: number; y: number };
  startElement: string | null;
  active: boolean;
}

const debugLineCoordinates = (line: LineState) => {
  console.log('Line coordinates:', {
    start: {
      x: Math.round(line.start.x),
      y: Math.round(line.start.y),
      normalized: {
        x: Math.round(line.start.x / window.innerWidth * 100),
        y: Math.round(line.start.y / window.innerHeight * 100)
      }
    },
    end: {
      x: Math.round(line.end.x),
      y: Math.round(line.end.y),
      normalized: {
        x: Math.round(line.end.x / window.innerWidth * 100),
        y: Math.round(line.end.y / window.innerHeight * 100)
      }
    }
  });
};

export default function InteractiveStacks() {
  // set the mode of interaction
  const { mode } = useModeStore();
  // determine whether we're animating the comparison of stacks
  const [animate, setAnimate] = useState<boolean>(false);
  // use counters to track the number of blocks in each stack
  const [leftStack, setLeftStack] = useState<number>(4);
  //const [leftBlocksAvailable, setLeftBlocksAvailable] = useState<number>(6);
  const [rightStack, setRightStack] = useState<number>(3);
  //const [rightBlocksAvailable, setRightBlocksAvailable] = useState<number>(7);

  // Position Refs for the stacks
  //const leftStackRef = useRef<HTMLDivElement>(null);
  //const rightStackRef = useRef<HTMLDivElement>(null);

  // This keeps track of all permanent lines that have been drawn
  const [lines, setLines] = useState<LineState[]>([]);
  // This tracks the current line being drawn
  const [currentLine, setCurrentLine] = useState<LineState>({
    start: { x: 0, y: 0 },    // Where the line starts
    end: { x: 0, y: 0 },      // Where the line ends
    startElement: null,        // ID of the element where we started drawing
    active: false,            // Whether we're currently drawing
  });

  // Track the mouse position and update the line end point
  // Runs when the user starts or stops drawing
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (currentLine.active) { // only track if we're drawing
        const canvas = document.getElementById('stacks-canvas');
        if (!canvas) return;

        const canvasRect = canvas.getBoundingClientRect();
        // Update the end point of the line to follow the mouse
        setCurrentLine(prev => ({
          ...prev,
          end: { // update the end point of the line
            x: e.clientX - canvasRect.left,
            y: e.clientY - canvasRect.top
          }
        }));
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [currentLine.active]);

  // Track where the user clicks and reset the line if no valid target is found
  // Runs when it detects starting or stopping of the draw line
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      if (!currentLine.active) return;

      // Get elements under click
      const elements = document.elementsFromPoint(e.clientX, e.clientY);

      // Check if we clicked a valid target
      const startPosition = currentLine.startElement?.split('-')[1];
      const hasValidTarget = elements.some(el => {
        const element = el as HTMLElement;
        if (!element.id) return false;

        const isValidTarget = element.id !== currentLine.startElement &&
          (element.id.startsWith('left-') || element.id.startsWith('right-'));

        const targetPosition = element.id.split('-')[1];
        return isValidTarget && targetPosition === startPosition;
      });

      // If no valid target found, reset the line
      if (!hasValidTarget) {
        setCurrentLine(prev => ({ ...prev, active: false }));
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, [currentLine.active, currentLine.startElement]);

  // If the mode changes to AddRemove, erase the drawn lines
  useEffect(() => {
    if (mode === 'addRemove') {
      setCurrentLine(prev => ({ ...prev, active: false })); // clear the current line
      setLines([]); // clear any drawn lines
    }
  }, [mode]);

  useEffect(() => {
    if (animate) {
      // Start the animation
      const animation = document.getElementById('flowAnimation');
      // check that the element is the correct type
      if (animation && animation instanceof SVGAnimateTransformElement) {
        animation.beginElement();
      }

      // Reset animate state after animation completes
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 4000); // Same duration as the animation

      return () => clearTimeout(timer);
    }
  }, [animate]);

  // This function is called when a user starts dragging an element
  const handleDragStart = (e: PointerEvent, elementId: string) => {
    // Only allow drawing if the control panel mode is set to draw
    if (mode !== "draw") return;
    // Get the parent container that holds all the stacks
    const canvas = document.getElementById('stacks-canvas');
    if (!canvas) return;

    // Get the positions of both the canvas and the element we clicked
    const canvasRect = canvas.getBoundingClientRect();
    const targetRect = (e.target as HTMLElement).getBoundingClientRect();

    // Calculate where the line should start, relative to our canvas
    // Take the elements position and subtract the canvas position to get the relative position
    // We add the width/height of the element to get the center of the element
    const centerX = targetRect.left - canvasRect.left + targetRect.width / 2;
    const centerY = targetRect.top - canvasRect.top + targetRect.height / 2;

    // Start drawing a new line from this point
    setCurrentLine({
      start: { x: centerX, y: centerY },
      end: { x: centerX, y: centerY },  // Initially, end point is same as start
      startElement: elementId,           // Remember which element we started from
      active: true,                      // We're now in drawing mode
    });
  };

  // This function is called when a user stops dragging an element
  const handleDragEnd = (e: PointerEvent) => {
    if (mode !== "draw" || !currentLine.active) return;

    const canvas = document.getElementById('stacks-canvas');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const elements = document.elementsFromPoint(e.clientX, e.clientY);

    // Log canvas transformation state
    console.log('Canvas transform:', {
      matrix: window.getComputedStyle(canvas).transform,
      bounds: canvasRect
    });

    const startPosition = currentLine.startElement?.split('-')[1];

    const targetElement = elements.find(element => {
      const isValidElement = element as HTMLElement;
      if (!isValidElement.id) return false;

      const isValidTarget = element.id !== currentLine.startElement &&
        (element.id.startsWith('left-') || element.id.startsWith('right-'));

      const targetPosition = element.id.split('-')[1];
      return isValidTarget && targetPosition === startPosition;
    }) as HTMLElement;

    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const newLine = {
        ...currentLine,
        end: {
          x: targetRect.left - canvasRect.left + targetRect.width / 2,
          y: targetRect.top - canvasRect.top + targetRect.height / 2
        }
      };

      debugLineCoordinates(newLine);
      setLines(prev => [...prev, newLine]);
    }

    setCurrentLine(prev => ({ ...prev, active: false }));
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="flex items-center gap-x-32 fixed top-[43%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8" id="stacks-canvas">
        {/* Left Stack */}
        <div className="flex flex-col items-center">
          <Stack
            side="left"
            count={leftStack}
            setLeftStack={setLeftStack}
            setRightStack={setRightStack}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* Comparison Symbol */}
        <div>
          <ComparisonSymbol leftStack={leftStack} rightStack={rightStack} />
        </div>

        {/* Right Stack */}
        <div className="flex flex-col items-center">
          <Stack
            side="right"
            count={rightStack}
            setLeftStack={setLeftStack}
            setRightStack={setRightStack}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>

        {/* SVG overlay for all lines */}
        <svg
          className="fixed inset-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            zIndex: 50,
            transform: 'none', // Ensure no inherited transforms
            position: 'absolute',
            overflow: 'visible'
          }}
          preserveAspectRatio="none"
        >
          {/* Add the filter definition */}
          <defs>
            {/* Gradient for normal state */}
            <linearGradient id="iceGradient">
              <stop offset="0%" stopColor="#A8DDFF" />
              <stop offset="50%" stopColor="#E8F4FF" />
              <stop offset="100%" stopColor="#A8DDFF" />
            </linearGradient>

            {/* Gradient for animation state */}
            <linearGradient
              id="flowingGradient"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#A8DDFF" />
              <stop offset="40%" stopColor="#A8DDFF" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#A8DDFF" />
              <stop offset="100%" stopColor="#A8DDFF" />

              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                from="-1"
                to="1"
                dur="2s"
                repeatCount="1"
                begin="indefinite"
                id="flowAnimation"
              />
            </linearGradient>
          </defs>

          {/* Permanent lines with glow */}
          {lines.map((line, i) => {
            //console.log(`Rendering line ${i}:`, line); // Debugging line rendering
            return (
              <line
                key={i}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
                stroke="url(#iceGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke" // Add this to prevent stroke scaling issues
              />
            );
          })}

          {/* Temporary drawing line (before connection is made) */}
          {currentLine.active && (
            <line
              x1={currentLine.start.x}
              y1={currentLine.start.y}
              x2={currentLine.end.x}
              y2={currentLine.end.y}
              stroke="#A8DDFF"
              strokeWidth="4"
              strokeDasharray="4"
            />
          )}
        </svg>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-0 left-0 right-0">
        <ControlPanel
          leftStack={leftStack}
          rightStack={rightStack}
          setLeftStack={setLeftStack}
          setRightStack={setRightStack}
          animate={animate}
          setAnimate={setAnimate}
        />
      </div>
    </div>
  );
}
