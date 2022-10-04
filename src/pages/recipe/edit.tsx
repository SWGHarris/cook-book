
import { Recipe, RecipeStep } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

// const isValidRecipeId  = (id: any): id is string  => {
//   return typeof id === "string";
// }

const EditRecipe: NextPage = () => {
  const [ recipe, setRecipe ] = useState<Recipe & {steps: RecipeStep[]}>();
  const { data: session, status } = useSession();
  const { id } = useRouter().query;
  const recQuery = trpc.useQuery(["recipes.get", { id: id as string }]);
  const postRecipe = trpc.useMutation("recipes.postRecipe");

  useEffect(() => {
    if (recQuery.data) setRecipe(recQuery.data)
  }, [recQuery.data])


  if (status === "authenticated" && recQuery.isSuccess && recipe) {
    return(
      <main className="flex flex-col items-center">
        <h1>{recipe.title}</h1>
      <div className="pt-6 w-screen max-w-prose">
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    postRecipe.mutate({
                      authorId: session.user.id,
                      desc: "How to make the best dinner ever",
                      title: recipe.title,
                    });
                  }}
                >
                  <div className=" bg-gray-700 flex flex-col p-2">
                  <textarea
                    className="bg-inherit resize-none focus:outline-none"
                    value={recipe.title}
                    rows={1}
                    required
                    maxLength={60}
                    onChange={(event) => setRecipe({ ...recipe, title: event.target.value })}
                  />
                  <textarea
                    className="bg-inherit resize-none border-gray-500 border-t-2 focus:outline-none pt-2"
                    value={ recipe.desc }
                    rows={3}
                    placeholder="Give an optional description"
                    maxLength={250}
                    onChange={(event) => setRecipe({...recipe, desc: event.target.value })}
                  />
                  {recipe.steps.map((step, index) =>

                    <div key={index}>

                    <textarea
                    className="w-full bg-slate-600 p-2 rounded-md resize-none border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    key={index}
                    minLength={1}
                    maxLength={400}
                    value={step.text}
                    placeholder={"Step " + (index + 1)}
                    onChange={(event) => {
                      event.preventDefault();
                      setRecipe({...recipe, steps: recipe.steps.map((s, i) => (i === index) ? {...s, text: event.target.value} : s )});
                    }} 
                  />
                  </div>)}
                  </div>
                  
                  <button
                    className=" bg-gray-600 text-base font-bold"
                    onClick={() => {
                      const nextStep: RecipeStep = {
                        id: "",
                        title: "", 
                        text: "",
                        order: recipe.steps.length,
                        recipeId: recipe.id
                      };
                      setRecipe({...recipe, steps: [...recipe.steps, nextStep]})
                    }
                  }
                  >
                    Add Step
                  </button>
                  <button
                    className="p-2 bg-green-700 text-base font-bold focus:outline-none"
                    type="submit"
                  >
                    Save
                  </button>
                </form>
          </div>
        </main>
    );
  } else if (recQuery.isLoading) {
    return <>Loading page</>
  } else {
    return <>Something went wrong</>
  }          
}

export default EditRecipe;