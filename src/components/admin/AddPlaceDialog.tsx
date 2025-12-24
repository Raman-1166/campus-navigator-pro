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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Place, PlaceType } from '@/types/navigation';
import { Plus } from 'lucide-react';

const placeTypes: PlaceType[] = [
    'classroom', 'laboratory', 'office', 'canteen', 'auditorium',
    'library', 'restroom', 'stairs', 'lift', 'entrance', 'exit',
    'corridor', 'sports', 'parking', 'other'
];

interface AddPlaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    floorId: string | null;
    buildingId: string | null;
    onAdd: (place: Omit<Place, 'id'>) => void;
}

export function AddPlaceDialog({
    open,
    onOpenChange,
    floorId,
    buildingId,
    onAdd,
}: AddPlaceDialogProps) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState<PlaceType>('classroom');
    const [description, setDescription] = useState('');
    const [posX, setPosX] = useState('400');
    const [posY, setPosY] = useState('300');

    const handleAdd = () => {
        if (!floorId || !buildingId || !name.trim()) return;

        onAdd({
            floorId,
            buildingId,
            name: name.trim(),
            code: code.trim() || undefined,
            type,
            description: description.trim() || undefined,
            position: {
                x: parseInt(posX) || 400,
                y: parseInt(posY) || 300,
            },
            isNode: true, // Default to true
        });

        // Reset form
        setName('');
        setCode('');
        setType('classroom');
        setDescription('');
        setPosX('400');
        setPosY('300');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>Add New Place</DialogTitle>
                    <DialogDescription>
                        Enter details for the new place.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Place Name *</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Room 101"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g., 101"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as PlaceType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {placeTypes.map(t => (
                                    <SelectItem key={t} value={t} className="capitalize">
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="posX">X Position</Label>
                            <Input
                                id="posX"
                                type="number"
                                value={posX}
                                onChange={(e) => setPosX(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="posY">Y Position</Label>
                            <Input
                                id="posY"
                                type="number"
                                value={posY}
                                onChange={(e) => setPosY(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={!name.trim() || !floorId}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Place
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
