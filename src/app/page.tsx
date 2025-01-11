'use client'
import Image from "next/image";
import IsometricCube from "./components/IsometricCube";
import { motion } from "motion/react";

export default function Home() {
  return (
    <motion.div>
      <h1>Hello World</h1>
      <IsometricCube width="100px" height="100px" />
    </motion.div>
  );
}

