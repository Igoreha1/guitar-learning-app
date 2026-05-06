"use client";

import Link from "next/link";
import { ChevronRight, Home, Guitar } from "lucide-react";
import ChordGenerator from "@/features/chords/ChordGenerator";

export default function ChordGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-gray-dark to-darker">
      {/* Основной контент */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <ChordGenerator />
        </div>
      </section>
    </div>
  );
}