// Stack.tsx
import { AnimatePresence, motion } from "framer-motion";
import Block from "./Block";
import { Stacks, SetStacks } from "@/types";
import { useModeStore } from "../store/modeStore";
import { Plus } from "lucide-react";
import { MAX_STACK_SIZE } from "./InteractiveStacks";

interface StackProps {
  side: Stacks;
  count: number;
  setLeftStack: SetStacks;
  setRightStack: SetStacks;
  onDragStart: (e: PointerEvent, elementId: string) => void;
  onDragEnd: (e: PointerEvent) => void;
}

export default function Stack({
  side,
  count,
  setLeftStack,
  setRightStack,
  onDragStart,
  onDragEnd,
}: StackProps) {
  const { mode } = useModeStore();

  const renderBlocks = (count: number, whichStack: Stacks) => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      blocks.push(
        <Block
          key={i}
          whichStack={whichStack}
          setLeftStack={setLeftStack}
          setRightStack={setRightStack}
        />
      );
    }
    return blocks;
  };

  const handleAddBlock = () => {
    if (side === "left") {
      setLeftStack(count + 1);
    } else if (side === "right") {
      setRightStack(count + 1);
    }
  }

  const DrawElement = ({ position }: { position: "top" | "bottom" }) => {
    const elementId = `${side}-${position}`;

    return (
      // Modify the action of the div depending on the mode
      mode === "addRemove" ? (
        <button
          id={elementId}
          className="w-12 h-12 2xl:w-16 2xl:h-16 hover:border-2 hover:border-sky-300 hover:bg-sky-100 relative rounded-lg cursor-pointer flex items-center justify-center disabled:opacity-0 disabled:cursor-not-allowed"
          disabled={count >= MAX_STACK_SIZE}
          onClick={() => {
            handleAddBlock();
          }}
        >
          <Plus className="w-6 h-6 text-sky-300" />
        </button>
      ) : (
        <motion.div
          id={elementId}
          className="w-12 h-12 2xl:w-16 2xl:h-16 hover:border-2 hover:border-sky-300 bg-[#b9ddff] opacity-100 relative rounded-lg cursor-crosshair"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            onDragStart(e as unknown as PointerEvent, elementId);
          }}
          onPointerUp={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            onDragEnd(e as unknown as PointerEvent);
          }}
        />
      )
    );
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <DrawElement position="top" />
      <div className="flex flex-col" id={`${side}-stack`}>
        <AnimatePresence mode="wait">
          {renderBlocks(count, side)}
        </AnimatePresence>
      </div>
      <DrawElement position="bottom" />
    </div>
  );
}