"use client";

import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

// Données mockées pour l'affichage (à remplacer par les données de l'API)
const mockRecipes = [
  {
    id: 1,
    title: "Pasta Carbonara",
    description:
      "Une recette italienne classique avec des œufs, du fromage et du bacon.",
    image:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop",
    duration: "30 min",
    difficulty: "Facile",
    tags: ["Italien", "Pâtes"],
  },
  {
    id: 2,
    title: "Ratatouille",
    description:
      "Un plat provençal de légumes mijotés avec des herbes aromatiques.",
    image:
      "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800&auto=format&fit=crop",
    duration: "45 min",
    difficulty: "Moyen",
    tags: ["Français", "Végétarien"],
  },
  {
    id: 3,
    title: "Poulet rôti aux herbes",
    description:
      "Poulet entier rôti avec un mélange d'herbes fraîches et d'ail.",
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop",
    duration: "1h30",
    difficulty: "Moyen",
    tags: ["Viande", "Dîner"],
  },
  {
    id: 4,
    title: "Salade niçoise",
    description: "Salade composée avec thon, œufs, olives et légumes frais.",
    image:
      "https://images.unsplash.com/photo-1594834749740-74b3f6764be4?w=800&auto=format&fit=crop",
    duration: "20 min",
    difficulty: "Facile",
    tags: ["Français", "Salade", "Léger"],
  },
  {
    id: 5,
    title: "Lasagnes bolognaise",
    description:
      "Couches de pâtes, sauce bolognaise et béchamel gratinées au four.",
    image:
      "https://images.unsplash.com/photo-1619895092538-128341789043?w=800&auto=format&fit=crop",
    duration: "2h",
    difficulty: "Difficile",
    tags: ["Italien", "Pâtes", "Four"],
  },
  {
    id: 6,
    title: "Soupe miso",
    description: "Bouillon japonais traditionnel avec tofu, algues et légumes.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
    duration: "25 min",
    difficulty: "Facile",
    tags: ["Japonais", "Soupe"],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <header className="border-b bg-card">
        <div className="mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Gourmet</h1>

            <nav className="hidden md:flex space-x-4">
              <Link
                href="/"
                className="font-medium text-foreground hover:text-primary"
              >
                Accueil
              </Link>
              <Link
                href="/favorites"
                className="font-medium text-muted-foreground hover:text-primary"
              >
                Mes favoris
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-64 hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une recette..."
                className="pl-8"
              />
            </div>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="Photo de profil" />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      UT
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mon profil</DropdownMenuItem>
                <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Titre de la page */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <h2 className="text-3xl font-bold text-foreground">
          Toutes les recettes
        </h2>
        <p className="text-muted-foreground mt-2">
          Découvrez notre collection de délicieuses recettes préparées par nos
          chefs.
        </p>
      </div>

      {/* Filtres */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Tous
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Italien
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Français
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Végétarien
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Rapide
          </Badge>
        </div>
      </div>

      {/* Liste des recettes */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecipes.map((recipe) => (
            <Link href={`/recettes/${recipe.id}`} key={recipe.id}>
              <Card className="pt-0 h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  {recipe.image ? (
                    <Image
                      src={recipe.image}
                      alt={recipe.title}
                      height={800}
                      width={400}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground">
                        Pas d&apos;image
                      </span>
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1">{recipe.title}</CardTitle>
                </CardHeader>

                <CardContent className="pb-2">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    {recipe.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <span>{recipe.duration}</span>
                  <span>Difficulté: {recipe.difficulty}</span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
