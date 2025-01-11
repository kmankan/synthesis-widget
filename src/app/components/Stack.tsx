// Stack.tsx
import { AnimatePresence, motion } from "framer-motion";
import Block from "./Block";
import { Stacks, SetStacks } from "@/types";

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

  const DrawElement = ({ position }: { position: "top" | "bottom" }) => {
    const elementId = `${side}-${position}`;

    return (
      <motion.div
        id={elementId}
        className="w-12 h-12 2xl:w-16 2xl:h-16 hover:border-2 hover:border-sky-50 hover:bg-sky-50 relative rounded-lg cursor-crosshair"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          onDragStart(e as unknown as PointerEvent, elementId);
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          onDragEnd(e as unknown as PointerEvent);
        }}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <DrawElement position="top" />
      <div className="flex flex-col gap-y-2" id={`${side}-stack`}>
        <AnimatePresence mode="wait">
          {renderBlocks(count, side)}
        </AnimatePresence>
      </div>
      <DrawElement position="bottom" />
    </div>
  );
}