import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation as NavIcon, Search, MapPin, Coffee, Book, Beaker, Building, ShieldCheck, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { PlaceSearch } from '@/components/navigation/PlaceSearch';
import { NavigationResult } from '@/components/navigation/NavigationResult';
import { useNavigationStore } from '@/store/navigation-store';
import { toast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuildingSelector } from '@/components/navigation/BuildingSelector';
import { FloorPlanViewer } from '@/components/navigation/FloorPlanViewer';

const QUICK_ACCESS = [
  { label: 'Library', icon: Book, type: 'library' },
  { label: 'Admin Office', icon: ShieldCheck, type: 'office' },
  { label: 'Labs', icon: Beaker, type: 'lab' },
  { label: 'Hostels', icon: Building, type: 'hostel' },
  { label: 'Ground', icon: Dumbbell, type: 'ground' },
];

const Navigate = () => {
  const {
    colleges,
    selectedCollegeId,
    selectedBuildingId,
    startPlaceId,
    endPlaceId,
    navigationResult,
    setStartPlace,
    setEndPlace,
    calculateRoute,
    clearNavigation,
    setSelectedCollege,
    places,
    floors,
    connections, // Add connections
    searchPlaces
  } = useNavigationStore();

  // Auto-select first college on load if not selected
  useEffect(() => {
    if (!selectedCollegeId && colleges.length > 0) {
      setSelectedCollege(colleges[0].id);
    }
  }, [colleges, selectedCollegeId, setSelectedCollege]);

  // Set default start point (e.g., "Main Gate")
  useEffect(() => {
    if (selectedCollegeId && !startPlaceId && places.length > 0) {
      const mainGate = places.find(p => p.name.toLowerCase().includes('main gate') || p.name.toLowerCase().includes('entry'));
      if (mainGate) {
        setStartPlace(mainGate.id);
      }
    }
  }, [selectedCollegeId, startPlaceId, places, setStartPlace]);

  // Auto-calculate route when destinations change or data loads
  useEffect(() => {
    if (startPlaceId && endPlaceId && startPlaceId !== endPlaceId) {
      calculateRoute();
      // Auto-switch view to the building of the start place to show path
      const startPlace = places.find(p => p.id === startPlaceId);
      if (startPlace) {
        useNavigationStore.getState().setSelectedBuilding(startPlace.buildingId);
        const startFloor = floors.find(f => f.id === startPlace.floorId);
        if (startFloor) {
          useNavigationStore.getState().setSelectedFloor(startPlace.floorId);
        }
      }
    }
  }, [startPlaceId, endPlaceId, calculateRoute, places, floors, connections]); // Added connections to dependency


  const handleQuickAccess = (type: string) => {
    // Find a place matching the type or name
    const place = places.find(p => p.type.toLowerCase().includes(type) || p.name.toLowerCase().includes(type));
    if (place) {
      setEndPlace(place.id);
      toast({ title: `Selected ${place.name}`, description: 'Calculating route...' });
    } else {
      toast({ title: 'Not Found', description: `Could not find ${type} in this college.`, variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">

        {/* Header & Search Section */}
        <section className="text-center py-8 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <Select value={selectedCollegeId || ''} onValueChange={setSelectedCollege}>
              <SelectTrigger className="w-[280px] bg-background/50 backdrop-blur-sm border-primary/20">
                <Building className="w-4 h-4 mr-2 text-primary" />
                <SelectValue placeholder="Select Campus" />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Where do you want to go?
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto px-4 space-y-4"
          >
            {/* Start Location Search */}
            <div className="relative z-20">
              <label className="text-xs text-muted-foreground ml-2 mb-1 block">Start Location</label>
              <PlaceSearch
                placeholder="Search start point (e.g., Main Gate)..."
                onSelect={(place) => setStartPlace(place?.id || null)}
                selectedPlaceId={startPlaceId}
                excludePlaceId={endPlaceId}
              />
            </div>

            {/* Destination Search */}
            <div className="relative z-10">
              <label className="text-xs text-muted-foreground ml-2 mb-1 block">Destination</label>
              <PlaceSearch
                placeholder="Search destination building, room..."
                onSelect={(place) => setEndPlace(place?.id || null)}
                selectedPlaceId={endPlaceId}
                excludePlaceId={startPlaceId}
              />
            </div>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 pt-4"
          >
            {QUICK_ACCESS.map((item) => (
              <Button
                key={item.label}
                variant="outline"
                className="rounded-full gap-2 border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all"
                onClick={() => handleQuickAccess(item.type)}
              >
                {/* {typeof item.icon !== 'string' && <item.icon className="h-4 w-4 text-primary" />} */}
                <item.icon className="h-4 w-4 text-primary" />
                {item.label}
              </Button>
            ))}
          </motion.div>
        </section>

        {/* Navigation Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">

          {/* LEFT: Text Directions (Col 1) */}
          <div className={`space-y-4 ${navigationResult ? 'lg:col-span-1' : 'lg:col-span-3 max-w-2xl mx-auto'}`}>

            {navigationResult && (
              <AnimatedSection>
                <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                  <NavigationResult />
                  <div className="mt-6 flex justify-center">
                    <Button onClick={clearNavigation} variant="outline" className="px-8">
                      Clear Route
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {!navigationResult && (
              <Card className="bg-secondary/20 border-none py-12">
                <CardContent className="text-center text-muted-foreground">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <h3 className="text-xl font-medium mb-2">Ready to Navigate</h3>
                  <p>Select both a <strong>Start Location</strong> and a <strong>Destination</strong> to see directions.</p>
                  {!startPlaceId && <p className="text-sm text-destructive mt-2">Please select a start point.</p>}
                  {startPlaceId && !endPlaceId && <p className="text-sm text-primary mt-2">Now select a destination.</p>}
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT: Map & Visuals (Col 2-3) - Only show if routing or specifically browsing */}
          <div className="lg:col-span-2 space-y-4">
            {/* 1. Building Selector Ribbon */}
            <Card className="p-2">
              <BuildingSelector />
            </Card>

            {/* 2. Interactive Map */}
            {selectedBuildingId ? (
              <FloorPlanViewer />
            ) : (
              <Card className="h-[500px] flex items-center justify-center bg-secondary/10 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Select a building from the top to view its floor plan.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Navigate;
