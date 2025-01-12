import { ChevronRight, ChevronLeft, Equal } from 'lucide-react';

export default function ComparisonSymbol({ leftStack, rightStack }: { leftStack: number, rightStack: number }) {
  // get comparison symbol between stacks
  const getComparisonSymbol = (leftStack: number, rightStack: number) => {
    if (leftStack > rightStack) return (
      <ChevronRight
        size={72}
        strokeWidth={3}
        color="#A8DDFF"
        className="filter drop-shadow-[0_0_8px_rgba(168,221,255,0.7)]"
      />
    );
    if (leftStack < rightStack) return (
      <ChevronLeft
        size={72}
        strokeWidth={3}
        color="#A8DDFF"
        className="filter drop-shadow-[0_0_8px_rgba(168,221,255,0.7)]"
      />
    );
    return (
      <Equal
        size={72}
        strokeWidth={3}
        color="#75C2FF"
        className="filter drop-shadow-[0_0_8px_rgba(117,194,255,0.7)]"
      />
    );
  };

  return (
    <div>
      {getComparisonSymbol(leftStack, rightStack)}
    </div>
  )
}