import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mock } from "bun:test";
import React from "react";

/**
 * Sets up the common mocks for testing
 */
export function setupMocks() {
  // Mock the useRecipes hook
  mock.module("@/hooks/recipes", () => ({
    useRecipes: () => ({
      data: [
        {
          id: "1",
          name: "Test Recipe",
          description: "A test recipe description",
          instructions: "Test instructions",
          category: "main",
          published: true,
          created_by: "test_user",
          calories: 500,
          cost: 10,
          prep_time: 15,
          cook_time: 30,
          servings: 4,
          image_url: "https://example.com/image.jpg",
          disclaimer: "",
          when_to_eat: "dish",
          created_at: "2024-04-08T10:00:00Z",
        },
      ],
      isLoading: false,
      error: null,
    }),
  }));

  // Mock the NextJS Image component
  mock.module("next/image", () => ({
    //@ts-expect-error no types for props
    default: (props) => (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img {...props} priority={props.priority ? "true" : "false"} />
    ),
  }));
}

/**
 * Custom wrapper for React Query
 */
export const QueryWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
