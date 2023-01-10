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
        {session ? (
          <div>
            <h2 className="text-center">hello, chef {session.user?.name}</h2>
            <div className="pt-8">
              <RecipeTableMobile />
            </div>
          </div>
        ) : (
          <Link href={"/sign-in"}>
            <a className="btn p-2 rounded-md border-2 border-zinc-800 focus:outline-none">
              Sign In
            </a>
          </Link>
        )}
      </div>
    </main>
  );
};

export default Home;