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
import { AnimatedSection } from '@/components/ui/AnimatedSection';

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
      <div className="space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20"
          >
            <NavIcon className="h-7 w-7 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Navigate</h1>
            <p className="text-muted-foreground">Find your way around campus</p>
          </div>
        </motion.div>

        {/* Step 1: College Selection */}
        <AnimatedSection delay={0.1}>
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </span>
                Select College
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CollegeSelector />
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Step 2: Route Selection */}
        {selectedCollegeId && (
          <AnimatedSection delay={0.15}>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </span>
                  Select Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <div className="h-2 w-2 rounded-full bg-success" />
                      Starting Point
                    </Label>
                    <PlaceSearch
                      placeholder="Where are you?"
                      onSelect={(place) => setStartPlace(place?.id || null)}
                      selectedPlaceId={startPlaceId}
                      excludePlaceId={endPlaceId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
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
                  <div className="flex items-center gap-3">
                    <Switch
                      id="accessible"
                      checked={preferAccessible}
                      onCheckedChange={setPreferAccessible}
                    />
                    <Label htmlFor="accessible" className="text-sm flex items-center gap-2 cursor-pointer">
                      <Accessibility className="h-4 w-4 text-muted-foreground" />
                      Prefer accessible routes
                    </Label>
                  </div>

                  <div className="flex gap-3">
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
          </AnimatedSection>
        )}

        {/* Step 3: Results & Map */}
        {selectedCollegeId && (startPlaceId || endPlaceId || navigationResult) && (
          <AnimatedSection delay={0.2} className="grid gap-6 lg:grid-cols-2">
            {/* Map View */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </span>
                  Campus Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BuildingSelector />
                {selectedBuildingId && selectedFloorId && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4"
                  >
                    <FloorPlanViewer />
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Navigation Result */}
            {navigationResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <NavigationResult />
              </motion.div>
            )}
          </AnimatedSection>
        )}
      </div>
    </Layout>
  );
};

export default Navigate;
