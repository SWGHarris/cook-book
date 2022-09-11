
import Link from "next/link";
import { FC, useState } from "react";
import { Recipe } from "../schema/recipe.schema";
import { trpc } from "../utils/trpc";

const RecipeTable:FC = () => {
    const ctx = trpc.useContext();
    const [selected, setSelected] = useState<Map<Recipe['id'],boolean>>(new Map());
    const { data: recipes, isLoading } = trpc.useQuery(["recipes.getAll"]);
    const deleteRecipe = trpc.useMutation(["recipes.deleteRecipes"], {
      onSuccess: () => ctx.invalidateQueries(["recipes.getAll"])
    });

    if (isLoading) return <div>Fetching recipes...</div>;

    return (
    <div className="flex-col grow">
    <h1>Browse Recipes</h1>
    <div className="overflow-auto rounded-lg shadow-lg">
    {/* // <div className="overflow-x-auto border-2 border-sky-900 rounded-xl"> */}
    <table className="w-full">
        <thead className=" bg-slate-600">
        <tr>
            <th className="p-3 text-base font-semibold tracking-wide text-left">Recipe</th>
            <th className="p-3 text-base font-semibold tracking-wide text-left">Author</th>
            <th className="p-3 text-base font-semibold tracking-wide text-left">Category</th>

            <th>
                {deleteRecipe.isLoading
                ? <button className="btn btn-square loading m-2 btn-sm"></button>
                : <button className="btn btn-square btn-outline m-2 btn-sm"
                        onClick={(event) => {
                            event.preventDefault();
                            deleteRecipe.mutate(Array.from(selected.keys()));
                        }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                }
                
            </th>
        </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
            {recipes?.map((recipe, index) => {
                const altColor = (index%2 ===0) ? " bg-slate-700 " : "";
                return (
                <tr className={altColor} key={index}>
                    <td className="p-3 text-base font-bold text-sky-700 hover:underline"><Link href="" className="font-bold">{recipe.title}</Link></td>
                    <td className="p-3 text-base text-ellipsis overflow-hidden">Sam Harris</td>
                    {/* TODO: add author name to recipe schema */}
                    <td className="p-3 text-base ">Frozen Food</td>
                    <td className="p-3">
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
    </div>
)}

export default RecipeTable;