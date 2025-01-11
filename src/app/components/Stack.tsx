import { AnimatePresence } from "motion/react";
import Block from "./Block";
import { Stacks, SetStacks, Point } from "@/types";
import { useRef, useEffect } from 'react';

interface StackProps {
  side: Stacks,
  count: number,
  setLeftStack: SetStacks,
  setRightStack: SetStacks,
  isDrawing: boolean,
  setIsDrawing: (drawing: boolean) => void,
  startPoint: Point,
  setStartPoint: (point: Point) => void,
  currentPoint: Point,
  setCurrentPoint: (point: Point) => void
}

export default function Stack(
  { side,
    count,
    setLeftStack,
    setRightStack,
    isDrawing,
    setIsDrawing,
    startPoint,
    setStartPoint,
    currentPoint,
    setCurrentPoint
  }: StackProps) {

  // Refs for the draw elements
  const topElementRef = useRef<HTMLDivElement>(null);
  const bottomElementRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (elementRef: React.RefObject<HTMLDivElement | null>, position: 'top' | 'bottom') => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    console.log('rect', rect);
    const point = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      position: position,
      whichStack: side
    };

    setStartPoint(point);
    setCurrentPoint(point);
    setIsDrawing(true);
  };

  const handleDragEnd = (elementRef: React.RefObject<HTMLDivElement | null>, position: 'top' | 'bottom') => {
    if (!elementRef.current || !startPoint) return;

    const rect = elementRef.current.getBoundingClientRect();
    const endPoint = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      position: position,
      whichStack: side
    };

    // Validate connection
    const isValidConnection = validateConnection(startPoint, endPoint);

    if (isValidConnection) {
      // Handle successful connection
      console.log(`Valid connection made from ${startPoint.whichStack} ${startPoint.position} to ${side} ${position}`);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
  };

  const validateConnection = (start: Point, end: Point): boolean => {
    if (!start || !end) return false;

    // Only allow connections between different stacks
    if (start.whichStack === end.whichStack) return false;

    // Only allow top-to-top or bottom-to-bottom connections
    return start.position === end.position;
  };

  // Handle mouse movement for line drawing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDrawing) {
        setCurrentPoint({
          x: e.clientX,
          y: e.clientY,
          position: startPoint?.position || 'top',
          whichStack: side
        });
      }
    };

    if (isDrawing) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDrawing, setCurrentPoint, startPoint, side]);

  const renderBlocks = (count: number, whichStack: Stacks) => {
    // an array to store the block components
    const blocks = [];
    // loop through the count and add n block components to the array
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
  }


  // const DrawElement = () => {
  //   return (
  //     <div className="w-12 h-12 2xl:w-16 2xl:h-16 border-2 border-gray-300">
  //     </div>
  //   )
  // }

  return (
    <div className="flex flex-col items-center">
      {/* Top Draw Element */}
      <div
        ref={topElementRef}
        className={`w-12 h-12 2xl:w-16 2xl:h-16 border-2 cursor-pointer
          ${isDrawing && startPoint?.position === 'top'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        onMouseDown={() => handleDragStart(topElementRef, 'top')}
        onMouseUp={() => handleDragEnd(topElementRef, 'top')}
      />

      <div className="flex flex-col gap-y-0" id={`${side}-stack`}>
        <AnimatePresence mode="popLayout">
          {renderBlocks(count, side)}
        </AnimatePresence>
      </div>

      {/* Bottom Draw Element */}
      <div
        ref={bottomElementRef}
        className={`w-12 h-12 2xl:w-16 2xl:h-16 border-2 cursor-pointer
          ${isDrawing && startPoint?.position === 'bottom'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        onMouseDown={() => handleDragStart(bottomElementRef, 'bottom')}
        onMouseUp={() => handleDragEnd(bottomElementRef, 'bottom')}
      />
    </div>
  )
}