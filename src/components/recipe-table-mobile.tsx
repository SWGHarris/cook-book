
import Link from "next/link";
import { FC, useState } from "react";
import { Recipe } from "../schema/recipe.schema";
import { trpc } from "../utils/trpc";


const RecipeTableMobile:FC = () => {
    const ctx = trpc.useContext();
    const [selected, setSelected] = useState<Set<Recipe['id']>>(new Set());
    const { data: recipes, isLoading } = trpc.useQuery(["recipes.getAll"]);
    const deleteRecipe = trpc.useMutation(["recipes.deleteRecipes"], {
      onSuccess: () => ctx.invalidateQueries(["recipes.getAll"])
    });

    const handleSelection = (recipeId : Recipe['id']) => {
        const selected_new = selected;
        if (selected.has(recipeId)) selected_new.delete(recipeId);
        else selected_new.add(recipeId);
        setSelected(selected_new);
    }

    const handleDelete = () => {
        deleteRecipe.mutate(Array.from(selected));
    }

    if (isLoading) return <div>Fetching recipes...</div>;

    return (
        <div className="flex flex-col">
            <div className="flex flex-row-reverse space-y-1 p-0">
            {deleteRecipe.isLoading
                ? <button className="btn btn-square loading btn-xs"></button>
                : <button className="btn btn-square btn-outline btn-xs"
                        onClick={(event) => {
                            event.preventDefault();
                            handleDelete();
                        }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                }
            </div>
            <div className="p-1"></div>
            <div className="grid grid-cols-1 gap-1">
            {recipes?.map((recipe, index) => 
                <div key={index} className="bg-gray-800 space-y-1 p-3 rounded-lg shadow">
                    <div className="flex items-stretch space-x-2 text-sm">
                        <div className="font-bold text-sky-700 hover:underline"><Link href="" >{recipe.title}</Link></div>
                        <div>Samuel Harris</div>
                        <div className="text-gray-500">9/12/2022</div>
                        <span className=" grow"></span>
                        <div>
                            <input 
                                type="checkbox" 
                                className="checkbox"
                                onChange={() => handleSelection(recipe.id)}
                            />
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-400 w-2/3">{recipe.desc}</div>
                    {recipe.steps &&
                        recipe.steps.map(((s,index) => 
                            <div key={index} className="text-sm font-medium text-gray-400 w-2/3">{s.text}</div>    
                        ))
                    }
                    <div className="flex gap-2">
                            <div className="p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-200 bg-yellow-200 rounded-lg bg-opacity-50">baking</div>
                            <div className="p-1.5 text-xs font-medium uppercase tracking-wider text-gray-200 bg-gray-200 rounded-lg bg-opacity-50">easy</div>
                    </div>
                </div>
            )}                    
            </div>
        </div>
)}

export default RecipeTableMobile;