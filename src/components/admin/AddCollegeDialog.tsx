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
import { College } from '@/types/navigation';
import { Plus } from 'lucide-react';

interface AddCollegeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (college: Omit<College, 'id' | 'createdAt'>) => void;
}

export function AddCollegeDialog({
    open,
    onOpenChange,
    onAdd,
}: AddCollegeDialogProps) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState('0');
    const [lng, setLng] = useState('0');

    const handleAdd = () => {
        if (!name.trim()) return;

        onAdd({
            name: name.trim(),
            address: address.trim(),
            description: description.trim() || undefined,
            status: 'active',
            gpsLocation: {
                lat: parseFloat(lat) || 0,
                lng: parseFloat(lng) || 0,
            },
        });

        // Reset form
        setName('');
        setAddress('');
        setDescription('');
        setLat('0');
        setLng('0');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New College</DialogTitle>
                    <DialogDescription>
                        Enter details for the new college.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">College Name *</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Delhi Technical University"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Full address"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the college"
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input
                                id="lat"
                                type="number"
                                step="any"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lng">Longitude</Label>
                            <Input
                                id="lng"
                                type="number"
                                step="any"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={!name.trim()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add College
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
