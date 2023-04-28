import Layout from "@/components/Layout";
import { useSession, signIn, signOut } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  // console.log({ session });
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2> Hello, {session?.user?.email}</h2>
        <div className="flex bg-gray-200 gap-1 text-black rounded-md overflow-hidden">
          <img src={session?.user?.image} alt="user_img" className="w-6 h-6" />
          <p className="px-1">{session?.user?.name}</p>
        </div>
      </div>
    </Layout>
  );
}
