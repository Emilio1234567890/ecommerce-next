import { useSession, signIn, signOut } from "next-auth/react";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import Logo from "./Logo";
export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  if (!session) {
    return (
      <div className="bg-blue-900 h-screen w-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            {" "}
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex items-center p-3">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-8">
          <Logo />
        </div>
      </div>
      <div className="bg-bgGray-2min-h-screen flex">
        <Navigation show={showNav} />
        <div className="flex-grow  p-4">{children}</div>
      </div>
    </div>
  );
}
