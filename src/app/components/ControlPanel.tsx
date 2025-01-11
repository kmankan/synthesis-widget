import { Stacks, SetStacks } from "@/types";
// This is a horizontal control panel that allows the user to add/remove blocks from the stacks and change the mode of interaction

const StackController = ({ stack, setStack }: { stack: number, setStack: SetStacks }) => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <button onClick={() => setStack(stack - 1)}>-</button>
      <div className="text-lg font-bold border-2 border-gray-300 rounded-md px-2 py-1">{stack}</div>
      <button onClick={() => setStack(stack + 1)}>+</button>
    </div>
  )
}

export default function ControlPanel({ leftStack, rightStack, setLeftStack, setRightStack }: { leftStack: number, rightStack: number, setLeftStack: SetStacks, setRightStack: SetStacks }) {
  return (
    <div className="flex items-center justify-between border-2 border-gray-300 rounded-md px-4 py-1">
      <StackController stack={leftStack} setStack={setLeftStack} />
      <StackController stack={rightStack} setStack={setRightStack} />
    </div>
  )
}