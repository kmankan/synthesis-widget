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

  const handleDragEnd = (stackSide: "left" | "right") => (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    // If dragged far enough in any direction, remove the box
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      if (stackSide === 'left') {
        setLeftStack(prev => prev - 1);
      } else {
        setRightStack(prev => prev - 1);
      }
    }
  };

  const handleAddBlock = (stackSide: "left" | "right") => {
    if (stackSide === 'left' && leftStack < MAX_STACK_SIZE) {
      setLeftStack(prev => prev + 1);
    } else if (stackSide === 'right' && rightStack < MAX_STACK_SIZE) {
      setRightStack(prev => prev + 1);
    }
  }

  const Box = ({ stackSide }: { stackSide: "left" | "right" }) => (
    <motion.div
      className="w-16 h-16 bg-blue-500 rounded-lg m-1 cursor-grab active:cursor-grabbing hover:brightness-110"
      drag={true}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1 }}
      onDragEnd={handleDragEnd(stackSide)}
      layout
    />
  );



  return (
    <div className="flex flex-col items-center">
      <h1>Stacks</h1>
      <IsometricCube width="100px" height="100px" />
    </div>
  );
}
