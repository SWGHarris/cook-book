import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { trpc } from "../../utils/trpc";

const CreateRecipe: NextPage = () => {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const postRecipe = trpc.useMutation("recipes.postRecipe");
    const router = useRouter();

    const handleSubmit = (authorId: string, event: FormEvent<HTMLFormElement>) => {
      console.log("onSubmit firing\n")
      event.preventDefault();
      postRecipe.mutate({
        authorId: authorId,
        title: title,
        desc: desc
      },
      {
        onSuccess: (data) => {
          console.log("onSuccess firing");
          router.push({pathname: '/recipe/edit', query: {id : data.id}});
        }
      });
    };

    if (status === "authenticated") {
      return(
        <main className="flex flex-col items-center">
          <h1>Giver your recipe a title</h1>
        <div className="pt-6 w-screen max-w-prose">
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={(event) => handleSubmit(session.user.id, event)}
                  >
                    <div className=" bg-gray-700 flex flex-col p-2">
                    <textarea
                      className="bg-inherit resize-none focus:outline-none"
                      value={title}
                      rows={1}
                      required
                      placeholder="Give your recipe a title..."
                      maxLength={60}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <textarea
                      className="bg-inherit resize-none border-gray-500 border-t-2 focus:outline-none pt-2"
                      value={desc}
                      rows={3}
                      placeholder="Give your recipe a short description"
                      maxLength={250}
                      onChange={(event) => setDesc(event.target.value)}
                    />
                   
                    </div>
  
                    <button
                      className="p-2 bg-green-700 text-base font-bold focus:outline-none"
                      type="submit"
                    >
                      {/* TODO: Continue button should first post recipe, then route to edit page using the new recipe id */}
                      Continue
                    </button>
                  </form>
            </div>
          </main> 
    )}

    return <>Loading. . . </>
  }
  
  export default CreateRecipe;