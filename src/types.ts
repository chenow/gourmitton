export interface User {
  username: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface Recipe {
  id: string;
  created_at: string;
  name: string;
  description: string;
  instructions: string;
  category: string;
  published: boolean;
  created_by: string;
  calories: number;
  cost: number;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string;
  disclaimer: string;
  when_to_eat: string;
}

export interface RecipeLike {
  created_at: string;
  recipe_id: string;
  username: string;
}
