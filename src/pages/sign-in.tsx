import { signIn, useSession } from "next-auth/react";

const SignInPage = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <main className="flex flex-col items-center pt-4">Loading...</main>;
    }

    return (
        <main className="flex flex-col items-center">
            <div className="pt-10">
                {!session && (
                    <div>
                        <button className="btn" onClick={() => signIn("discord", {
                            callbackUrl: `${window.location.origin}`
                        })}>
                            Login with Discord
                        </button>
                    </div>
                )}
                
            </div>
        </main>
    );
}

export default SignInPage;