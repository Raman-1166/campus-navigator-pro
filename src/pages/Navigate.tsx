import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation as NavIcon, MapPin, RotateCcw, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { CollegeSelector } from '@/components/navigation/CollegeSelector';
import { BuildingSelector } from '@/components/navigation/BuildingSelector';
import { PlaceSearch } from '@/components/navigation/PlaceSearch';
import { FloorPlanViewer } from '@/components/navigation/FloorPlanViewer';
import { NavigationResult } from '@/components/navigation/NavigationResult';
import { useNavigationStore } from '@/store/navigation-store';
import { toast } from '@/hooks/use-toast';

const Navigate = () => {
  const {
    selectedCollegeId,
    selectedBuildingId,
    selectedFloorId,
    startPlaceId,
    endPlaceId,
    navigationResult,
    preferAccessible,
    setStartPlace,
    setEndPlace,
    setPreferAccessible,
    calculateRoute,
    clearNavigation,
    places,
    floors
  } = useNavigationStore();

  const handleCalculateRoute = () => {
    if (!startPlaceId || !endPlaceId) {
      toast({
        title: 'Select locations',
        description: 'Please select both start and destination points.',
        variant: 'destructive'
      });
      return;
    }

    if (startPlaceId === endPlaceId) {
      toast({
        title: 'Same location',
        description: 'Start and destination cannot be the same.',
        variant: 'destructive'
      });
      return;
    }

    calculateRoute();
    
    // Auto-select floor of start location for initial view
    const startPlace = places.find(p => p.id === startPlaceId);
    if (startPlace) {
      const startFloor = floors.find(f => f.id === startPlace.floorId);
      if (startFloor) {
        useNavigationStore.getState().setSelectedFloor(startFloor.id);
        useNavigationStore.getState().setSelectedBuilding(startPlace.buildingId);
      }
    }

    toast({
      title: 'Route calculated!',
      description: 'Follow the directions below to reach your destination.',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-card">
            <NavIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Navigate</h1>
            <p className="text-sm text-muted-foreground">Find your way around campus</p>
          </div>
        </motion.div>

        {/* Step 1: College Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </span>
                Select College
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CollegeSelector />
            </CardContent>
          </Card>
        </motion.section>

        {/* Step 2: Route Selection - Only show if college selected */}
        {selectedCollegeId && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    2
                  </span>
                  Select Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      <MapPin className="inline h-4 w-4 mr-1 text-success" />
                      Starting Point
                    </Label>
                    <PlaceSearch
                      placeholder="Where are you?"
                      onSelect={(place) => setStartPlace(place?.id || null)}
                      selectedPlaceId={startPlaceId}
                      excludePlaceId={endPlaceId}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block text-sm font-medium">
                      <MapPin className="inline h-4 w-4 mr-1 text-destructive" />
                      Destination
                    </Label>
                    <PlaceSearch
                      placeholder="Where to go?"
                      onSelect={(place) => setEndPlace(place?.id || null)}
                      selectedPlaceId={endPlaceId}
                      excludePlaceId={startPlaceId}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="accessible"
                      checked={preferAccessible}
                      onCheckedChange={setPreferAccessible}
                    />
                    <Label htmlFor="accessible" className="text-sm flex items-center gap-1">
                      <Accessibility className="h-4 w-4" />
                      Prefer accessible routes
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearNavigation}
                      disabled={!startPlaceId && !endPlaceId}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      variant="hero"
                      onClick={handleCalculateRoute}
                      disabled={!startPlaceId || !endPlaceId}
                    >
                      <NavIcon className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Step 3: Results & Map */}
        {selectedCollegeId && (startPlaceId || endPlaceId || navigationResult) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            {/* Map View */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campus Map</CardTitle>
              </CardHeader>
              <CardContent>
                <BuildingSelector />
                {selectedBuildingId && selectedFloorId && (
                  <div className="mt-4">
                    <FloorPlanViewer />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Result */}
            {navigationResult && (
              <div>
                <NavigationResult />
              </div>
            )}
          </motion.section>
        )}
      </div>
    </Layout>
  );
};

export default Navigate;
