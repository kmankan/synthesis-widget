import { useState } from "react";
import Stack from "./Stack";
import ControlPanel from "./ControlPanel";
import ComparisonSymbol from "./ComparisonSymbol";
import { Point } from "@/types";
import DrawingLayer from './DrawingLayer';

export const MAX_STACK_SIZE = 10;

export default function InteractiveStacks() {
  // use counters to track the number of blocks in each stack
  const [leftStack, setLeftStack] = useState<number>(4);
  // const [leftBlocksAvailable, setLeftBlocksAvailable] = useState<number>(6);
  const [rightStack, setRightStack] = useState<number>(3);
  // const [rightBlocksAvailable, setRightBlocksAvailable] = useState<number>(7);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point>(null);
  const [currentPoint, setCurrentPoint] = useState<Point>(null);

  // Position Refs for the stacks
  //const leftStackRef = useRef<HTMLDivElement>(null);
  //const rightStackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      {/* Fix the stacks canvas in the horizontal center of the screen and */}
      <div className="flex items-center gap-x-32 fixed top-[43%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 rounded-md" id="stacks-canvas">
        {/* Drawing Layer - Positioned absolutely to cover the entire canvas */}
        {isDrawing && (
          <DrawingLayer
            startPoint={startPoint}
            endPoint={currentPoint}
            isDrawing={isDrawing}
          />
        )}

        {/* Left Stack */}
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-md">
          <Stack
            side="left"
            count={leftStack}
            setLeftStack={setLeftStack}
            setRightStack={setRightStack}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            startPoint={startPoint}
            setStartPoint={setStartPoint}
            currentPoint={currentPoint}
            setCurrentPoint={setCurrentPoint}
          />
        </div>

        {/* Comparison Symbol */}
        <div>
          <ComparisonSymbol leftStack={leftStack} rightStack={rightStack} />
        </div>

        {/* Right Stack */}
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-md">
          <Stack
            side="right"
            count={rightStack}
            setLeftStack={setLeftStack}
            setRightStack={setRightStack}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
            startPoint={startPoint}
            setStartPoint={setStartPoint}
            currentPoint={currentPoint}
            setCurrentPoint={setCurrentPoint}
          />
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-0 left-0 right-0">
        <ControlPanel leftStack={leftStack} rightStack={rightStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />
      </div>
    </div>
  );
}
