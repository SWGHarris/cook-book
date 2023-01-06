import { Recipe, RecipeIngredientOnRecipe, RecipeStep } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

// const isValidRecipeId  = (id: any): id is string  => {
//   return typeof id === "string";
// }
 
interface EditRecipe extends Recipe {
  ingredients: RecipeIngredientOnRecipe[],
  steps: RecipeStep[]
};

const EditRecipe: NextPage = () => {
  const [recipe, setRecipe] = useState<EditRecipe>();
  const { data: session, status } = useSession();
  const { id } = useRouter().query;
  const editRecipe = trpc.useMutation("recipes.editRecipe");
  const recipeQuery = trpc.useQuery(["recipes.get", { id: id as string }], {
    onSuccess: (data) => {
      if (data) setRecipe(data);
    },
    staleTime: Infinity,
  });

  const handleSetIngredient = (ingredientName: string, index: number) => {
    if (recipe) {
      const ingredientsNew = recipe.ingredients.map((ingredient, i) => 
        i === index ? {...ingredient, name: ingredientName} : ingredient
      );
      setRecipe({ ...recipe, ingredients: ingredientsNew });
    }
  };

  const handleSetStep = (stepText: string, index: number) => {
    if (recipe) {
      const stepsNew = recipe.steps.map((s, i) =>
        i === index ? { ...s, text: stepText } : s
      );
      setRecipe({ ...recipe, steps: stepsNew });
    }
  };

  const handleEditRecipe = () => {
    if (recipe) editRecipe.mutate(recipe);
  };

  if (
    status === "authenticated" &&
    recipeQuery.isSuccess &&
    recipe &&
    recipe.authorId === session.user.id
  ) {
    return (
      <main className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Type here"
          className="input input-ghost text-2xl text-center"
          value={recipe.title}
          onChange={(event) =>
            setRecipe({ ...recipe, title: event.target.value })
          }
        />
        <div className="w-screen max-w-prose">
          <form
            className="flex flex-col gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              handleEditRecipe();
            }}
          >
            <div className="flex flex-col p-2">
              <textarea
                className="bg-inherit resize-none text-center border-gray-500 border-t-2 focus:outline-none pt-2"
                value={recipe.desc}
                rows={3}
                placeholder="Give an optional description"
                maxLength={250}
                onChange={(event) =>
                  setRecipe({ ...recipe, desc: event.target.value })
                }
              />

              <h3 className="border-b-2 pb-1 border-gray-500">Ingredients</h3>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index}>
                  <textarea
                    // type="text"
                    className="w-full bg-inherit ml-4 dark:focus:ring-blue-500 "
                    key={index}
                    minLength={1}
                    maxLength={50}
                    placeholder={"--"}
                    value={ingredient.name}
                    //TODO: should this be on blur?
                    onChange={(event) => {
                      event.preventDefault();
                      handleSetIngredient(event.target.value, index);
                    }}
                  />
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline font-bold"
                onClick={() => {
                  const nextIngredient: RecipeIngredientOnRecipe = {
                    name: "",
                    recipeId: recipe.id,
                    quantity: null,
                    unit: "NONE",
                    description: null,
                    order: recipe.ingredients.length
                  };
                  setRecipe({...recipe, ingredients: [...recipe.ingredients, nextIngredient]});
                }}
              >
                add ingredient
              </button>
              <div className="p-1"></div>
              {recipe.steps.map((step, index) => (
                <div key={index}>
                  <textarea
                    className="w-full bg-gray-800 overflow-hidden p-2 rounded-lg resize-y border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 max-h-16"
                    key={index}
                    minLength={1}
                    maxLength={400}
                    rows={8}
                    value={step.text}
                    placeholder={"Step " + (index + 1)}
                    //TODO: should this be on blur?
                    onChange={(event) => {
                      event.preventDefault();
                      handleSetStep(event.target.value, index);
                    }}
                  />
                </div>
              ))}
              <div className="p-1"></div>
              <button
                type="button"
                className="btn btn-outline font-bold"
                onClick={() => {
                  const nextStep: RecipeStep = {
                    id: "",
                    order: recipe.steps.length,
                    title: "",
                    text: "",
                    recipeId: recipe.id,
                  };
                  setRecipe({ ...recipe, steps: [...recipe.steps, nextStep] });
                }}
              >
                add step
              </button>
              <div className="p-1"></div>
              <button
                className="btn btn-outline btn-success focus:outline-none"
                type="submit"
              >
                save
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  } else if (recipeQuery.isLoading) {
    return <>Loading page</>;
  } else {
    return <>Something went wrong</>;
  }
};

export default EditRecipe;
