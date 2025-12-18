import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Building2, Users, ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';

const features = [
  {
    icon: Navigation,
    title: 'Smart Navigation',
    description: 'Get step-by-step directions using advanced pathfinding algorithms'
  },
  {
    icon: Building2,
    title: 'Multi-Floor Support',
    description: 'Navigate seamlessly between floors using stairs or elevators'
  },
  {
    icon: Compass,
    title: 'Distance & Time',
    description: 'Know exactly how far and how long it will take to reach'
  },
  {
    icon: Users,
    title: 'Multi-College',
    description: 'One app for all colleges with customizable campus data'
  }
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-glow"
            >
              <MapPin className="h-10 w-10 text-primary-foreground" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Campus<span className="text-gradient">Nav</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Navigate your college campus with ease. Find classrooms, labs, offices, and more 
            with step-by-step directions, floor changes, and walking estimates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/navigate">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Navigating
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Admin Panel
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            Why CampusNav?
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                >
                  <Card className="h-full bg-gradient-card hover:shadow-card-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
            How It Works
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '1', title: 'Select Your College', desc: 'Choose from available colleges' },
              { step: '2', title: 'Pick Your Route', desc: 'Select start and destination points' },
              { step: '3', title: 'Follow Directions', desc: 'Get step-by-step navigation' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index + 0.5 }}
              >
                <Card className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="absolute -top-4 -right-4 text-8xl font-bold text-primary/5">
                      {item.step}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Index;
