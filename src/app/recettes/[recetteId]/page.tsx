"use client";

import { useParams } from "next/navigation";
import { useRecipe } from "@/hooks/useRecipes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Clock,
  Flame,
  CalendarDays,
  User,
  AlertCircle,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { RecipeLike } from "@/types/Recipe";

// Assume these are defined elsewhere in your application
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const likeRecipe = async (recipeId: string, username: string) => {
  const response = await axios.post<RecipeLike>(
    `${API_BASE_URL}/users/${username}/favorites`,
    { recipe_id: recipeId },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const unlikeRecipe = async (recipeId: string, username: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/users/${username}/favorites/${recipeId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  return response.data;
};

const checkIfLiked = async (recipeId: string, username: string) => {
  try {
    const response = await axios.get<RecipeLike[]>(
      `${API_BASE_URL}/users/${username}/favorites`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data.some((like) => like.recipe_id === recipeId);
  } catch (error) {
    console.error("Error checking if recipe is liked:", error);
    return false;
  }
};

export default function RecettePage() {
  const { recetteId } = useParams();
  const {
    data: recipe,
    isLoading,
    error,
  } = useRecipe(Array.isArray(recetteId) ? recetteId[0] : recetteId);

  const [isLiked, setIsLiked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);

      // If we have a recipe and the user is logged in, check if it's liked
      if (recipe && recipe.id) {
        setIsLikeLoading(true);
        checkIfLiked(recipe.id, storedUsername)
          .then((liked) => {
            setIsLiked(liked);
          })
          .finally(() => {
            setIsLikeLoading(false);
          });
      }
    }
  }, [recipe]);

  const handleToggleLike = async () => {
    console.log("handleToggleLike");
    toast("Connectez-vous pour ajouter des recettes à vos favoris");

    if (!isLoggedIn || !username || !recipe) {
      toast("Connectez-vous pour ajouter des recettes à vos favoris");
      return;
    }

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeRecipe(recipe.id, username);
        setIsLiked(false);
        toast("La recette a été retirée de vos favoris");
      } else {
        await likeRecipe(recipe.id, username);
        setIsLiked(true);
        toast("La recette a été ajoutée à vos favoris");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLikeLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 flex justify-center">
        <div className="animate-pulse text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "Recette non trouvée"}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la liste des recettes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste des recettes
          </Link>
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">
                {recipe.name}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {recipe.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={isLikeLoading}
                className={
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-red-400"
                }
                title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart
                  onClick={handleToggleLike}
                  className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`}
                />
              </Button>
              <Badge
                variant={
                  recipe.when_to_eat === "dessert" ? "secondary" : "default"
                }
              >
                {recipe.when_to_eat === "dessert"
                  ? "Dessert"
                  : "Plat principal"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {recipe.image_url && (
          <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
            <Image
              fill
              src={recipe.image_url}
              alt={recipe.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="mb-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Préparation</span>
              <span className="font-medium">{recipe.prep_time} min</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Flame className="mb-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cuisson</span>
              <span className="font-medium">{recipe.cook_time} min</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CalendarDays className="mb-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Créée le</span>
              <span className="font-medium">
                {new Date(recipe.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <div className="prose max-w-none">
            <ReactMarkdown>{recipe.instructions}</ReactMarkdown>
          </div>

          {recipe.disclaimer && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{recipe.disclaimer}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          <div className="text-sm text-muted-foreground flex items-center">
            <User className="h-4 w-4 mr-1" />
            Créée par {recipe.created_by}
          </div>
          {recipe.published === false && (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 border-yellow-200"
            >
              Non publiée
            </Badge>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
