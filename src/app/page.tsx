'use client'
import Image from "next/image";
import { motion } from "motion/react";
import Stacks from "./components/Stacks";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Stacks />
    </div>
  );
}

