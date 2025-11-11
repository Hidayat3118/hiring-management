"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const firebaseAuth = getAuth();
  const router = useRouter();

  // ✅ Cek user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [firebaseAuth]);

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Berhasil keluar");
      router.push("/"); // arahkan ke halaman utama
    } catch (error) {
      console.error("Gagal keluar:", error);
      toast.error("Gagal keluar");
    }
  };

  return (
    <nav className="py-4 shadow-md fixed top-0 left-0 right-0 bg-white z-50">
      <div className="flex justify-end items-center max-w-7xl mx-auto px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition">
              <AvatarImage src={user?.photoURL || "https://github.com/shadcn.png"} alt="Profile" />
              <AvatarFallback>
                {user?.email ? user.email.charAt(0).toUpperCase() : "CN"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-52 shadow-lg border border-gray-200"
          >
            <DropdownMenuLabel className="text-center font-semibold text-gray-700">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => alert("Lihat profil")}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition"
            >
              <FaUser className="text-gray-600" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => alert("Buka pengaturan")}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition"
            >
              <FaCog className="text-gray-600" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-red-500 hover:bg-red-50 transition"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
