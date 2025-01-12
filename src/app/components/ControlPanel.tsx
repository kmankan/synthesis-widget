import type { SetStacks, ControlPanelProps, SetAnimate, ModeControllerProps, Mode } from "@/types";
import { MAX_STACK_SIZE } from "./InteractiveStacks";
import { SquarePlay } from "lucide-react";
import { useModeStore } from "@/app/store/modeStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// This controller allows the user to add or remove blocks from the stack
const StackController = ({ mode, stack, setStack }: { mode: Mode, stack: number, setStack: SetStacks }) => {
  const [inputValue, setInputValue] = useState<string>(stack.toString()); // needs to be a string to handle empty input

  // Update the input value when the stack number changes
  useEffect(() => {
    setInputValue(stack.toString());
  }, [stack]);

  // Update the stack number when the input value changes to a valid number
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    const newStackValue = parseInt(newInputValue); // parseInt will return NaN if the input is not a number
    // make sure the input is a number, and within the range of 0 to MAX_STACK_SIZE
    if (!isNaN(newStackValue) && newStackValue >= 0 && newStackValue <= MAX_STACK_SIZE) {
      setStack(newStackValue);
    }
  }

  return (
    <div className="flex items-center justify-center gap-x-1">
      <div className="flex items-center justify-center w-3">
        <button
          onClick={() => setStack(stack - 1)}
          disabled={stack === 0 || mode === 'draw'}
          className="disabled:opacity-10 disabled:cursor-not-allowed text-lg font-bold"
        >-</button>
      </div>
      <div className="flex items-center justify-center text-2xl font-bold border-2 border-[#90c1df] rounded-md w-12 py-1">
        <input
          type="number"
          value={inputValue}
          min={0}
          max={MAX_STACK_SIZE}
          onChange={handleInputChange}
          className="text-center bg-[#f2fbff0a] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={mode === 'draw'}
        />
        {/* {stack} */}
      </div>
      <div className="flex items-center justify-center w-3">
        <button
          onClick={() => setStack(stack + 1)}
          disabled={stack === MAX_STACK_SIZE || mode === 'draw'}
          className="disabled:opacity-10 disabled:cursor-not-allowed text-lg font-bold"
        >+</button>
      </div >
    </div>
  )
}

// Radio button version of the mode controller
// This controller allows the user to change the mode of interaction
// const ModeControllerRadio = ({ mode, setMode }: ModeControllerProps) => {
//   return (
//     <div className="flex items-center justify-center gap-x-4">
//       <label className="flex items-center gap-x-2">
//         <input
//           type="radio"
//           name="mode"
//           value="addRemove"
//           checked={mode === 'addRemove'}
//           onChange={() => setMode('addRemove')}
//         />
//         Stack
//       </label>
//       <label className="flex items-center gap-x-2">
//         <input
//           type="radio"
//           name="mode"
//           value="draw"
//           checked={mode === 'draw'}
//           onChange={() => setMode('draw')}
//         />
//         Draw
//       </label>
//     </div>
//   )
// }

//Drop down version of the mode controller
// This controller allows the user to change the mode of interaction
const ModeControllerDropdown = ({ mode, setMode }: ModeControllerProps) => {
  const { showLines, setShowLines } = useModeStore();

  return (
    <div className="flex items-center justify-start gap-x-2 w-[220px]">
      <select
        value={mode}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'addRemove' || value === 'draw') {
            setMode(value);
          }
        }}
        className="px-1 py-2 border-2 border-[#90c1df] bg-[#f2fbff5e] rounded-md"
      >
        <option value="addRemove">Modify Stack</option>
        <option value="draw">Draw Lines</option>
      </select>
      {mode === 'draw' ? (
        <div className="flex flex-col gap-y-1">
          <label className="flex items-center gap-x-2">
            <input
              type="radio"
              name="lineVisibility"
              value="show"
              checked={showLines}
              onChange={() => setShowLines(true)}
              className="w-4 h-4"
            />
            <span>Show</span>
          </label>
          <label className="flex items-center gap-x-2">
            <input
              type="radio"
              name="lineVisibility"
              value="hide"
              checked={!showLines}
              onChange={() => setShowLines(false)}
              className="w-4 h-4"
            />
            <span>Hide</span>
          </label>
        </div>
      ) : null}
    </div>
  )
}

const AnimationController = ({ animate, setAnimate }: { animate: boolean, setAnimate: SetAnimate }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.button
        onClick={() => setAnimate(!animate)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <SquarePlay strokeWidth={1.5} className="w-12 h-12 hover:fill-white" />
      </motion.button>
      <p className="text-sm text-center">Animate</p>
    </div>


  )
}

// This is a horizontal control panel that allows the user to:
//  1. add/remove blocks from the stacks; 
//  2. change the mode of interaction;
//  3. animate the comparison of stacks
export default function ControlPanel({ leftStack, rightStack, setLeftStack, setRightStack, animate, setAnimate }: ControlPanelProps) {
  const { mode, setMode } = useModeStore();

  return (
    <div className="w-[90%] mx-auto mb-3">
      <div className="flex justify-between items-center bg-[#f2fbff5e] border-2 border-sky-100 rounded-md h-[80px]">
        <div className="w-1/4 flex items-center justify-center">
          <ModeControllerDropdown mode={mode} setMode={setMode} />
        </div>
        {/* Container for stack controllers */}
        <div className="grow flex items-center justify-between px-11">
          <StackController mode={mode} stack={leftStack} setStack={setLeftStack} />
          <StackController mode={mode} stack={rightStack} setStack={setRightStack} />
        </div>
        <div className="w-1/4 flex items-center justify-center">
          {mode === 'draw' ? <AnimationController animate={animate} setAnimate={setAnimate} /> : null}
        </div>
      </div>
    </div>
  )
}