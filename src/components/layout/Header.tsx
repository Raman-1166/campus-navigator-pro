import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Settings, Home, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/navigate', label: 'Navigate', icon: Navigation },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'glass-strong shadow-sm' 
          : 'bg-background/60 backdrop-blur-sm'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md group-hover:shadow-glow transition-shadow duration-300"
          >
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <span className="text-xl font-semibold text-foreground">
            Campus<span className="text-primary">Nav</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'text-primary bg-primary/8' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  
                  {/* Animated underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
