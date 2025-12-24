import { useState } from 'react';
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
import { Plus } from 'lucide-react';

interface AddFloorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    buildingId: string | null;
    onAdd: (floor: Omit<Floor, 'id'>) => void;
}

export function AddFloorDialog({
    open,
    onOpenChange,
    buildingId,
    onAdd,
}: AddFloorDialogProps) {
    const [floorNumber, setFloorNumber] = useState('0');
    const [name, setName] = useState('');
    const [width, setWidth] = useState('800');
    const [height, setHeight] = useState('600');

    const handleAdd = () => {
        if (!buildingId) return;

        onAdd({
            buildingId,
            floorNumber: parseInt(floorNumber) || 0,
            name: name.trim() || `Floor ${floorNumber}`,
            width: parseInt(width) || 800,
            height: parseInt(height) || 600,
        });

        // Reset form
        setFloorNumber('0');
        setName('');
        // width/height keep default
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Add New Floor</DialogTitle>
                    <DialogDescription>
                        Enter details for the new floor.
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
                    <Button onClick={handleAdd} disabled={!buildingId}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Floor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
