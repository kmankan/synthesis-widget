import { AnimatePresence } from "framer-motion";
import Block from "./Block";
import { Stacks, SetStacks } from "@/types";

export default function Stack(
  { side, count, setLeftStack, setRightStack }:
    { side: Stacks, count: number, setLeftStack: SetStacks, setRightStack: SetStacks }
) {
  const renderBlocks = (count: number, whichStack: Stacks) => {
    // an array to store the block components
    const blocks = [];
    // loop through the count and add n block components to the array
    for (let i = 0; i < count; i++) {
      blocks.push(<Block key={i} whichStack={whichStack} setLeftStack={setLeftStack} setRightStack={setRightStack} />);
    }
    return blocks;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-y-2" id={`${side}-stack`}>
        <AnimatePresence mode="wait">
          {renderBlocks(count, side)}
        </AnimatePresence>
      </div>
    </div>
  )
}