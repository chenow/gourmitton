"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export function Navigation({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, logout, user } = useAuth();

  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <header className="border-b bg-card">
        <div className="mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Gourmitton</h1>
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="font-medium text-foreground hover:text-primary"
              >
                Accueil
              </Link>
              {isAuthenticated && (
                <Link
                  href="/favorites"
                  className="font-medium text-muted-foreground hover:text-primary"
                >
                  Mes favoris
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une recette..."
                className="pl-8"
              />
            </div> */}

            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="Photo de profil" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user?.full_name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mon profil</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                  >
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link className="hover:cursor-pointer" href="/login">
                <Button>Se connecter</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Barre de recherche mobile */}
      <div className="container mx-auto px-4 py-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher une recette..."
            className="pl-8 w-full"
          />
        </div>
      </div>
      {children}
    </div>
  );
}
