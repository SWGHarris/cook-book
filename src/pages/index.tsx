import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import RecipeTable from "../components/recipe-table";
import { trpc } from "../utils/trpc";
import CreateRecipe from "./create-recipe";

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
            <div className="pt-3"></div>
            <Link href={'/create-recipe'}>
                <a className="btn p-2 rounded-md border-2 border-zinc-800 focus:outline-none">Create Recipe</a>
            </Link>
            <div className="pt-3"></div>
            <div className="pt-8">
              <RecipeTable />
              {/* TODO: make recipes pageable as cards or as table (see daisy ui) */}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;