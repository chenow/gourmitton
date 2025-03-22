"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecipes } from "@/hooks/recipes";
import { Recipe } from "@/types";
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
    <div>
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
                        priority
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
