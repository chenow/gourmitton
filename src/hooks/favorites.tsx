import { Recipe } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface fetchFaforitesResponse {
  recipe: Recipe;
}
export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await axios.get<fetchFaforitesResponse[] | null>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );
      console.log(response.data);
      if (!response.data) return [];
      return response.data.map((recipe) => recipe.recipe);
    },
  });
};

interface AddFavoriteProps {
  recipeId: string;
  username: string;
}
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipeId, username }: AddFavoriteProps) => {
      const response = await axios.post<null>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the favorites query
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

interface AddFavoriteProps {
  recipeId: string;
  username: string;
}

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipeId, username }: AddFavoriteProps) => {
      const response = await axios.delete<null>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${username}/favorites?recipeID=${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the favorites query
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useIsFavorite = (recipeId: string) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { data: favoritesQuery } = useFavorites();

  useEffect(() => {
    if (favoritesQuery) {
      setIsFavorite(favoritesQuery.some((recipe) => recipe.id === recipeId));
    }
  }, [favoritesQuery, recipeId]);

  return [isFavorite, setIsFavorite];
};
