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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

export default function RecettePage() {
  const { recetteId } = useParams();
  const {
    data: recipe,
    isLoading,
    error,
  } = useRecipe(Array.isArray(recetteId) ? recetteId[0] : recetteId);

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
            <Badge
              variant={
                recipe.when_to_eat === "dessert" ? "secondary" : "default"
              }
            >
              {recipe.when_to_eat === "dessert" ? "Dessert" : "Plat principal"}
            </Badge>
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
