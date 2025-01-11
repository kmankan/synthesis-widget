import IsometricCube from "./IsometricCube";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DragInfo } from "@/types";

export default function Stacks() {
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

  const handleDragEnd = (whichStack: "left" | "right") => (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    // If dragged 100px in any direction, remove the block from the stack
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      if (whichStack === 'left') {
        setLeftStack(prev => prev - 1);
      } else {
        setRightStack(prev => prev - 1);
      }
    }
  };

  const handleAddBlock = (whichStack: "left" | "right") => {
    if (whichStack === 'left' && leftStack < MAX_STACK_SIZE) {
      setLeftStack(prev => prev + 1);
    } else if (whichStack === 'right' && rightStack < MAX_STACK_SIZE) {
      setRightStack(prev => prev + 1);
    }
  }

  // create a block component that can be dragged
  const Block = ({ whichStack }: { whichStack: "left" | "right" }) => (
    <motion.div
      className="cursor-grab active:cursor-grabbing hover:brightness-110 border-2 border-gray-300"
      drag={true}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1 }}
      onDragEnd={handleDragEnd(whichStack)}
      layout
    >
      <IsometricCube width="75px" height="75px" />
    </motion.div>
  );

  const renderBlocks = (count: number, whichStack: "left" | "right") => {
    // an array to store the block components
    const blocks = [];
    // loop through the count and add n block components to the array
    for (let i = 0; i < count; i++) {
      blocks.push(<Block key={i} whichStack={whichStack} />);
    }
    return blocks;
  }

  const Stack = ({ side, count }: { side: "left" | "right", count: number }) => (
    <div className="flex flex-col items-center">
      <button
        onClick={() => handleAddBlock(side)}
        disabled={count >= MAX_STACK_SIZE}
        className={`mt-4 px-4 py-2 rounded-lg ${count >= MAX_STACK_SIZE
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          } text-white font-bold`}
      >
        Add Block
      </button>
      <div className="mt-4 text-lg font-bold">Count: {count}</div>
      <div className="flex flex-col-reverse items-center">
        <AnimatePresence mode="popLayout">
          {renderBlocks(count, side)}
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center items-center gap-x-32">
        <Stack side="left" count={leftStack} />

        {/* Comparison Symbol */}
        <div className="text-4xl font-bold">{getComparisonSymbol(leftStack, rightStack)}</div>

        <Stack side="right" count={rightStack} />
      </div>
    </div>
  );
}
