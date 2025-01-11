import IsometricCube from "./IsometricCube";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { useRef, useState } from "react";
import AddBlock from "./AddBlock";
import Stack from "./Stack";

export default function InteractiveStacks() {
  // use counters to track the number of blocks in each stack
  const MAX_STACK_SIZE = 10;
  const [leftStack, setLeftStack] = useState<number>(4);
  const [leftBlocksAvailable, setLeftBlocksAvailable] = useState<number>(6);
  const [rightStack, setRightStack] = useState<number>(3);
  const [rightBlocksAvailable, setRightBlocksAvailable] = useState<number>(7);

  // Position Refs for the stacks
  const leftStackRef = useRef<HTMLDivElement>(null);
  const rightStackRef = useRef<HTMLDivElement>(null);

  // get comparison symbol between stacks
  const getComparisonSymbol = (leftStack: number, rightStack: number) => {
    if (leftStack > rightStack) return ">";
    if (leftStack < rightStack) return "<";
    return "=";
  };

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
    <div className="flex items-center gap-x-32">
      <div className="flex flex-col items-center">
        <Stack side="left" count={leftStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />
        <AddBlock side="left" count={leftStack} max_stack_size={MAX_STACK_SIZE} handleAddBlock={handleAddBlock} />
      </div>
      {/* Comparison Symbol */}
      <div className="text-4xl font-bold">{getComparisonSymbol(leftStack, rightStack)}</div>
      <div className="flex flex-col items-center">
        <Stack side="right" count={rightStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />
        <AddBlock side="right" count={rightStack} max_stack_size={MAX_STACK_SIZE} handleAddBlock={handleAddBlock} />
      </div>
    </div>
  );
}
