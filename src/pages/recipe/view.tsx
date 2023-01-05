
import { Recipe, RecipeStep } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const ViewRecipe: NextPage = () => {
  const [ recipe, setRecipe ] = useState<Recipe & {steps: RecipeStep[]}>();
  const { data: session, status } = useSession();
  const { id } = useRouter().query;
  const recipeQuery = trpc.useQuery(["recipes.get", { id: id as string }], {
    onSuccess: (data) => {
      if (data) setRecipe(data);
    },
  });
  if (status === "authenticated" 
        && recipeQuery.isSuccess
        && recipe
        && recipe.authorId === session.user.id) {
  // if ((recipeQuery.isSuccess && recipe)
  //       || (status === "authenticated" && recipeQuery.isSuccess && recipe && recipe.authorId === session.user.id)) {
    return(
      <main className="flex flex-col items-center">
        
        <div className="pt-6 w-screen max-w-prose">
            <div className="flex flex-col p-2">
              <h2>{recipe.title}</h2>
              <div className="p-1"></div>
              {recipe.desc}
            </div>
            
            {recipe.steps.map((step, index) =>
              <div key={index} className="bg-gray-800 space-y-1 p-3 m-2 rounded-lg shadow">
                <div className="text-sm font-medium text-gray-400 w-2/3">Step {step.order + 1}: {step.text}</div>
              </div>)}
        </div>
        </main>
    );
  } else if (recipeQuery.isLoading) {
    return <>Loading page</>
  } else {
    return <>Something went wrong</>
  }           
}

export default ViewRecipe;