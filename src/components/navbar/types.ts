
// You can extend this file with additional types for the navbar components as needed
export interface NavbarProps {
  isScrolled: boolean;
  isAuthenticated: boolean;
  user: UserType | null;
}

export interface UserType {
  id: string;
  email?: string; // Making email optional to match Supabase's User type
  // Add other user properties as needed
}
