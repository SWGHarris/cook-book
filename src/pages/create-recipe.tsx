
import { FC, useState } from "react";
import { RecipeStep } from "../schema/recipe.schema";
import { trpc } from "../utils/trpc";

interface StepParams {
  recipeId: number,
  stepNumber: number
}

const CreateRecipeStep:FC<StepParams> = (p) => {
  const [step, setStep] = useState<RecipeStep>({
    recipeId: p.recipeId,
    text: "Step" + p.stepNumber,
    stepNumber: p.stepNumber
  });
  const postRecipeStep = trpc.useMutation(["recipes.postRecipeStep"]);

  return (
  <div className="pt-6">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  postRecipeStep.mutate(step);
                }}
              >
                <input
                  type="text"
                  value={step.title}
                  placeholder="Give the step an optional title"
                  onChange={(event) => setStep({...step, title: event.target.value})}
                  className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
                />
                <input
                  type="text"
                  value={step.text}
                  placeholder="Add a step..."
                  onChange={(event) => setStep({...step, text: event.target.value})}
                  className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
                >
                  Save Step
                </button>
              </form>
            </div>
  );
}

const CreateRecipe = () => {
  const [title, setTitle] = useState("");
  const ctx = trpc.useContext();
  const { data } = trpc.useQuery(["myself.me"]);
  const postRecipe = trpc.useMutation("recipes.postRecipe",  {
    onMutate: () => {
      ctx.cancelQuery(["recipes.getAll"]);
  
      const optimisticUpdate = ctx.getQueryData(["recipes.getAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["recipes.getAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["recipes.getAll"]);
    },
  });

  if (data)
  return(
    <div className="pt-6">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();

                  postRecipe.mutate({
                    authorId: data.id,
                    title,
                  });

                  setTitle("");
                }}
              >
                <input
                  type="text"
                  value={title}
                  required
                  placeholder="Name your recipe..."
                  maxLength={100}
                  onChange={(event) => setTitle(event.target.value)}
                  className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
  );
  return <></> //TODO: return loading state?              
}

export default CreateRecipe;