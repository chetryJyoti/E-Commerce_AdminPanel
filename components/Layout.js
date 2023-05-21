import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
export default function Layout({ children }) {
  const { data: session } = useSession();
  // console.log("session:", session);
  if (!session) {
    return (
      <div className="bg-bgGray w-screen flex items-center h-screen">
        <div className="text-center w-full">
          <div >
            <h1 className="text-white ">Hello Admin,</h1>
          </div>
          <button
            onClick={() => signIn("google")}
            className="bg-white p-3 rounded-lg"
          >
            <div className="flex">
              <Image
                src="assets/google-icon.svg"
                alt="My Image"
                width={20}
                height={20}
                className="mr-2"
              />
              Login with google
            </div>
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-bgGray min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow my-2 mr-2 rounded-lg p-4">
       {children}
      </div>
    </div>
  );
}
