"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRecipes } from "@/hooks/recipes";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { data: recipes, isLoading, error } = useRecipes();

  return (
    <div>
      {/* Titre de la page */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src="/cuisine.webp"
          alt="Cuisine banner"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-10% via-background/70 via-50% to-background to-100% flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-10">
            <h1 className="text-4xl md:text-5xl font-bold drop-shadow-md">
              Gourmitton
            </h1>
            <p className="text-xl md:text-2xl mt-2 max-w-xl drop-shadow-md">
              Découvrez des recettes délicieuses et faciles à réaliser chez vous
            </p>
          </div>
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
