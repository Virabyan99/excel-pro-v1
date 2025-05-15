import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StyleLab() {
  return (
    <main className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold">Style Lab</h1>
      <Card className="max-w-sm">
        <CardContent className="space-y-4 pt-6">
          <p>Interact with components under both themes.</p>
          <Button>Primary Action</Button>
        </CardContent>
      </Card>
    </main>
  );
}