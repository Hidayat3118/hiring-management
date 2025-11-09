"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function JobFormAdmin({open, onOpenChange}) {
  // const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    jobName: "",
    jobType: "",
    jobDesc: "",
    candidate: "",
    minSalary: "",
    maxSalary: "",
  });

  const [requirements, setRequirements] = useState({
    fullName: "Mandatory",
    photo: "Mandatory",
    gender: "Mandatory",
    domicile: "Mandatory",
    email: "Mandatory",
    phone: "Mandatory",
    linkedin: "Mandatory",
    dob: "Mandatory",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRequirementChange = (field, value) => {
    setRequirements({ ...requirements, [field]: value });
  };

  const allFilled = Object.values(form).every((val) => val !== "");

  const handleSubmit = () => {
    if (allFilled) {
      alert("Job published successfully!");
      setOpen(false);
    } else {
      alert("Please fill all required fields!");
    }
  };

  const renderRequirementRow = (label, key) => (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex gap-2">
        {["Mandatory", "Optional", "Off"].map((opt) => (
          <Button
            key={opt}
            variant="outline"
            size="sm"
            className={cn(
              "text-xs rounded-full px-3 transition-all duration-150",
              requirements[key] === opt &&
                opt === "Mandatory" &&
                "bg-cyan-50 text-cyan-600 border-cyan-400",
              requirements[key] === opt &&
                opt === "Optional" &&
                "bg-yellow-50 text-yellow-600 border-yellow-400",
              requirements[key] === opt &&
                opt === "Off" &&
                "bg-gray-50 text-gray-500 border-gray-300"
            )}
            onClick={() => handleRequirementChange(key, opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <Dialog open={open} onOpenChange={onOpenChange}>

        <DialogContent
          className="sm:max-w-[750px] w-full max-h-[90vh] overflow-y-auto rounded-2xl p-8 bg-white shadow-lg"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              Job Opening
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Job Name */}
            <div>
              <Label className="text-gray-700">
                Job Name<span className="text-red-500">*</span>
              </Label>
              <Input
                name="jobName"
                placeholder="Ex. Front End Engineer"
                value={form.jobName}
                onChange={handleChange}
                className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 placeholder:text-gray-400"
              />
            </div>

            {/* Job Type */}
            <div className="">
              <Label className="text-gray-700">
                Job Type<span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.jobType}
                onValueChange={(v) => setForm({ ...form, jobType: v })}
                className=""
              >
                <SelectTrigger className="mt-1 border-gray-300 focus:ring-2 focus:ring-cyan-100 w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Description */}
            <div>
              <Label className="text-gray-700">
                Job Description<span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="jobDesc"
                placeholder="Ex. Describe the job..."
                value={form.jobDesc}
                onChange={handleChange}
                className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 placeholder:text-gray-400"
              />
            </div>

            {/* Candidates */}
            <div>
              <Label className="text-gray-700">
                Number of Candidates Needed
                <span className="text-red-500">*</span>
              </Label>
              <Input
                name="candidate"
                placeholder="Ex. 2"
                type="number"
                value={form.candidate}
                onChange={handleChange}
                className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* Salary */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-gray-700">
                  Minimum Estimated Salary
                </Label>
                <Input
                  name="minSalary"
                  placeholder="Rp 7.000.000"
                  value={form.minSalary}
                  onChange={handleChange}
                  className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
              <div>
                <Label className="text-gray-700">
                  Maximum Estimated Salary
                </Label>
                <Input
                  name="maxSalary"
                  placeholder="Rp 8.000.000"
                  value={form.maxSalary}
                  onChange={handleChange}
                  className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            {/* Minimum Profile Information */}
            <div className="mt-5 border rounded-xl p-5 bg-white shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Minimum Profile Information Required
              </h3>
              {renderRequirementRow("Full name", "fullName")}
              {renderRequirementRow("Photo Profile", "photo")}
              {renderRequirementRow("Gender", "gender")}
              {renderRequirementRow("Domicile", "domicile")}
              {renderRequirementRow("Email", "email")}
              {renderRequirementRow("Phone number", "phone")}
              {renderRequirementRow("LinkedIn link", "linkedin")}
              {renderRequirementRow("Date of birth", "dob")}
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3">
              <Button
                onClick={handleSubmit}
                disabled={!allFilled}
                className={cn(
                  "px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg transition-all shadow-sm",
                  !allFilled && "opacity-50 cursor-not-allowed"
                )}
              >
                Publish Job
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
