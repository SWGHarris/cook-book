import { IngredientUnit, Recipe, RecipeIngredientOnRecipe, RecipeStep } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { IngredientUnitArray } from "../../schema/recipe.schema";
import { trpc } from "../../utils/trpc";

// const isValidRecipeId  = (id: any): id is string  => {
//   return typeof id === "string";
// }

interface EditRecipe extends Recipe {
  ingredients: RecipeIngredientOnRecipe[];
  steps: RecipeStep[];
}

// TODO: extract to a component
const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.style.height = scrollHeight + "px";
    }
  }, [textAreaRef, value]);
};

const EditRecipe: NextPage = () => {
  const [recipe, setRecipe] = useState<EditRecipe>();
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useAutosizeTextArea(textAreaRef.current, value);
  const { data: session, status } = useSession();
  const { id } = useRouter().query;
  const editRecipe = trpc.useMutation("recipes.editRecipe");
  const recipeQuery = trpc.useQuery(["recipes.get", { id: id as string }], {
    onSuccess: (data) => {
      if (data) setRecipe(data);
    },
    staleTime: Infinity,
  });

  const handleIngredientChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    if (recipe) {
      const ingredientsNew = recipe.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [name]: value } : ingredient
      );
      setRecipe({ ...recipe, ingredients: ingredientsNew });
    }
  };

  const handleStepChange = (stepText: string, index: number) => {
    if (recipe) {
      const stepsNew = recipe.steps.map((s, i) =>
        i === index ? { ...s, text: stepText } : s
      );
      setRecipe({ ...recipe, steps: stepsNew });
    }
  };

  const handleSubmitSaveRecipe = () => {
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
              handleSubmitSaveRecipe();
            }}
          >
            <div className="flex flex-col p-2">
              <textarea
                className="bg-inherit p-2 resize-none overflow-y-hidden border-gray-500 border-t-2 border-b-2 focus:outline-none"
                value={recipe.desc}
                rows={1}
                placeholder="Give your recipe a description"
                maxLength={250}
                ref={textAreaRef}
                onChange={(event) => {
                  setRecipe({ ...recipe, desc: event.target.value });
                  setValue(event.target.value);
                }}
              />

              <h3 className="text-center border-b-2 pb-1 pt-2 border-gray-500">
                Ingredient List
              </h3>
              {recipe.ingredients.map((ingredient, index) => (
                <div className="flex flex-row" key={index}>
                  <form id="ingredientForm">
                    <input
                      type="text"
                      name="name"
                      className="text-center bg-inherit ml-2 pt-1 dark:focus:ring-blue-500 "
                      key={index}
                      minLength={1}
                      maxLength={80}
                      placeholder={"--"}
                      value={ingredient.name}
                      //TODO: should this be on blur?
                      onChange={(event) => {
                        event.preventDefault();
                        handleIngredientChange(event, index);
                      }}
                    />
                    <input
                      type="number"
                      name="quantity"
                      step={0.01}
                      placeholder="0"
                      min={0}
                      max={10000000}
                      className="bg-inherit"
                      onChange={(event) => {
                        event.preventDefault();
                        handleIngredientChange(event, index);
                      }}
                    />
                    <select
                      name="unit"
                      id="unit"
                      className="bg-inherit"
                      onChange={(event) => {
                        event.preventDefault();
                        handleIngredientChange(event, index);
                      }}
                    >
                      {IngredientUnitArray.map((unit, index) => (
                        <option key={index} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </form>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline btn-sm mt-2 font-bold"
                onClick={() => {
                  const nextIngredient: RecipeIngredientOnRecipe = {
                    name: "",
                    recipeId: recipe.id,
                    quantity: 0,
                    unit: "NONE",
                    description: null,
                    order: recipe.ingredients.length,
                  };
                  setRecipe({
                    ...recipe,
                    ingredients: [...recipe.ingredients, nextIngredient],
                  });
                }}
              >
                add ingredient
              </button>
              <div className="p-1"></div>
              {recipe.steps.map((step, index) => (
                <div key={index}>
                  <label className="bg-inherit resize-none border-gray-500focus:outline-none p-1">
                    {"Step " + (index + 1)}
                  </label>
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
                      handleStepChange(event.target.value, index);
                    }}
                  />
                </div>
              ))}
              <div className="p-1"></div>
              <button
                type="button"
                className="btn btn-outline btn-sm font-bold"
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
