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
import { Textarea } from '@/components/ui/textarea';
import { Building } from '@/types/navigation';
import { Save } from 'lucide-react';

interface EditBuildingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building: Building | null;
  onSave: (id: string, updates: Partial<Building>) => void;
}

export function EditBuildingDialog({
  open,
  onOpenChange,
  building,
  onSave,
}: EditBuildingDialogProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [floors, setFloors] = useState('3');

  useEffect(() => {
    if (building) {
      setName(building.name);
      setCode(building.code);
      setDescription(building.description || '');
      setFloors(String(building.floors));
    }
  }, [building]);

  const handleSave = () => {
    if (!building || !name.trim()) return;
    
    onSave(building.id, {
      name: name.trim(),
      code: code.trim() || name.slice(0, 3).toUpperCase(),
      description: description.trim() || undefined,
      floors: parseInt(floors) || 3,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Edit Building</DialogTitle>
          <DialogDescription>
            Update building information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Building Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Academic Block"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., MAB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">Number of Floors</Label>
              <Input
                id="floors"
                type="number"
                min="1"
                value={floors}
                onChange={(e) => setFloors(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
