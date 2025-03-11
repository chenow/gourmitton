import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Recipe } from "@/types/Recipe";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

// Fonction pour récupérer toutes les recettes
export const useRecipes = () => {
  return useQuery<Recipe[], Error>({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      return response.data;
    },
  });
};

// Fonction pour récupérer une recette spécifique par ID
export const useRecipe = (recipeId: string | undefined) => {
  return useQuery<Recipe, Error>({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      if (!recipeId) throw new Error("Recipe ID is required");
      const response = await axios.get(`${API_BASE_URL}/recipes/${recipeId}`);
      return response.data;
    },
    enabled: !!recipeId, // N'exécute la requête que si un ID est fourni
  });
};
