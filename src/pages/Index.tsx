import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Building2, Users, ArrowRight, Compass, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSection';

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

const stats = [
  { value: '50+', label: 'Colleges' },
  { value: '10k+', label: 'Daily Routes' },
  { value: '99.9%', label: 'Accuracy' },
  { value: '< 1s', label: 'Response' },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 text-primary text-sm font-medium mb-8"
          >
            <Zap className="h-4 w-4" />
            Indoor Navigation Solution
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25"
            >
              <MapPin className="h-10 w-10 text-primary-foreground" />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground tracking-tight"
          >
            Navigate Your Campus
            <br />
            <span className="text-gradient">With Precision</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Find classrooms, labs, offices, and more with intelligent indoor navigation. 
            Step-by-step directions across multiple floors.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/navigate">
              <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                Start Navigating
                <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Admin Panel
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="py-12 border-y border-border bg-secondary/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <section className="py-20">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose CampusNav?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for modern campuses with powerful features to help students and visitors navigate with confidence.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <Card hover className="h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                    </motion.div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gradient-subtle rounded-3xl">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground">Three simple steps to reach your destination</p>
        </AnimatedSection>

        <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
          {[
            { step: '1', title: 'Select Your College', desc: 'Choose from available colleges in the system', icon: Building2 },
            { step: '2', title: 'Pick Your Route', desc: 'Select your starting point and destination', icon: MapPin },
            { step: '3', title: 'Follow Directions', desc: 'Get step-by-step navigation with floor changes', icon: Navigation }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedSection key={item.step} delay={index * 0.15} direction="up">
                <Card className="relative overflow-hidden border-none shadow-md">
                  <CardContent className="p-8 text-center">
                    <div className="absolute -top-6 -right-6 text-[120px] font-bold text-primary/5 leading-none">
                      {item.step}
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative z-10 flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl mb-6 shadow-lg shadow-primary/25"
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <AnimatedSection className="py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Trusted by leading institutions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Set up your campus navigation system in minutes. No complex configuration required.
          </p>
          <Link to="/navigate">
            <Button variant="premium" size="xl" className="animate-glow-pulse">
              Try CampusNav Now
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </Layout>
  );
};

export default Index;
