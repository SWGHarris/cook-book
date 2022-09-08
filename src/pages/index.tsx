import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import CreateRecipe from "./create-recipe";

const RecipesList = () => {
  const ctx = trpc.useContext();
  // const [showAddStep, setShowAddStep] = useState(false);
  const { data: recipes, isLoading } = trpc.useQuery(["recipes.getAll"]);
  const deleteRecipe = trpc.useMutation(["recipes.deleteRecipe"], {
    onSuccess: () => ctx.invalidateQueries(["recipes.getAll"])
  });
  if (isLoading) return <div>Fetching messages...</div>;
  
  return (
    <div className="flex flex-col gap-4">
      {recipes?.map((recipe, index) => {
        return (
          <div key={index}>
            <p>{recipe.title}</p>
            <div>
              {/* <span>{showAddStep
                ? <>You will add your step now!</>
                : <button onClick={() => {setShowAddStep(!showAddStep)}}>click to add step</button>}
              </span> */}
              <span>
                <button onClick={(event) => {
                  event.preventDefault();
                  deleteRecipe.mutate({ id: recipe.id });
                }}>
                DELETE RECIPE
                </button>
              </span>
            </div>
            {/* {recipe.steps?.map((step, index) => {
              return <span key={index}>{step.text}</span>;
            })} */}
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">

      <div className="pt-10">
        {session && (
          <div>
            <h1>Welcome {session.user?.name}</h1>
            <CreateRecipe/>
            <div className="pt-10">
              <RecipesList />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;