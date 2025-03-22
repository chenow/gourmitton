"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites, useRemoveFavorite } from "@/hooks/favorites";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: favorites, isLoading, isError } = useFavorites();
  const removeFavorite = useRemoveFavorite();
  useEffect(() => {
    if (!user && !isUserLoading) {
      router.push("/login");
    }
  }, [user, router, isUserLoading]);

  const handleRemoveFavorite = (recipeId: string) => {
    removeFavorite.mutate(
      { recipeId, username: user.username },
      {
        onSuccess: () => {
          toast("Recipe removed from favorites");
        },
        onError: () => {
          toast("Failed to remove recipe from favorites");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Mes Recettes Favories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes recettes favories</h1>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Impossible de charger les favoris</CardTitle>
            <CardDescription>
              Une erreur est survenue lors du chargement de vos recettes
              favorites.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.refresh()}>Réessayer</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Mes recettes favorites</h1>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Pas de Recettes Favorites</CardTitle>
            <CardDescription>
              Vous n&apos;avez pas encore ajouté de recettes à vos favoris.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Voir les recettes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mes recettes favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((recipe) => (
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveFavorite(recipe.id);
                  }}
                  className={"text-red-500 hover:text-red-600"}
                  title={"Retirer des favoris"}
                >
                  <Heart className="h-6 w-6 fill-current" />
                </Button>
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
    </div>
  );
}
