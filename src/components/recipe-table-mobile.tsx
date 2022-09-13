
import Link from "next/link";
import { FC, useState } from "react";
import { Recipe } from "../schema/recipe.schema";
import { trpc } from "../utils/trpc";


const RecipeTableMobile:FC = () => {
    const ctx = trpc.useContext();
    const [selected, setSelected] = useState<Map<Recipe['id'],boolean>>(new Map());
    const { data: recipes, isLoading } = trpc.useQuery(["recipes.getAll"]);
    const deleteRecipe = trpc.useMutation(["recipes.deleteRecipes"], {
      onSuccess: () => ctx.invalidateQueries(["recipes.getAll"])
    });

    if (isLoading) return <div>Fetching recipes...</div>;

    return (
        <div className="grid grid-cols-1 gap-2">
            {recipes?.map((recipe, index) => 
                <div key={index} className="bg-gray-800 space-y-1 p-3 rounded-lg shadow">
                    <div className="flex items-stretch space-x-2 text-sm">
                        <div className="font-bold text-sky-700 hover:underline"><Link href="" >{recipe.title}</Link></div>
                        <div>Sam Harris</div>
                        <div className="text-gray-500">9/12/2022</div>
                        <div>
                            <input 
                                type="checkbox" 
                                className="checkbox" 
                                checked={selected.get(recipe.id)} 
                                onChange={(event) => {setSelected(new Map(selected.set(recipe.id, event.target.checked)))
                                }}
                            />
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-400 w-2/3">A very brief description that is about this long.</div>
                    <div className="flex gap-2">
                            <div className="p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-200 bg-yellow-200 rounded-lg bg-opacity-50">baking</div>
                            <div className="p-1.5 text-xs font-medium uppercase tracking-wider text-gray-200 bg-gray-200 rounded-lg bg-opacity-50">easy</div>
                    </div>
                </div>
            )}                    
        </div>
    //             const altColor = (index%2 ===0) ? " bg-slate-700 " : "";
    //             return (
    //             <tr className={altColor} key={index}>
    //                 <td className="p-3 text-base font-bold text-sky-700 hover:underline"><Link href="" className="font-bold">{recipe.title}</Link></td>
    //                 <td className="p-3 text-base text-ellipsis">Sam Harris</td>
    //                 <td className="p-3 text-base ">Frozen Food</td>
    //                 <td className="p-3">
    //                     <label>
    //                         <input 
    //                             type="checkbox" 
    //                             className="checkbox" 
    //                             checked={selected.get(recipe.id)} 
    //                             onChange={(event) => {setSelected(new Map(selected.set(recipe.id, event.target.checked)))
    //                             }}/>
    //                     </label>
    //                 </td>
    //             </tr>);
    //         })}

    //     <div className="overflow-auto">
    //     <table className="flex-col items-start pt-4 w-screen max-w-prose">
    //     <caption>Browse Recipes (mobile)</caption>
    //     <thead className=" bg-slate-600">
    //     <tr>
    //         <th scope="col" className="p-3 text-base font-semibold tracking-wide text-left">Recipe</th>
    //         <th scope="col" className="p-3 text-base font-semibold tracking-wide text-left">Author</th>
    //         <th scope="col" className="p-3 text-base font-semibold tracking-wide text-left">Category</th>

    //         <th>
    //             {deleteRecipe.isLoading
    //             ? <button className="btn btn-square loading m-2 btn-sm"></button>
    //             : <button className="btn btn-square btn-outline m-2 btn-sm"
    //                     onClick={(event) => {
    //                         event.preventDefault();
    //                         deleteRecipe.mutate(Array.from(selected.keys()));
    //                     }}>
    //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
    //             </button>
    //             }
                
    //         </th>
    //     </tr>
    //     </thead>
    //     <tbody className="divide-y divide-gray-500">
    //         {recipes?.map((recipe, index) => {
    //             const altColor = (index%2 ===0) ? " bg-slate-700 " : "";
    //             return (
    //             <tr className={altColor} key={index}>
    //                 <td className="p-3 text-base font-bold text-sky-700 hover:underline"><Link href="" className="font-bold">{recipe.title}</Link></td>
    //                 <td className="p-3 text-base text-ellipsis">Sam Harris</td>
    //                 <td className="p-3 text-base ">Frozen Food</td>
    //                 <td className="p-3">
    //                     <label>
    //                         <input 
    //                             type="checkbox" 
    //                             className="checkbox" 
    //                             checked={selected.get(recipe.id)} 
    //                             onChange={(event) => {setSelected(new Map(selected.set(recipe.id, event.target.checked)))
    //                             }}/>
    //                     </label>
    //                 </td>
    //             </tr>);
    //         })}
    //     </tbody>
    // </table>
    // </div>
)}

export default RecipeTableMobile;