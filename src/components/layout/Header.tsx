import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, User, LogOut, Calendar, Settings, Shield, Stethoscope } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isAdmin, isPractitioner } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="Therapy on the Go" 
            className="h-12 w-auto transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold text-foreground leading-tight">
              Therapy on the Go
            </span>
            <span className="text-xs text-muted-foreground">
              Healthcare at your doorstep
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          <a
            href="tel:+27123456789"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>+27 12 345 6789</span>
          </a>
          
          {user ? (
            <>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/book">Book Now</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isPractitioner && (
                    <DropdownMenuItem asChild>
                      <Link to="/practitioner" className="flex items-center gap-2 cursor-pointer">
                        <Stethoscope className="h-4 w-4" />
                        Practitioner Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <Calendar className="h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild className="rounded-full shadow-warm">
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 pb-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                isActive(item.href)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 space-y-3 border-t border-border">
            <a
              href="tel:+27123456789"
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground"
            >
              <Phone className="h-4 w-4" />
              <span>+27 12 345 6789</span>
            </a>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                )}
                {isPractitioner && (
                  <Link
                    to="/practitioner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Stethoscope className="h-4 w-4" />
                    Practitioner Dashboard
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Profile
                </Link>
                <Button asChild className="w-full rounded-full shadow-warm">
                  <Link to="/book" onClick={() => setMobileMenuOpen(false)}>Book Now</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button asChild className="w-full rounded-full shadow-warm">
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
