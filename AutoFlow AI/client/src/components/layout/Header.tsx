import { Link } from "wouter";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get initials for avatar fallback
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-background border-b border-border shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <Link href="/" className="text-gradient-primary font-bold text-2xl font-heading flex items-center">
          <span className="material-icons mr-2 text-primary">bolt</span>
          AutoFlow<span className="text-accent ml-1">AI</span>
        </Link>
        <div className="ml-10 hidden md:flex space-x-2">
          <Link href="/" className="text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted hover:shadow-sm transition-all duration-200 flex items-center">
            <span className="material-icons text-sm mr-1">dashboard</span>
            Dashboard
          </Link>
          <Link href="/templates" className="text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted hover:shadow-sm transition-all duration-200 flex items-center">
            <span className="material-icons text-sm mr-1">apps</span>
            Templates
          </Link>
          <Link href="/settings" className="text-foreground font-medium px-3 py-2 rounded-md hover:bg-muted hover:shadow-sm transition-all duration-200 flex items-center">
            <span className="material-icons text-sm mr-1">settings</span>
            Settings
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/create" className="hidden md:flex">
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            <span className="material-icons text-sm mr-1">add_circle</span>
            New Workflow
          </Button>
        </Link>
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative">
              <Avatar className="border-2 border-primary hover:border-secondary transition-colors cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white">
                  {user ? getInitials(user.username) : 'UN'}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user?.username}</span>
                <span className="text-xs text-muted-foreground">Signed in user</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Profile settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              disabled={logoutMutation.isPending}
              className="cursor-pointer text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{logoutMutation.isPending ? 'Logging out...' : 'Log out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
