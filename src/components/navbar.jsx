import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Navbar() {
  return (
    <nav className="py-4 shadow-lg">
      <div className=" justify-end flex max-w-7xl mx-auto">
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
