
export default function AddBlock({ side, count, max_stack_size, handleAddBlock }: { side: "left" | "right", count: number, max_stack_size: number, handleAddBlock: (side: "left" | "right") => void }) {
  return (
    <button
      onClick={() => handleAddBlock(side)}
      disabled={count >= max_stack_size}
      className={`mt-4 px-4 py-2 rounded-lg ${count >= max_stack_size
        ? 'bg-gray-300 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-bold`}
    >
      Add Block
    </button>
  )
}