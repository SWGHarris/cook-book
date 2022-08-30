import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { RecipeStep } from "../schema/recipe.schema";
import { trpc } from "../utils/trpc";

// 
const RecipesList = () => {
  const [showAddStep, setShowAddStep] = useState(false);
  const { data: recipes, isLoading } = trpc.useQuery(["recipes.getAll"]);

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      {recipes?.map((recipe, index) => {
        return (
          <div key={index}>
            <p>{recipe.title}</p>
            <span>{showAddStep
              ? <>You will add your step now!</>
              : <button onClick={() => {setShowAddStep(!showAddStep)}}>click to add step</button>}
            </span>
            {recipe.steps?.map(step => {
              <span>{step.text}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};


interface StepParams {
  recipeId: number,
  stepNumber: number
}

const AddRecipeStep = (p : StepParams) => {
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

const CreateRecipes = () => {
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
                    //TODO: initialize steps of recipe
                    steps: []
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
              //TODO: better way to display error please
);
return <></>
}

const Home = () => {
  const { data: session, status } = useSession();

  

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">Recipes</h1>

      <div className="pt-10">
        {session ? (
          <div>
            <p>hi {session.user?.name}</p>

            <button onClick={() => signOut()}>Logout</button>
            
            <CreateRecipes/>

            <div className="pt-10">
              <RecipesList />
            </div>
          
          </div>
        ) : (
          <div>
            <button onClick={() => signIn("discord")}>
              Login with Discord
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;