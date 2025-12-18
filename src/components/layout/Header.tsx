import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Settings, Home, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/navigate', label: 'Navigate', icon: Navigation },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow"
          >
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-bold text-foreground">
            Campus<span className="text-primary">Nav</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'default' : 'nav'}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
