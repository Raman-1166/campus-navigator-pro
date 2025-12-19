import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Building2, 
  Layers, 
  MapPin, 
  Plus, 
  Trash2,
  Save,
  X,
  ChevronRight,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useNavigationStore } from '@/store/navigation-store';
import { useAuthStore } from '@/store/auth-store';
import { College, Building, Floor, Place, PlaceType } from '@/types/navigation';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { EditCollegeDialog } from '@/components/admin/EditCollegeDialog';
import { EditBuildingDialog } from '@/components/admin/EditBuildingDialog';
import { EditFloorDialog } from '@/components/admin/EditFloorDialog';
import { EditPlaceDialog } from '@/components/admin/EditPlaceDialog';

const placeTypes: PlaceType[] = [
  'classroom', 'laboratory', 'office', 'canteen', 'auditorium', 
  'library', 'restroom', 'stairs', 'lift', 'entrance', 'exit', 
  'corridor', 'sports', 'parking', 'other'
];

const Admin = () => {
  const { role } = useAuthStore();
  const isAdmin = role === 'admin';

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
    updateCollege,
    deleteCollege,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addFloor,
    updateFloor,
    deleteFloor,
    addPlace,
    updatePlace,
    deletePlace,
    getBuildingCountForCollege,
    getFloorCountForBuilding,
    getPlaceCountForFloor
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

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  // Edit dialog states
  const [editCollegeOpen, setEditCollegeOpen] = useState(false);
  const [editCollegeData, setEditCollegeData] = useState<College | null>(null);
  const [editBuildingOpen, setEditBuildingOpen] = useState(false);
  const [editBuildingData, setEditBuildingData] = useState<Building | null>(null);
  const [editFloorOpen, setEditFloorOpen] = useState(false);
  const [editFloorData, setEditFloorData] = useState<Floor | null>(null);
  const [editPlaceOpen, setEditPlaceOpen] = useState(false);
  const [editPlaceData, setEditPlaceData] = useState<Place | null>(null);

  const filteredBuildings = buildings.filter(b => b.collegeId === selectedCollegeId);
  const filteredFloors = floors.filter(f => f.buildingId === selectedBuildingId);
  const filteredPlaces = places.filter(p => p.floorId === selectedFloorId);

  const handleAddCollege = () => {
    if (!isAdmin) {
      toast({ title: 'Access Denied', description: 'Only admins can add colleges', variant: 'destructive' });
      return;
    }
    if (!collegeName.trim()) {
      toast({ title: 'Error', description: 'College name is required', variant: 'destructive' });
      return;
    }
    addCollege({
      name: collegeName,
      address: collegeAddress,
      status: 'active',
      gpsLocation: { lat: 0, lng: 0 }
    });
    setCollegeName('');
    setCollegeAddress('');
    setShowAddForm(false);
    toast({ title: 'Success', description: 'College added successfully' });
  };

  const handleAddBuilding = () => {
    if (!isAdmin) {
      toast({ title: 'Access Denied', description: 'Only admins can add buildings', variant: 'destructive' });
      return;
    }
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
    if (!isAdmin) {
      toast({ title: 'Access Denied', description: 'Only admins can add floors', variant: 'destructive' });
      return;
    }
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
    if (!isAdmin) {
      toast({ title: 'Access Denied', description: 'Only admins can add places', variant: 'destructive' });
      return;
    }
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

  const openDeleteDialog = (type: string, id: string, name: string) => {
    if (!isAdmin) {
      toast({ title: 'Access Denied', description: 'Only admins can delete items', variant: 'destructive' });
      return;
    }
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || !isAdmin) return;

    switch (deleteTarget.type) {
      case 'college':
        deleteCollege(deleteTarget.id);
        break;
      case 'building':
        deleteBuilding(deleteTarget.id);
        break;
      case 'floor':
        deleteFloor(deleteTarget.id);
        break;
      case 'place':
        deletePlace(deleteTarget.id);
        break;
    }

    toast({ title: 'Deleted', description: `${deleteTarget.name} has been removed` });
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  const getCascadeWarning = () => {
    if (!deleteTarget) return undefined;

    switch (deleteTarget.type) {
      case 'college': {
        const buildingCount = getBuildingCountForCollege(deleteTarget.id);
        if (buildingCount > 0) {
          return `This will also delete ${buildingCount} building(s) and all associated floors, places, and navigation paths.`;
        }
        break;
      }
      case 'building': {
        const floorCount = getFloorCountForBuilding(deleteTarget.id);
        if (floorCount > 0) {
          return `This will also delete ${floorCount} floor(s) and all associated places and navigation paths.`;
        }
        break;
      }
      case 'floor': {
        const placeCount = getPlaceCountForFloor(deleteTarget.id);
        if (placeCount > 0) {
          return `This will also delete ${placeCount} place(s) and all associated navigation paths.`;
        }
        break;
      }
    }
    return undefined;
  };

  const openEditDialog = (type: string, item: College | Building | Floor | Place) => {
    if (!isAdmin) {
      toast({ title: 'Access Denied', description: 'Only admins can edit items', variant: 'destructive' });
      return;
    }

    switch (type) {
      case 'college':
        setEditCollegeData(item as College);
        setEditCollegeOpen(true);
        break;
      case 'building':
        setEditBuildingData(item as Building);
        setEditBuildingOpen(true);
        break;
      case 'floor':
        setEditFloorData(item as Floor);
        setEditFloorOpen(true);
        break;
      case 'place':
        setEditPlaceData(item as Place);
        setEditPlaceOpen(true);
        break;
    }
  };

  const handleSaveCollege = (id: string, updates: Partial<College>) => {
    updateCollege(id, updates);
    toast({ title: 'Updated', description: 'College updated successfully' });
  };

  const handleSaveBuilding = (id: string, updates: Partial<Building>) => {
    updateBuilding(id, updates);
    toast({ title: 'Updated', description: 'Building updated successfully' });
  };

  const handleSaveFloor = (id: string, updates: Partial<Floor>) => {
    updateFloor(id, updates);
    toast({ title: 'Updated', description: 'Floor updated successfully' });
  };

  const handleSavePlace = (id: string, updates: Partial<Place>) => {
    updatePlace(id, updates);
    toast({ title: 'Updated', description: 'Place updated successfully' });
  };

  const tabs = [
    { id: 'colleges', label: 'Colleges', icon: Building2, count: colleges.length },
    { id: 'buildings', label: 'Buildings', icon: Building2, count: filteredBuildings.length },
    { id: 'floors', label: 'Floors', icon: Layers, count: filteredFloors.length },
    { id: 'places', label: 'Places', icon: MapPin, count: filteredPlaces.length }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20"
            >
              <Settings className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage campus data and configuration</p>
            </div>
          </div>
          {!isAdmin && (
            <Badge variant="outline" className="text-destructive border-destructive">
              View Only Mode
            </Badge>
          )}
        </motion.div>

        {/* Tabs */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setShowAddForm(false);
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <Badge variant={isActive ? "secondary" : "outline"} className={`ml-1 ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : ''}`}>
                    {tab.count}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Selection breadcrumb */}
        <AnimatedSection delay={0.15}>
          <Card className="bg-secondary/30 border-border/50">
            <CardContent className="py-4 flex flex-wrap items-center gap-3">
              <Select value={selectedCollegeId || ''} onValueChange={setSelectedCollege}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedCollegeId && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedBuildingId || ''} onValueChange={setSelectedBuilding}>
                    <SelectTrigger className="w-[200px] bg-background">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBuildings.map(b => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {selectedBuildingId && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedFloorId || ''} onValueChange={setSelectedFloor}>
                    <SelectTrigger className="w-[200px] bg-background">
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredFloors.map(f => (
                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* List View */}
          <AnimatedSection delay={0.2}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg capitalize">{activeTab}</CardTitle>
                  <CardDescription>Manage {activeTab} data</CardDescription>
                </div>
                {isAdmin && (
                  <Button 
                    onClick={() => setShowAddForm(!showAddForm)} 
                    variant={showAddForm ? "outline" : "default"}
                    size="sm"
                  >
                    {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {showAddForm ? 'Cancel' : 'Add New'}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {/* Add Forms */}
                {showAddForm && isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-5 border border-border rounded-xl bg-secondary/30"
                  >
                    {activeTab === 'colleges' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>College Name</Label>
                          <Input 
                            value={collegeName} 
                            onChange={(e) => setCollegeName(e.target.value)}
                            placeholder="e.g., Delhi Technical University"
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input 
                            value={collegeAddress} 
                            onChange={(e) => setCollegeAddress(e.target.value)}
                            placeholder="Full address"
                            className="bg-background"
                          />
                        </div>
                        <Button onClick={handleAddCollege} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Add College
                        </Button>
                      </div>
                    )}

                    {activeTab === 'buildings' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Building Name</Label>
                          <Input 
                            value={buildingName} 
                            onChange={(e) => setBuildingName(e.target.value)}
                            placeholder="e.g., Main Academic Block"
                            className="bg-background"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Code</Label>
                            <Input 
                              value={buildingCode} 
                              onChange={(e) => setBuildingCode(e.target.value)}
                              placeholder="e.g., MAB"
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Number of Floors</Label>
                            <Input 
                              type="number"
                              value={buildingFloors} 
                              onChange={(e) => setBuildingFloors(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddBuilding} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Add Building
                        </Button>
                      </div>
                    )}

                    {activeTab === 'floors' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Floor Number</Label>
                            <Input 
                              type="number"
                              value={floorNumber} 
                              onChange={(e) => setFloorNumber(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Floor Name</Label>
                            <Input 
                              value={floorName} 
                              onChange={(e) => setFloorName(e.target.value)}
                              placeholder="e.g., Ground Floor"
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddFloor} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Add Floor
                        </Button>
                      </div>
                    )}

                    {activeTab === 'places' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Place Name</Label>
                            <Input 
                              value={placeName} 
                              onChange={(e) => setPlaceName(e.target.value)}
                              placeholder="e.g., Room 101"
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Code</Label>
                            <Input 
                              value={placeCode} 
                              onChange={(e) => setPlaceCode(e.target.value)}
                              placeholder="e.g., 101"
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={placeType} onValueChange={(v) => setPlaceType(v as PlaceType)}>
                            <SelectTrigger className="bg-background">
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
                          <div className="space-y-2">
                            <Label>X Position</Label>
                            <Input 
                              type="number"
                              value={placeX} 
                              onChange={(e) => setPlaceX(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Y Position</Label>
                            <Input 
                              type="number"
                              value={placeY} 
                              onChange={(e) => setPlaceY(e.target.value)}
                              className="bg-background"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddPlace} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Add Place
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* List Items */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                  <StaggerContainer staggerDelay={0.05}>
                    {activeTab === 'colleges' && colleges.map(item => (
                      <StaggerItem key={item.id}>
                        <motion.div 
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-foreground">{item.name}</p>
                              <Badge variant={item.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                {item.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{item.address}</p>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog('college', item)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog('college', item.id, item.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      </StaggerItem>
                    ))}

                    {activeTab === 'buildings' && filteredBuildings.map(item => (
                      <StaggerItem key={item.id}>
                        <motion.div 
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">{item.code}</Badge>
                              <span className="text-xs text-muted-foreground">{item.floors} floors</span>
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog('building', item)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog('building', item.id, item.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      </StaggerItem>
                    ))}

                    {activeTab === 'floors' && filteredFloors.map(item => (
                      <StaggerItem key={item.id}>
                        <motion.div 
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Floor {item.floorNumber}</p>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog('floor', item)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog('floor', item.id, item.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      </StaggerItem>
                    ))}

                    {activeTab === 'places' && filteredPlaces.map(item => (
                      <StaggerItem key={item.id}>
                        <motion.div 
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                              {item.code && <span className="text-xs text-muted-foreground">{item.code}</span>}
                            </div>
                          </div>
                          {isAdmin && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog('place', item)}
                                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog('place', item.id, item.name)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  {/* Empty states */}
                  {activeTab === 'colleges' && colleges.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No colleges added yet</p>
                    </div>
                  )}
                  {activeTab === 'buildings' && !selectedCollegeId && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Select a college first</p>
                    </div>
                  )}
                  {activeTab === 'buildings' && selectedCollegeId && filteredBuildings.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No buildings in this college</p>
                    </div>
                  )}
                  {activeTab === 'floors' && !selectedBuildingId && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Select a building first</p>
                    </div>
                  )}
                  {activeTab === 'floors' && selectedBuildingId && filteredFloors.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No floors in this building</p>
                    </div>
                  )}
                  {activeTab === 'places' && !selectedFloorId && (
                    <div className="text-center py-12 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Select a floor first</p>
                    </div>
                  )}
                  {activeTab === 'places' && selectedFloorId && filteredPlaces.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No places on this floor</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Info Panel */}
          <AnimatedSection delay={0.25}>
            <Card className="bg-gradient-subtle">
              <CardHeader>
                <CardTitle className="text-lg">Quick Guide</CardTitle>
                <CardDescription>How to set up your campus navigation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { step: '1', title: 'Add Colleges', desc: 'Start by adding your college details including name and address.' },
                  { step: '2', title: 'Add Buildings', desc: 'Add buildings within each college. Specify building code and number of floors.' },
                  { step: '3', title: 'Add Floors', desc: 'Create floor entries for each building with floor numbers and names.' },
                  { step: '4', title: 'Add Places', desc: 'Mark rooms, labs, offices, stairs, and lifts on each floor with their positions.' },
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 rounded-xl bg-background/60"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete ${deleteTarget?.type || 'item'}?`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        cascadeWarning={getCascadeWarning()}
        onConfirm={handleConfirmDelete}
      />

      {/* Edit Dialogs */}
      <EditCollegeDialog
        open={editCollegeOpen}
        onOpenChange={setEditCollegeOpen}
        college={editCollegeData}
        onSave={handleSaveCollege}
      />
      <EditBuildingDialog
        open={editBuildingOpen}
        onOpenChange={setEditBuildingOpen}
        building={editBuildingData}
        onSave={handleSaveBuilding}
      />
      <EditFloorDialog
        open={editFloorOpen}
        onOpenChange={setEditFloorOpen}
        floor={editFloorData}
        onSave={handleSaveFloor}
      />
      <EditPlaceDialog
        open={editPlaceOpen}
        onOpenChange={setEditPlaceOpen}
        place={editPlaceData}
        onSave={handleSavePlace}
      />
    </Layout>
  );
};

export default Admin;
