import { SetStacks, SetMode, ControlPanelProps, SetAnimate } from "@/types";
import { MAX_STACK_SIZE } from "./InteractiveStacks";
import { SquarePlay } from "lucide-react";

// This controller allows the user to add or remove blocks from the stack
const StackController = ({ stack, setStack }: { stack: number, setStack: SetStacks }) => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <button
        onClick={() => setStack(stack - 1)}
        disabled={stack === 0}
        className="disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
      >-</button>
      <div className="text-lg font-bold border-2 border-gray-300 rounded-md px-4 py-1">{stack}</div>
      <button
        onClick={() => setStack(stack + 1)}
        disabled={stack === MAX_STACK_SIZE}
        className="disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
      >+</button>
    </div >
  )
}

// This controller allows the user to change the mode of interaction
// Radio button version of the mode controller
const ModeControllerRadio = ({ mode, setMode }: { mode: string, setMode: SetMode }) => {
  return (
    <div className="flex items-center justify-center gap-x-4">
      <label className="flex items-center gap-x-2">
        <input
          type="radio"
          name="mode"
          value="addRemove"
          checked={mode === 'addRemove'}
          onChange={() => setMode('addRemove')}
        />
        Add or Remove
      </label>
      <label className="flex items-center gap-x-2">
        <input
          type="radio"
          name="mode"
          value="draw"
          checked={mode === 'draw'}
          onChange={() => setMode('draw')}
        />
        Draw
      </label>
    </div>
  )
}
// Drop down version of the mode controller
const ModeControllerDropdown = ({ mode, setMode }: { mode: string, setMode: SetMode }) => {
  return (
    <div className="flex items-center justify-center">
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-md"
      >
        <option value="addRemove">Add or Remove</option>
        <option value="draw">Draw</option>
      </select>
    </div>
  )
}

const AnimationController = ({ animate, setAnimate }: { animate: boolean, setAnimate: SetAnimate }) => {
  return (
    <button onClick={() => setAnimate(!animate)}>
      <SquarePlay strokeWidth={1.5} className="w-10 h-10" />
    </button>
  )
}

// This is a horizontal control panel that allows the user to:
//  1. add/remove blocks from the stacks; 
//  2. change the mode of interaction;
//  3. animate the comparison of stacks
export default function ControlPanel({ leftStack, rightStack, setLeftStack, setRightStack, setMode, mode, animate, setAnimate }: ControlPanelProps) {
  return (
    <div className="w-[80%] mx-auto mb-4">
      <div className="flex justify-between items-center border-2 border-gray-300 rounded-md py-4">
        <div className="w-1/4 flex items-center justify-center">
          <ModeControllerRadio mode={mode} setMode={setMode} />
        </div>
        <div className="w-2/4 flex items-center justify-center gap-x-32">
          <StackController stack={leftStack} setStack={setLeftStack} />
          <div className="p-6"></div>
          <StackController stack={rightStack} setStack={setRightStack} />
        </div>
        <div className="w-1/4 flex items-center justify-center">
          <AnimationController animate={animate} setAnimate={setAnimate} />
        </div>
      </div>
    </div>
  )
}