import { useSession } from "next-auth/react";
import Link from "next/link";
import RecipeTableMobile from "../components/recipe-table-mobile";

const Home = () => {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="flex flex-col items-center">

      <div className="pt-10">
        {session
        
        ? 
          <div>
            <h1>Welcome {session.user?.name}</h1>
            <div className="pt-3"></div>
            <Link href={'/recipe/create'}>
                <a className="btn p-2 rounded-md border-2 border-zinc-800 focus:outline-none">Create Recipe</a>
            </Link>
            <div className="pt-3"></div>
            <div className="pt-8">
              <RecipeTableMobile />
            </div>
          </div>

          : <Link href={'/sign-in'}>
              <a className="btn p-2 rounded-md border-2 border-zinc-800 focus:outline-none">Sign In</a>
            </Link>
      }
      </div>
    </main>
  );
};

export default Home;