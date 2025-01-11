import { AnimatePresence } from "framer-motion";
import Block from "./Block";

type Stacks = "left" | "right";
type SetStacks = React.Dispatch<React.SetStateAction<number>>;

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
      <div className="mt-4 text-lg font-bold">Count: {count}</div>
      <div className="flex flex-col gap-y-2" id={`${side}-stack`}>
        <AnimatePresence mode="wait">
          {renderBlocks(count, side)}
        </AnimatePresence>
      </div>
    </div>
  )
}