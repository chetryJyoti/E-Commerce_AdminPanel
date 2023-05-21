import Nav from "@/components/Nav";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Logo from "./Logo";
export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  const toggleNavbar = () => {
    setShowNav(!showNav);
  };
  // console.log("session:", session);
  if (!session) {
    return (
      <div className="bg-bgGray w-screen flex items-center h-screen">
        <div className="text-center w-full">
          <div>
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
    <div className="bg-bgGray min-h-screen">
      <div className=" md:hidden flex items-center p-4">
        <button onClick={toggleNavbar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center">

        <Logo/>
        </div>
      </div>
      <div className=" flex">
        <Nav show={showNav} />
        <div className="bg-white flex-grow my-2 mr-2 rounded-lg p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
