import { motion } from 'framer-motion';
import {
  Route,
  Clock,
  Footprints,
  Building2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/store/navigation-store';
import { formatTime, formatDistance } from '@/lib/navigation-algorithm';

export function NavigationResult() {
  const { navigationResult, selectedFloorId, setSelectedFloor, floors } = useNavigationStore();

  if (!navigationResult) {
    return null;
  }

  const { path, totalDistance, totalSteps, estimatedTime, floorsTraversed } = navigationResult;

  const handleStepClick = (floorId: string) => {
    setSelectedFloor(floorId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="font-semibold text-foreground">{formatDistance(totalDistance)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-success/5 border-success/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Footprints className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Steps</p>
              <p className="font-semibold text-foreground">{totalSteps.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-info/5 border-info/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-semibold text-foreground">{formatTime(estimatedTime)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Floors</p>
              <p className="font-semibold text-foreground">{floorsTraversed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step by Step Directions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Directions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {path.map((step, index) => {
            const isCurrentFloor = step.floor.id === selectedFloorId;
            const isFirstStep = index === 0;
            const isLastStep = index === path.length - 1;

            return (
              <motion.button
                key={`${step.place.id}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleStepClick(step.floor.id)}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all
                  ${isCurrentFloor ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50 hover:bg-secondary'}
                `}
              >
                {/* Step indicator */}
                <div className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium
                  ${isFirstStep ? 'bg-success text-success-foreground' :
                    isLastStep ? 'bg-destructive text-destructive-foreground' :
                      'bg-primary text-primary-foreground'}
                `}>
                  {isFirstStep ? '▶' : isLastStep ? '◆' : index}
                </div>

                {/* Instruction */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{step.instruction}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {step.building.code}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {step.floor.name}
                    </span>
                    {step.distance > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {step.distance}m
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Direction icon */}
                <div className="shrink-0">
                  {step.isFloorChange ? (
                    step.direction === 'up' ? (
                      <ArrowUp className="h-5 w-5 text-success" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-warning" />
                    )
                  ) : step.direction === 'left' ? (
                    <ArrowLeft className="h-5 w-5 text-foreground" />
                  ) : step.direction === 'right' ? (
                    <ArrowRight className="h-5 w-5 text-foreground" />
                  ) : step.direction === 'straight' ? (
                    <ArrowUp className="h-5 w-5 text-muted-foreground" />
                  ) : !isLastStep ? (
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-50" />
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
