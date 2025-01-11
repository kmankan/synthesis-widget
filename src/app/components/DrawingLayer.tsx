import { Point } from '@/types';
import { motion } from 'motion/react';

interface DrawingLayerProps {
  startPoint: Point;
  endPoint: Point;
  isDrawing: boolean;
}

const DrawingLayer = ({ startPoint, endPoint, isDrawing }: DrawingLayerProps) => {
  if (!startPoint || !endPoint) return null;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <motion.line
        x1={startPoint.x}
        y1={startPoint.y}
        x2={endPoint.x}
        y2={endPoint.y}
        stroke="#A8DDFF"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: isDrawing ? 1 : 0,
          opacity: isDrawing ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
};

export default DrawingLayer;