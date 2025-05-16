// app/page.tsx
import DataGrid from '@/components/data-grid';

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">EdgeSheet – Playground</h1>
      <DataGrid />
    </main>
  );
}