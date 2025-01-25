import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          StatusPulse
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/signup">
            <Button variant="ghost" size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
          <Button variant="default" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
};