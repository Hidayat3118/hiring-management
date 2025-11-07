import Image from "next/image";
import Link from "next/link";
import { TiArrowLeft } from "react-icons/ti";

export default function forgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white  rounded-lg shadow-md w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-start">
          <Image
            src={"/rekamin.png"}
            width={150}
            height={100}
            alt="icon rekamin"
            quality={100}
          />
        </div>
        <div className="pb-8 pl-8 pr-8">
          {/* button kembali */}
          <Link href="login/password">
            <button className="flex text-teal-400 hover:text-teal-500 items-center gap-1 mb-4">
              <TiArrowLeft className="text-2xl"/>
              Kembali
            </button>
          </Link>
          {/* Title */}
          <h2 className="text-lg text-neutral-700 font-semibold text-left mb-2">
            Selamat Datang Rakamin
          </h2>
          {/* Form */}
          <form className="space-y-4">
            <p className="text-gray-500">
              Masukan alamat email yang telah terdaftar menerima email reset
              sandi
            </p>
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                Alamat email
              </label>
              <input
                type="email"
                id="email"
                // placeholder="contoh@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            {/* Button daftar dengan email */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-800 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Kirim email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
