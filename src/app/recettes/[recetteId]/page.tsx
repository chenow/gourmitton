"use client";

import { useParams } from "next/navigation";
import { useRecipe } from "@/hooks/recipes";
import {
  useAddFavorite,
  useRemoveFavorite,
  useIsFavorite,
} from "@/hooks/favorites";
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
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

export default function RecettePage() {
  const { recetteId } = useParams();
  const id = Array.isArray(recetteId) ? recetteId[0] : recetteId!;

  const { user } = useAuth();

  const { data: recette, isLoading, error } = useRecipe(id);
  const [isFavorite, setIsFavorite] = useIsFavorite(id);

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handleToggleFavorite = async () => {
    if (!user || !user.username || !recette) {
      toast("Connectez-vous pour ajouter des recettes à vos favoris");
      return;
    }

    if (isFavorite) {
      // Supprimer des favoris
      removeFavorite.mutate(
        { recipeId: recette.id, username: user.username },
        {
          onSuccess: () => {
            toast("La recette a été retirée de vos favoris");
          },
          onError: () => {
            toast("Une erreur est survenue. Veuillez réessayer.");
          },
        }
      );
    } else {
      // Ajouter aux favoris
      addFavorite.mutate(
        {
          recipeId: recette.id,
          username: user.username,
        },
        {
          onSuccess: () => {
            toast("La recette a été ajoutée à vos favoris");
          },
          onError: () => {
            toast("Une erreur est survenue. Veuillez réessayer.");
          },
        }
      );
    }
    //@ts-expect-error - Fix this
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto mt-8 flex justify-center">
        <div className="animate-pulse text-xl">Chargement...</div>
      </div>
    );
  }

  if (error || !recette) {
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

  const isLikeLoading = addFavorite.isPending || removeFavorite.isPending;

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
                {recette.name}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {recette.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                disabled={isLikeLoading}
                onClick={handleToggleFavorite}
                className={
                  isFavorite
                    ? "text-red-500 hover:text-red-600"
                    : "text-muted-foreground hover:text-red-400"
                }
                title={
                  isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
                }
              >
                {isLikeLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Heart
                    className={`h-6 w-6 ${isFavorite ? "fill-current" : ""}`}
                  />
                )}
              </Button>
              <Badge
                variant={
                  recette.when_to_eat === "dessert" ? "secondary" : "default"
                }
              >
                {recette.when_to_eat === "dessert"
                  ? "Dessert"
                  : "Plat principal"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {recette.image_url && (
          <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
            <Image
              fill
              src={recette.image_url}
              alt={recette.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="mb-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Préparation</span>
              <span className="font-medium">{recette.prep_time} min</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Flame className="mb-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cuisson</span>
              <span className="font-medium">{recette.cook_time} min</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <CalendarDays className="mb-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Créée le</span>
              <span className="font-medium">
                {new Date(recette.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <div className="prose max-w-none">
            <ReactMarkdown>{recette.instructions}</ReactMarkdown>
          </div>

          {recette.disclaimer && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{recette.disclaimer}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-between pt-4">
          <div className="text-sm text-muted-foreground flex items-center">
            <User className="h-4 w-4 mr-1" />
            Créée par {recette.created_by}
          </div>
          {recette.published === false && (
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
