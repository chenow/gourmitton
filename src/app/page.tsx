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
import { useRecipes } from "@/hooks/useRecipes";
import { Recipe } from "@/types/Recipe";
import Image from "next/image";

export default function HomePage() {
  const { data: recipes, isLoading, error } = useRecipes();

  // Fonction pour extraire des tags à partir de la description (exemple simple)
  const extractTags = (recipe: Recipe) => {
    // Cette fonction est un exemple - vous pourriez vouloir implémenter une logique plus robuste
    // pour extraire des tags cohérents ou avoir des tags réels dans votre API
    const tags = [];

    // Ajouter un tag basé sur when_to_eat
    if (recipe.when_to_eat === "dish") tags.push("Plat principal");
    if (recipe.when_to_eat === "dessert") tags.push("Dessert");

    // Ajouter un tag basé sur le temps de préparation
    if (recipe.prep_time + recipe.cook_time <= 15) tags.push("Rapide");
    else if (recipe.prep_time + recipe.cook_time >= 30)
      tags.push("Longue préparation");

    // Vous pouvez ajouter d'autres logiques pour extraire des tags

    return tags.length ? tags : ["Divers"];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header avec navigation */}
      <header className="border-b bg-card">
        <div className="mx-auto px-8 py-4 flex justify-between items-center">
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
            Plat principal
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Dessert
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-accent">
            Rapide
          </Badge>
        </div>
      </div>

      {/* Liste des recettes */}
      <div className="container mx-auto px-4 pb-12">
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="loader">Chargement des recettes...</div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            Une erreur s&apos;est produite lors du chargement des recettes.
          </div>
        )}

        {recipes && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link href={`/recettes/${recipe.id}`} key={recipe.id}>
                <Card className="h-full pt-0 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {recipe.image_url ? (
                      <Image
                        height={200}
                        width={300}
                        src={recipe.image_url}
                        alt={recipe.name}
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
                    <CardTitle>{recipe.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {extractTags(recipe).map((tag, index) => (
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
                    <span>{recipe.prep_time + recipe.cook_time} min</span>
                    <span>
                      Difficulté: {recipe.prep_time > 15 ? "Moyen" : "Facile"}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {recipes && recipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Aucune recette disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
