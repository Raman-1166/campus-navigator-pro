import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Floor } from '@/types/navigation';
import { Save } from 'lucide-react';

interface EditFloorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  floor: Floor | null;
  onSave: (id: string, updates: Partial<Floor>) => void;
}

export function EditFloorDialog({
  open,
  onOpenChange,
  floor,
  onSave,
}: EditFloorDialogProps) {
  const [floorNumber, setFloorNumber] = useState('0');
  const [name, setName] = useState('');
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('600');

  useEffect(() => {
    if (floor) {
      setFloorNumber(String(floor.floorNumber));
      setName(floor.name);
      setWidth(String(floor.width));
      setHeight(String(floor.height));
    }
  }, [floor]);

  const handleSave = () => {
    if (!floor) return;
    
    onSave(floor.id, {
      floorNumber: parseInt(floorNumber) || 0,
      name: name.trim() || `Floor ${floorNumber}`,
      width: parseInt(width) || 800,
      height: parseInt(height) || 600,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Floor</DialogTitle>
          <DialogDescription>
            Update floor details and dimensions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floorNumber">Floor Number</Label>
              <Input
                id="floorNumber"
                type="number"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Floor Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Ground Floor"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Canvas Width</Label>
              <Input
                id="width"
                type="number"
                min="100"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Canvas Height</Label>
              <Input
                id="height"
                type="number"
                min="100"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
