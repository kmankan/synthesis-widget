import { motion } from "framer-motion";
import IsometricCube from "./IsometricCube";
import { PanInfo } from "motion/react";

type Stacks = "left" | "right";
type SetStacks = React.Dispatch<React.SetStateAction<number>>;
type InteractionEvents = MouseEvent | TouchEvent | PointerEvent;
type DragEndHandler = (whichStack: Stacks) => (event: InteractionEvents, info: PanInfo) => void;

// create a block component that can be dragged
export default function Block({ whichStack, setLeftStack, setRightStack }: {
  whichStack: Stacks,
  setLeftStack: SetStacks,
  setRightStack: SetStacks
}) {
  const handleDragEnd: DragEndHandler = (whichStack: Stacks) =>
    (_event: InteractionEvents, info: PanInfo) => {
      const threshold = 1;
      // If dragged 100px in any direction, remove the block from the stack
      if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
        if (whichStack === 'left') {
          setLeftStack(prev => prev - 1);
        } else {
          setRightStack(prev => prev - 1);
        }
      }
    }

  return (
    <motion.div
      className="w-12 h-12 2xl:w-24 2xl:h-24 cursor-grab active:cursor-grabbing hover:brightness-110"
      drag={true}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1 }}
      onDragEnd={handleDragEnd(whichStack)}
      layout
      animate={{
        y: [0, -6, 0],  // Array defines keyframes: start, middle, end positions
        transition: {
          duration: 2,    // One bounce cycle takes 2 seconds
          repeat: Infinity,  // Keep bouncing forever
          ease: "easeInOut"  // Smooth movement
        }
      }}
    >
      <IsometricCube width="100%" height="100%" />
    </motion.div>
  )
};