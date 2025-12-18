import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building2, 
  Layers, 
  MapPin, 
  Plus, 
  Trash2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useNavigationStore } from '@/store/navigation-store';
import { PlaceType } from '@/types/navigation';
import { toast } from '@/hooks/use-toast';

const placeTypes: PlaceType[] = [
  'classroom', 'laboratory', 'office', 'canteen', 'auditorium', 
  'library', 'restroom', 'stairs', 'lift', 'entrance', 'exit', 
  'corridor', 'sports', 'parking', 'other'
];

const Admin = () => {
  const {
    colleges,
    buildings,
    floors,
    places,
    selectedCollegeId,
    selectedBuildingId,
    selectedFloorId,
    setSelectedCollege,
    setSelectedBuilding,
    setSelectedFloor,
    addCollege,
    addBuilding,
    addFloor,
    addPlace,
    deletePlace
  } = useNavigationStore();

  const [activeTab, setActiveTab] = useState<'colleges' | 'buildings' | 'floors' | 'places'>('colleges');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [collegeName, setCollegeName] = useState('');
  const [collegeAddress, setCollegeAddress] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [buildingCode, setBuildingCode] = useState('');
  const [buildingFloors, setBuildingFloors] = useState('3');
  const [floorNumber, setFloorNumber] = useState('0');
  const [floorName, setFloorName] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [placeCode, setPlaceCode] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('classroom');
  const [placeX, setPlaceX] = useState('400');
  const [placeY, setPlaceY] = useState('300');

  const filteredBuildings = buildings.filter(b => b.collegeId === selectedCollegeId);
  const filteredFloors = floors.filter(f => f.buildingId === selectedBuildingId);
  const filteredPlaces = places.filter(p => p.floorId === selectedFloorId);

  const handleAddCollege = () => {
    if (!collegeName.trim()) {
      toast({ title: 'Error', description: 'College name is required', variant: 'destructive' });
      return;
    }
    addCollege({
      name: collegeName,
      address: collegeAddress,
      gpsLocation: { lat: 0, lng: 0 }
    });
    setCollegeName('');
    setCollegeAddress('');
    setShowAddForm(false);
    toast({ title: 'Success', description: 'College added successfully' });
  };

  const handleAddBuilding = () => {
    if (!selectedCollegeId) {
      toast({ title: 'Error', description: 'Select a college first', variant: 'destructive' });
      return;
    }
    if (!buildingName.trim()) {
      toast({ title: 'Error', description: 'Building name is required', variant: 'destructive' });
      return;
    }
    addBuilding({
      collegeId: selectedCollegeId,
      name: buildingName,
      code: buildingCode || buildingName.slice(0, 3).toUpperCase(),
      floors: parseInt(buildingFloors) || 3
    });
    setBuildingName('');
    setBuildingCode('');
    setBuildingFloors('3');
    setShowAddForm(false);
    toast({ title: 'Success', description: 'Building added successfully' });
  };

  const handleAddFloor = () => {
    if (!selectedBuildingId) {
      toast({ title: 'Error', description: 'Select a building first', variant: 'destructive' });
      return;
    }
    addFloor({
      buildingId: selectedBuildingId,
      floorNumber: parseInt(floorNumber) || 0,
      name: floorName || `Floor ${floorNumber}`,
      width: 800,
      height: 600
    });
    setFloorNumber('0');
    setFloorName('');
    setShowAddForm(false);
    toast({ title: 'Success', description: 'Floor added successfully' });
  };

  const handleAddPlace = () => {
    if (!selectedFloorId || !selectedBuildingId) {
      toast({ title: 'Error', description: 'Select a floor first', variant: 'destructive' });
      return;
    }
    if (!placeName.trim()) {
      toast({ title: 'Error', description: 'Place name is required', variant: 'destructive' });
      return;
    }
    addPlace({
      floorId: selectedFloorId,
      buildingId: selectedBuildingId,
      name: placeName,
      code: placeCode || undefined,
      type: placeType,
      position: { x: parseInt(placeX) || 400, y: parseInt(placeY) || 300 },
      isNode: true
    });
    setPlaceName('');
    setPlaceCode('');
    setPlaceType('classroom');
    setPlaceX('400');
    setPlaceY('300');
    setShowAddForm(false);
    toast({ title: 'Success', description: 'Place added successfully' });
  };

  const handleDeletePlace = (placeId: string) => {
    deletePlace(placeId);
    toast({ title: 'Deleted', description: 'Place removed successfully' });
  };

  const tabs = [
    { id: 'colleges', label: 'Colleges', icon: Building2, count: colleges.length },
    { id: 'buildings', label: 'Buildings', icon: Building2, count: filteredBuildings.length },
    { id: 'floors', label: 'Floors', icon: Layers, count: filteredFloors.length },
    { id: 'places', label: 'Places', icon: MapPin, count: filteredPlaces.length }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-card">
              <Settings className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage campus data</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setShowAddForm(false);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-card' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                <Badge variant={isActive ? "secondary" : "outline"} className="ml-1">
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Selection breadcrumb */}
        <Card className="bg-secondary/30">
          <CardContent className="py-3 flex flex-wrap items-center gap-2">
            <Select value={selectedCollegeId || ''} onValueChange={setSelectedCollege}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select college" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCollegeId && (
              <Select value={selectedBuildingId || ''} onValueChange={setSelectedBuilding}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBuildings.map(b => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedBuildingId && (
              <Select value={selectedFloorId || ''} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {filteredFloors.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* List View */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg capitalize">{activeTab}</CardTitle>
                <CardDescription>Manage {activeTab} data</CardDescription>
              </div>
              <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "outline" : "default"}>
                {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {showAddForm ? 'Cancel' : 'Add New'}
              </Button>
            </CardHeader>
            <CardContent>
              {/* Add Forms */}
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 p-4 border border-border rounded-lg bg-secondary/30"
                >
                  {activeTab === 'colleges' && (
                    <div className="space-y-4">
                      <div>
                        <Label>College Name</Label>
                        <Input 
                          value={collegeName} 
                          onChange={(e) => setCollegeName(e.target.value)}
                          placeholder="e.g., Delhi Technical University"
                        />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input 
                          value={collegeAddress} 
                          onChange={(e) => setCollegeAddress(e.target.value)}
                          placeholder="Full address"
                        />
                      </div>
                      <Button onClick={handleAddCollege}>
                        <Save className="h-4 w-4 mr-2" />
                        Add College
                      </Button>
                    </div>
                  )}

                  {activeTab === 'buildings' && (
                    <div className="space-y-4">
                      <div>
                        <Label>Building Name</Label>
                        <Input 
                          value={buildingName} 
                          onChange={(e) => setBuildingName(e.target.value)}
                          placeholder="e.g., Main Academic Block"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Code</Label>
                          <Input 
                            value={buildingCode} 
                            onChange={(e) => setBuildingCode(e.target.value)}
                            placeholder="e.g., MAB"
                          />
                        </div>
                        <div>
                          <Label>Number of Floors</Label>
                          <Input 
                            type="number"
                            value={buildingFloors} 
                            onChange={(e) => setBuildingFloors(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddBuilding}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Building
                      </Button>
                    </div>
                  )}

                  {activeTab === 'floors' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Floor Number</Label>
                          <Input 
                            type="number"
                            value={floorNumber} 
                            onChange={(e) => setFloorNumber(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Floor Name</Label>
                          <Input 
                            value={floorName} 
                            onChange={(e) => setFloorName(e.target.value)}
                            placeholder="e.g., Ground Floor"
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddFloor}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Floor
                      </Button>
                    </div>
                  )}

                  {activeTab === 'places' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Place Name</Label>
                          <Input 
                            value={placeName} 
                            onChange={(e) => setPlaceName(e.target.value)}
                            placeholder="e.g., Room 101"
                          />
                        </div>
                        <div>
                          <Label>Code</Label>
                          <Input 
                            value={placeCode} 
                            onChange={(e) => setPlaceCode(e.target.value)}
                            placeholder="e.g., 101"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={placeType} onValueChange={(v) => setPlaceType(v as PlaceType)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {placeTypes.map(type => (
                              <SelectItem key={type} value={type} className="capitalize">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>X Position</Label>
                          <Input 
                            type="number"
                            value={placeX} 
                            onChange={(e) => setPlaceX(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Y Position</Label>
                          <Input 
                            type="number"
                            value={placeY} 
                            onChange={(e) => setPlaceY(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddPlace}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Place
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* List Items */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {activeTab === 'colleges' && colleges.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.address}</p>
                    </div>
                  </div>
                ))}

                {activeTab === 'buildings' && filteredBuildings.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{item.code}</Badge>
                        <span className="text-xs text-muted-foreground">{item.floors} floors</span>
                      </div>
                    </div>
                  </div>
                ))}

                {activeTab === 'floors' && filteredFloors.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <span className="text-xs text-muted-foreground">Floor {item.floorNumber}</span>
                    </div>
                  </div>
                ))}

                {activeTab === 'places' && filteredPlaces.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <div className="flex items-center gap-2">
                        {item.code && <Badge variant="secondary">{item.code}</Badge>}
                        <Badge variant="outline" className="capitalize">{item.type}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePlace(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {((activeTab === 'colleges' && colleges.length === 0) ||
                  (activeTab === 'buildings' && filteredBuildings.length === 0) ||
                  (activeTab === 'floors' && filteredFloors.length === 0) ||
                  (activeTab === 'places' && filteredPlaces.length === 0)) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No {activeTab} found. Add one to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Architecture</CardTitle>
              <CardDescription>How the navigation system works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">Graph-Based Navigation</h4>
                <p className="text-sm text-muted-foreground">
                  Places (rooms, stairs, lifts) become nodes in a graph. Corridors are edges 
                  with distance weights. Dijkstra's algorithm finds the shortest path.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                <h4 className="font-semibold text-foreground mb-2">Multi-Floor Support</h4>
                <p className="text-sm text-muted-foreground">
                  Stairs and lifts connect floors as special edges. The algorithm seamlessly 
                  handles floor transitions in route calculation.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-info/5 border border-info/20">
                <h4 className="font-semibold text-foreground mb-2">Distance Calculation</h4>
                <p className="text-sm text-muted-foreground">
                  1 footstep = 0.75 meters. Walking speed = 1.2 m/s. 
                  Total steps and estimated time are calculated from total distance.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="font-semibold text-foreground mb-2">Admin Workflow</h4>
                <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                  <li>Add college details</li>
                  <li>Add buildings with floor count</li>
                  <li>Add floors (upload floor plans)</li>
                  <li>Mark places on floor plans</li>
                  <li>System generates navigation graph</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
