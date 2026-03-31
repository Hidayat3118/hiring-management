"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  HiOutlineUserCircle,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const firebaseAuth = getAuth();
  const router = useRouter();

  // Cek user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [firebaseAuth]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Berhasil keluar");
      router.push("/");
    } catch (error) {
      console.error("Gagal keluar:", error);
      toast.error("Gagal keluar");
    }
  };

  return (
    <nav className="py-4 shadow-md fixed top-0 left-0 right-0 bg-white z-50">
      <div className="flex justify-end items-center max-w-7xl mx-auto px-6 ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-11 w-11 hover:opacity-80 transition cursor-pointer">
              <AvatarImage
                src={user?.photoURL || "https://github.com/shadcn.png"}
                alt="Profile"
              />
              <AvatarFallback className="bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-700 font-semibold">
                {user?.email ? user.email.charAt(0).toUpperCase() : "CN"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-64 rounded-2xl border border-gray-100 bg-white/90 backdrop-blur shadow-xl p-2"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <HiOutlineUserCircle size={24} className="text-gray-500" />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  Role: <span className="font-medium text-cyan-600">Admin</span>
                </p>
              </div>
            </div>

            {/* Menu */}
            <div className="mt-2 space-y-1">
              <DropdownMenuItem
                onClick={() => alert("Lihat profil")}
                className="group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-100 transition"
              >
                <HiOutlineUserCircle
                  size={24}
                  className="text-gray-500 group-hover:text-cyan-600 transition"
                />
                <span className="text-sm font-medium">Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => alert("Buka pengaturan")}
                className="group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-gray-700 hover:bg-gray-100 transition"
              >
                <HiOutlineCog6Tooth
                  size={24}
                  className="text-gray-500 group-hover:text-cyan-600 transition"
                />
                <span className="text-sm font-medium">Settings</span>
              </DropdownMenuItem>
            </div>

            {/* Divider */}
            <div className="my-2 h-px bg-gray-100" />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer text-red-600 hover:bg-red-50 transition"
            >
              <HiOutlineArrowRightOnRectangle
                size={24}
                className="group-hover:translate-x-1 transition"
              />
              <span className="text-sm font-medium">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
