
import { FC, useState } from "react";
import { trpc } from "../utils/trpc";

// interface StepParams {
//   recipeId: number,
//   stepNumber: number
// }

// const CreateRecipeStep:FC<StepParams> = (p) => {
//   const [step, setStep] = useState<RecipeStep>({
//     recipeId: p.recipeId,
//     text: "Step" + p.stepNumber,
//     stepNumber: p.stepNumber
//   });
//   const postRecipeStep = trpc.useMutation(["recipes.postRecipeStep"]);

//   return (
//   <div className="pt-6">
//               <form
//                 className="flex gap-2"
//                 onSubmit={(event) => {
//                   event.preventDefault();
//                   postRecipeStep.mutate(step);
//                 }}
//               >
//                 <input
//                   type="text"
//                   value={step.title}
//                   placeholder="Give the step an optional title"
//                   onChange={(event) => setStep({...step, title: event.target.value})}
//                   className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
//                 />
//                 <input
//                   type="text"
//                   value={step.text}
//                   placeholder="Add a step..."
//                   onChange={(event) => setStep({...step, text: event.target.value})}
//                   className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none"
//                 />
//                 <button
//                   type="submit"
//                   className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none"
//                 >
//                   Save Step
//                 </button>
//               </form>
//             </div>
//   );
// }

const CreateRecipe:FC = () => {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<string[]>([""]); // temp way until using form hook of some sort
  const ctx = trpc.useContext();
  const { data } = trpc.useQuery(["myself.me"]);
  const postRecipe = trpc.useMutation("recipes.postRecipe");
  // const postRecipe = trpc.useMutation("recipes.postRecipe",  {
  //   onMutate: () => {
  //     ctx.cancelQuery(["recipes.getAll"]);
  
  //     const optimisticUpdate = ctx.getQueryData(["recipes.getAll"]);
  //     if (optimisticUpdate) {
  //       ctx.setQueryData(["recipes.getAll"], optimisticUpdate);
  //     }
  //   },
  //   onSettled: () => {
  //     ctx.invalidateQueries(["recipes.getAll"]);
  //   },
  // });


  if (data)
  return(
    <main className="flex flex-col items-center">
      <h1>Add a recipe</h1>
    <div className="pt-6 w-screen max-w-prose">
              <form
                className="flex flex-col gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  postRecipe.mutate({
                    authorId: data.id,
                    title,
                  });
                }}
              >
                <div className=" bg-gray-700 flex flex-col p-2">
                <textarea
                  className="bg-inherit resize-none focus:outline-none"
                  value={title}
                  rows={1}
                  required
                  placeholder="Name your recipe..."
                  maxLength={60}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <textarea
                  className="bg-inherit resize-none border-gray-500 border-t-2 focus:outline-none pt-2"
                  value={title}
                  rows={3}
                  placeholder="Give an optional description"
                  maxLength={250}
                  onChange={(event) => setTitle(event.target.value)}
                />
                {steps.map((step, index) =>

                  <div>

                  <textarea
                  className="w-full bg-slate-600 rounded-md resize-none border-gray-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  key={index}
                  minLength={1}
                  maxLength={400}
                  value={step}
                  placeholder={"Step " + (index + 1)}
                  onChange={(event) => {
                    event.preventDefault();
                    setSteps(steps.map((s, i) => (i === index) ? event.target.value : s ));
                  }} 
                />
                </div>)}
                </div>
                
                <button
                  className=" bg-gray-600 text-base font-bold"
                  onClick={() => setSteps([...steps, ""])}
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
  return <></> //TODO: return loading state?              
}

export default CreateRecipe;