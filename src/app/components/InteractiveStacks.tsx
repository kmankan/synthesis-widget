import IsometricCube from "./IsometricCube";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { useRef, useState } from "react";
import AddBlock from "./AddBlock";
import Stack from "./Stack";
import ControlPanel from "./ControlPanel";
import ComparisonSymbol from "./ComparisonSymbol";

export const MAX_STACK_SIZE = 10;

export default function InteractiveStacks() {
  // use counters to track the number of blocks in each stack
  const [leftStack, setLeftStack] = useState<number>(4);
  const [leftBlocksAvailable, setLeftBlocksAvailable] = useState<number>(6);
  const [rightStack, setRightStack] = useState<number>(3);
  const [rightBlocksAvailable, setRightBlocksAvailable] = useState<number>(7);

  // Position Refs for the stacks
  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

  const isOverStack = (dragX: number, sourceStack: "left" | "right") => {
    // Get the target stack element
    const targetStack = sourceStack === 'left' ? rightStackRef.current : leftStackRef.current;
    if (!targetStack) return false;

    // Get target stack bounds
    const targetRect = targetStack.getBoundingClientRect();

    // Return true if drag end position is within target stack bounds
    return dragX >= targetRect.left && dragX <= targetRect.right;
  };

  const handleAddBlock = (whichStack: "left" | "right") => {
    if (whichStack === 'left' && leftStack < MAX_STACK_SIZE) {
      setLeftStack(prev => prev + 1);
    } else if (whichStack === 'right' && rightStack < MAX_STACK_SIZE) {
      setRightStack(prev => prev + 1);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full">
      {/* Fix the stacks canvas in the horizontal center of the screen and */}
      <div className="flex items-center gap-x-32 fixed top-[43%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-gray-300 rounded-md" id="stacks-canvas">
        {/* Left Stack */}
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-md">
          <Stack side="left" count={leftStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />
        </div>
        {/* Comparison Symbol */}
        <div>
          <ComparisonSymbol leftStack={leftStack} rightStack={rightStack} />
        </div>
        {/* Right Stack */}
        <div className="flex flex-col items-center border-2 border-gray-300 rounded-md">
          <Stack side="right" count={rightStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />
        </div>
      </div>
      {/* Control Panel */}
      <div className="fixed bottom-0 left-0 right-0">
        <ControlPanel leftStack={leftStack} rightStack={rightStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />
      </div>
    </div>
  );
}
