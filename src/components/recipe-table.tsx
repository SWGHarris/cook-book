
import { FC, useState } from "react";
import { Recipe } from "../schema/recipe.schema";
import { trpc } from "../utils/trpc";
// const RecipesList = () => {
    
//     return (
//       <div className="flex flex-col gap-4">
//         {recipes?.map((recipe, index) => {
//           return (
//             <div key={index}>
//               <p>{recipe.title}</p>
//               <div>
//                 {/* <span>{showAddStep
//                   ? <>You will add your step now!</>
//                   : <button onClick={() => {setShowAddStep(!showAddStep)}}>click to add step</button>}
//                 </span> */}
//                 <span>
//                   <button >
//                   DELETE RECIPE
//                   </button>
//                 </span>
//               </div>
//               {/* {recipe.steps?.map((step, index) => {
//                 return <span key={index}>{step.text}</span>;
//               })} */}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

const RecipeTable:FC = () => {
    const ctx = trpc.useContext();
    const [selected, setSelected] = useState<Map<Recipe['id'],boolean>>(new Map());
    const { data: recipes, isLoading } = trpc.useQuery(["recipes.getAll"]);
    const deleteRecipe = trpc.useMutation(["recipes.deleteRecipes"], {
      onSuccess: () => ctx.invalidateQueries(["recipes.getAll"])
    });

    if (isLoading) return <div>Fetching recipes...</div>;

    return (

    <div className="overflow-x-auto border-2 border-sky-900 rounded-xl">
    <table className="table w-fit ">
        <thead>
        <tr>
            <th></th>
            <th>Recipe</th>
            <th>Author</th>
            <th>Category</th>

            <th><button className="btn btn-square btn-outline"
                onClick={(event) => {
                    event.preventDefault();
                    deleteRecipe.mutate(Array.from(selected.keys()));
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </th>
        </tr>
        </thead>
        <tbody>
            {recipes?.map((recipe, index) => {
                return (
                <tr className="hover" key={index}>
                    <th>{index + 1}</th>
                    <td>{recipe.title}</td>
                    <td>{recipe.authorId}</td>
                    <td>Frozen Food</td>
                    <td>
                        <label>
                            <input 
                                type="checkbox" 
                                className="checkbox" 
                                checked={selected.get(recipe.id)} 
                                onChange={(event) => {setSelected(new Map(selected.set(recipe.id, event.target.checked)))
                                }}/>
                        </label>
                    </td>
                </tr>);
            })}
        </tbody>
    </table>
    </div>
)}

export default RecipeTable;