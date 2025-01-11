import { ChevronRight, ChevronLeft, Equal } from 'lucide-react';

export default function ComparisonSymbol({ leftStack, rightStack }: { leftStack: number, rightStack: number }) {
  // get comparison symbol between stacks
  const getComparisonSymbol = (leftStack: number, rightStack: number) => {
    if (leftStack > rightStack) return <ChevronRight size={48} strokeWidth={3} color="#A8DDFF" />;
    if (leftStack < rightStack) return <ChevronLeft size={48} strokeWidth={3} color="#A8DDFF" />;
    return <Equal size={48} strokeWidth={3} color="#75C2FF" />;
  };

  return (
    <div className="text-4xl font-bold">
      {getComparisonSymbol(leftStack, rightStack)}
    </div>
  )
}