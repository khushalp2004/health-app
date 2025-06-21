import PatientForms from "@/components/forms/PatientForm";
import { PasskeyModal } from "@/components/ui/PasskeyModal";
import Image from "next/image";
import Link from "next/link";

export default function Home({searchParams}:SearchParamProps) {
  const isAdmin=searchParams.admin==='true';
  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Left Panel - Scrollable content */}
      {isAdmin && <PasskeyModal/>}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600/50 scrollbar-track-gray-900">
        <div className="min-h-screen flex flex-col items-center">
          <div className="w-full max-w-lg px-6 py-12 md:py-20">
            {/* Logo and Title */}
            <div className="flex items-center justify-start mb-3 mt-15">
                <Image
                  src="/logo.png"
                  width={28}
                  height={28}
                  alt="MediSlot Logo"
                  className="rounded-lg ml-2"
                />
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                MediSlot
              </span>
            </div>

            {/* Form Container */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded p-8 shadow-xl">
              <PatientForms />
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <div className="flex justify-between max-w-xs mx-auto text-sm text-gray-400">
                <p>© 2024 MediSlot</p>
                <Link 
                  href="/?admin=true" 
                  className="font-medium text-blue-700 hover:text-blue-600 transition-colors"
                >
                  Admin
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-600">
                Elevating healthcare through technology
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Fixed image */}
      <div className="hidden lg:block relative w-[40%]">
        <div className="fixed top-0 right-0 bottom-0 w-[40%] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/30 to-transparent z-10" />
          <Image
            src="/doctor.jpeg"
            alt="Healthcare professional"
            fill
            className="object-cover object-left"
            quality={100}
            priority
          />
          <div className="absolute bottom-10 left-10 right-10 z-20">
            <h3 className="text-2xl font-bold text-white mb-2">Your Health Journey Starts Here</h3>
            <p className="text-gray-300 max-w-md">
              Join thousands of patients who found their perfect healthcare match through MediSlot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}