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
import { Textarea } from '@/components/ui/textarea';
import { Building } from '@/types/navigation';
import { Plus } from 'lucide-react';

interface AddBuildingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    collegeId: string | null;
    onAdd: (building: Omit<Building, 'id'>) => void;
}

export function AddBuildingDialog({
    open,
    onOpenChange,
    collegeId,
    onAdd,
}: AddBuildingDialogProps) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [floors, setFloors] = useState('3');

    const handleAdd = () => {
        if (!collegeId || !name.trim()) return;

        onAdd({
            collegeId,
            name: name.trim(),
            code: code.trim() || name.slice(0, 3).toUpperCase(),
            description: description.trim() || undefined,
            floors: parseInt(floors) || 3,
        });

        // Reset form
        setName('');
        setCode('');
        setDescription('');
        setFloors('3');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Add New Building</DialogTitle>
                    <DialogDescription>
                        Enter details for the new building.
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
                    <Button onClick={handleAdd} disabled={!name.trim() || !collegeId}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Building
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
