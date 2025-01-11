import { useEffect, useRef, useState } from "react";
import Stack from "./Stack";
import ControlPanel from "./ControlPanel";
import ComparisonSymbol from "./ComparisonSymbol";

export const MAX_STACK_SIZE = 10;

interface LineState {
  start: { x: number; y: number };
  end: { x: number; y: number };
  startElement: string | null;
  active: boolean;
}

export default function InteractiveStacks() {
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

  // This function is called when a user starts dragging an element
  const handleDragStart = (e: PointerEvent, elementId: string) => {
    // Get the parent container that holds all the stacks
    const canvas = document.getElementById('stacks-canvas');
    if (!canvas) return;

    // Get the positions of both the canvas and the element we clicked
    const canvasRect = canvas.getBoundingClientRect(); // ? What exactly does this get back as values?
    const targetRect = (e.target as HTMLElement).getBoundingClientRect();

    // Calculate where the line should start, relative to our canvas
    // We subtract canvasRect.left/top to convert from page coordinates to canvas coordinates
    const centerX = targetRect.left - canvasRect.left + targetRect.width / 2; // ? I don't get why we do this calculation
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
    if (!currentLine.active) return;

    const canvas = document.getElementById('stacks-canvas');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();

    // 
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    // Find if we're over a valid connection point
    const targetElement = elements.find(el =>
      (el as HTMLElement).id && // ? I dont get what goingon here
      (el as HTMLElement).id !== currentLine.startElement &&
      ((el as HTMLElement).id.startsWith('left-') ||
        (el as HTMLElement).id.startsWith('right-'))
    ) as HTMLElement;

    // If we found a valid target, create a permanent line
    if (targetElement) {
      const targetRect = targetElement.getBoundingClientRect();
      setLines(prev => [...prev, {
        ...currentLine,
        end: {
          x: targetRect.left - canvasRect.left + targetRect.width / 2,
          y: targetRect.top - canvasRect.top + targetRect.height / 2
        }
      }]);
    }
    // stop drawing
    setCurrentLine(prev => ({ ...prev, active: false }));
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      <div className="flex items-center gap-x-32 fixed top-[43%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 rounded-md p-8" id="stacks-canvas">
        {/* Left Stack */}
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-md p-4">
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
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-md p-4">
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
          style={{ width: '100%', height: '100%' }}
        >
          {/* Add the filter definition */}
          <defs>
            {/* Ice gradient */}
            <linearGradient id="iceGradient">
              <stop offset="0%" stopColor="#A8DDFF" />
              <stop offset="50%" stopColor="#E8F4FF" />
              <stop offset="100%" stopColor="#A8DDFF" />
            </linearGradient>
          </defs>

          {/* Draw the lines with glow */}
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="url(#iceGradient)"
              strokeWidth="14"
              strokeLinecap="round"
            />
          ))}

          {/* Current drawing line */}
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
        />
      </div>
    </div>
  );
}
