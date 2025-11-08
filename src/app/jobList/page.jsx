"use client";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineBanknotes } from "react-icons/hi2";
import Navbar from "@/components/navbar";

export default function Page() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex justify-center py-10 px-4">
        <div className="flex bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-7xl">
          {/* Left panel - Job list */}
          <div className="w-1/3 border-r overflow-y-auto p-4">
            <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 cursor-pointer flex gap-3 items-start">
              {/* Logo */}
              <div className=" rounded-md p-1 object-cover overflow-hidden  border border-gray-300 flex items-center justify-center">
                <Image
                  src="/icon-rakamain.jfif"
                  alt="Company Logo"
                  width={50}
                  height={50}
                />
              </div>

              {/* Job Info */}
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800">UX Designer</h2>
                <p className="text-sm text-gray-500">Rakamin</p>

                <div className="mt-2 flex items-center text-gray-500 text-sm gap-1">
                  <IoLocationOutline />
                  Jakarta Selatan
                </div>

                <div className="mt-1 flex items-center text-gray-500 text-sm gap-1">
                  <HiOutlineBanknotes />
                  Rp7.000.000 - Rp15.000.000
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Job detail */}
          <div className="w-2/3 p-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className=" rounded-md p-1 object-cover overflow-hidden  border border-gray-300 flex items-center justify-center">
                  <Image
                    src="/icon-rakamain.jfif"
                    alt="Company Logo"
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <span className="inline-block text-xs bg-green-700 text-white font-medium px-2 py-1 rounded mb-1">
                    Full-Time
                  </span>
                  <h1 className="text-xl font-semibold text-gray-800">
                    UX Designer
                  </h1>
                  <p className="text-gray-500 text-sm">Rakamin</p>
                </div>
              </div>

              <button className="bg-yellow-400 text-gray-900 px-6 py-2 text-sm cursor-pointer rounded-lg font-medium hover:bg-yellow-500 transition">
                Apply
              </button>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Job description */}
            <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm leading-relaxed">
              <li>
                Develop, test, and maintain responsive, high-performance web
                applications using modern front-end technologies.
              </li>
              <li>
                Collaborate with UI/UX designers to translate wireframes and
                prototypes into functional code.
              </li>
              <li>
                Integrate front-end components with APIs and backend services.
              </li>
              <li>
                Ensure cross-browser compatibility and optimize applications for
                maximum speed and scalability.
              </li>
              <li>
                Write clean, reusable, and maintainable code following best
                practices and coding standards.
              </li>
              <li>
                Participate in code reviews, contributing to continuous
                improvement and knowledge sharing.
              </li>
              <li>
                Troubleshoot and debug issues to improve usability and overall
                application quality.
              </li>
              <li>
                Stay updated with emerging front-end technologies and propose
                innovative solutions.
              </li>
              <li>
                Collaborate in Agile/Scrum ceremonies, contributing to sprint
                planning, estimation, and retrospectives.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
