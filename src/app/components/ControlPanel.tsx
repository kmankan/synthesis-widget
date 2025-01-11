import { Stacks, SetStacks } from "@/types";
import { MAX_STACK_SIZE } from "./InteractiveStacks";
// This is a horizontal control panel that allows the user to add/remove blocks from the stacks and change the mode of interaction

const StackController = ({ stack, setStack }: { stack: number, setStack: SetStacks }) => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <button
        onClick={() => setStack(stack - 1)}
        disabled={stack === 0}
        className="disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
      >-</button>
      <div className="text-lg font-bold border-2 border-gray-300 rounded-md px-4 py-1">{stack}</div>
      <button
        onClick={() => setStack(stack + 1)}
        disabled={stack === MAX_STACK_SIZE}
        className="disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
      >+</button>
    </div >
  )
}

export default function ControlPanel({ leftStack, rightStack, setLeftStack, setRightStack }: { leftStack: number, rightStack: number, setLeftStack: SetStacks, setRightStack: SetStacks }) {
  return (
    <div className="flex items-center justify-center border-2 gap-x-64 border-gray-300 rounded-md py-8">
      <StackController stack={leftStack} setStack={setLeftStack} />
      <StackController stack={rightStack} setStack={setRightStack} />
    </div>
  )
}