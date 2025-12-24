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
import { AddCollegeDialog } from '@/components/admin/AddCollegeDialog';
import { AddBuildingDialog } from '@/components/admin/AddBuildingDialog';
import { AddFloorDialog } from '@/components/admin/AddFloorDialog';
import { AddPlaceDialog } from '@/components/admin/AddPlaceDialog';

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

  // Add dialog states
  const [addCollegeOpen, setAddCollegeOpen] = useState(false);
  const [addBuildingOpen, setAddBuildingOpen] = useState(false);
  const [addFloorOpen, setAddFloorOpen] = useState(false);
  const [addPlaceOpen, setAddPlaceOpen] = useState(false);

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

  const handleAddCollege = (collegeData: Omit<College, 'id' | 'createdAt'>) => {
    addCollege(collegeData);
    toast({ title: 'Success', description: 'College added successfully' });
  };

  const handleAddBuilding = (buildingData: Omit<Building, 'id'>) => {
    addBuilding(buildingData);
    toast({ title: 'Success', description: 'Building added successfully' });
  };

  const handleAddFloor = (floorData: Omit<Floor, 'id'>) => {
    addFloor(floorData);
    toast({ title: 'Success', description: 'Floor added successfully' });
  };

  const handleAddPlace = (placeData: Omit<Place, 'id'>) => {
    addPlace(placeData);
    toast({ title: 'Success', description: 'Place added successfully' });
  };

  const openAddDialog = () => {
    if (!isAdmin) return;
    switch (activeTab) {
      case 'colleges': setAddCollegeOpen(true); break;
      case 'buildings':
        if (!selectedCollegeId) {
          toast({ title: 'Error', description: 'Select a college first', variant: 'destructive' });
          return;
        }
        setAddBuildingOpen(true);
        break;
      case 'floors':
        if (!selectedBuildingId) {
          toast({ title: 'Error', description: 'Select a building first', variant: 'destructive' });
          return;
        }
        setAddFloorOpen(true);
        break;
      case 'places':
        if (!selectedFloorId) {
          toast({ title: 'Error', description: 'Select a floor first', variant: 'destructive' });
          return;
        }
        setAddPlaceOpen(true);
        break;
    }
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
                    onClick={openAddDialog}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {/* Add Forms - Replaced by Dialogs */}

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

      {/* Add Dialogs */}
      <AddCollegeDialog
        open={addCollegeOpen}
        onOpenChange={setAddCollegeOpen}
        onAdd={handleAddCollege}
      />
      <AddBuildingDialog
        open={addBuildingOpen}
        onOpenChange={setAddBuildingOpen}
        collegeId={selectedCollegeId}
        onAdd={handleAddBuilding}
      />
      <AddFloorDialog
        open={addFloorOpen}
        onOpenChange={setAddFloorOpen}
        buildingId={selectedBuildingId}
        onAdd={handleAddFloor}
      />
      <AddPlaceDialog
        open={addPlaceOpen}
        onOpenChange={setAddPlaceOpen}
        floorId={selectedFloorId}
        buildingId={selectedBuildingId}
        onAdd={handleAddPlace}
      />
    </Layout>
  );
};

export default Admin;
