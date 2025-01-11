"use client"

import React, { useState, useRef } from 'react';

const InteractiveConnector = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [connections, setConnections] = useState([]);
  const containerRef = useRef(null);

  const getRelativeCoordinates = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e, boxId) => {
    const coords = getRelativeCoordinates(e);
    setIsDrawing(true);
    setStartPoint({ x: coords.x, y: coords.y, boxId });
    setCurrentLine({
      x1: coords.x,
      y1: coords.y,
      x2: coords.x,
      y2: coords.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const coords = getRelativeCoordinates(e);
    setCurrentLine(prev => ({
      ...prev,
      x2: coords.x,
      y2: coords.y
    }));
  };

  const handleMouseUp = (e, boxId) => {
    if (!isDrawing) return;

    const coords = getRelativeCoordinates(e);
    if (startPoint.boxId !== boxId) {
      // Add the completed connection to our connections array
      setConnections(prev => [...prev, {
        id: `${startPoint.boxId}-${boxId}-${Date.now()}`,
        x1: startPoint.x,
        y1: startPoint.y,
        x2: coords.x,
        y2: coords.y,
        from: startPoint.boxId,
        to: boxId
      }]);
    }

    // Clear the current drawing line
    setCurrentLine(null);
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleDeleteConnection = (connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-96 bg-gray-50"
      onMouseMove={handleMouseMove}
      onMouseUp={() => {
        if (isDrawing) {
          setIsDrawing(false);
          setCurrentLine(null);
          setStartPoint(null);
        }
      }}
    >
      {/* Box 1 */}
      <div
        className="absolute top-8 left-96 w-24 h-24 border-2 border-blue-500 cursor-pointer"
        onMouseDown={(e) => handleMouseDown(e, 'box1')}
        onMouseUp={(e) => handleMouseUp(e, 'box1')}
      />

      {/* Box 2 */}
      <div
        className="absolute top-8 right-96 w-24 h-24 border-2 border-blue-500 cursor-pointer"
        onMouseDown={(e) => handleMouseDown(e, 'box2')}
        onMouseUp={(e) => handleMouseUp(e, 'box2')}
      />

      {/* SVG overlay for drawing lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Render all completed connections */}
        {connections.map(conn => (
          <g key={conn.id}>
            <line
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="#3B82F6"
              strokeWidth="2"
            />
            {/* Optional: Add a delete button for each connection */}
            <circle
              cx={(conn.x1 + conn.x2) / 2}
              cy={(conn.y1 + conn.y2) / 2}
              r="6"
              fill="red"
              className="cursor-pointer"
              onClick={() => handleDeleteConnection(conn.id)}
              style={{ pointerEvents: 'all' }}
            />
          </g>
        ))}

        {/* Render the current drawing line */}
        {currentLine && (
          <line
            x1={currentLine.x1}
            y1={currentLine.y1}
            x2={currentLine.x2}
            y2={currentLine.y2}
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="4"
          />
        )}
      </svg>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-gray-600">
        Click and drag from one box to another to create a connection.
        Click the red dot to delete a connection.
      </div>
    </div>
  );
};

export default InteractiveConnector;