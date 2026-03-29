import ChordLibrary from "@/features/chords/ChordLibrary";

export default function ChordsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <ChordLibrary />
      </div>
    </div>
  );
}