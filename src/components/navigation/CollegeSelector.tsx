import { motion } from 'framer-motion';
import { Building2, MapPin, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/store/navigation-store';

export function CollegeSelector() {
  const { colleges, selectedCollegeId, setSelectedCollege } = useNavigationStore();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {colleges.map((college, index) => {
        const isSelected = college.id === selectedCollegeId;
        
        return (
          <motion.div
            key={college.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              onClick={() => setSelectedCollege(college.id)}
              className={`relative overflow-hidden ${
                isSelected ? 'ring-2 ring-primary shadow-glow' : ''
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 m-3">
                  <Badge variant="default">Selected</Badge>
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`
                    flex h-14 w-14 shrink-0 items-center justify-center rounded-xl
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                    transition-colors duration-200
                  `}>
                    <Building2 className="h-7 w-7" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
                      {college.name}
                    </h3>
                    <div className="flex items-start gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <p className="text-sm line-clamp-2">{college.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end mt-4 text-primary">
                  <span className="text-sm font-medium">
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
