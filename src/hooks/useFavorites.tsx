import { Recipe } from "@/types/Recipe";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = "https://gourmet.cours.quimerch.com";

export const useFavorites = () => {
  return useQuery<Recipe[], Error>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assurez-vous d'avoir le token stocké
        },
      });
      return response.data;
    },
  });
};
