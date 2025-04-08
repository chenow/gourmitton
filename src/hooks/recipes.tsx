import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Recipe } from "@/types";

// Fonction pour récupérer toutes les recettes
export const useRecipes = () => {
  return useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/recipes`,
      );
      return response.data;
    },
  });
};

// Fonction pour récupérer une recette spécifique par ID
export const useRecipe = (recipeId: string) => {
  return useQuery<Recipe>({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/recipes/${recipeId}`,
      );
      return response.data;
    },
    enabled: !!recipeId, // N'exécute la requête que si un ID est fourni
  });
};
