"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

export const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);

    if (path)
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
  }, [encryptedKey]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);

      localStorage.setItem("accessKey", encryptedKey);

      setOpen(false);
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        className={`space-y-5 bg-gray-950 border-gray-900 outline-none !important`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="w-full flex justify-between !important">
              <InputOTPSlot
                className="text-3xl justify-center flex border border-blue-700/55 rounded-lg size-16 gap-4 !important"
                index={0}
              />
              <InputOTPSlot
                className="text-3xl justify-center flex border border-blue-700/55 rounded-lg size-16 gap-4 !important"
                index={1}
              />
              <InputOTPSlot
                className="text-3xl justify-center flex border border-blue-700/55 rounded-lg size-16 gap-4 !important"
                index={2}
              />
              <InputOTPSlot
                className="text-3xl justify-center flex border border-blue-700/55 rounded-lg size-16 gap-4 !important"
                index={3}
              />
              <InputOTPSlot
                className="text-3xl justify-center flex border border-blue-700/55 rounded-lg size-16 gap-4 !important"
                index={4}
              />
              <InputOTPSlot
                className="text-3xl justify-center flex border border-blue-700/55 rounded-lg size-16 gap-4 !important"
                index={5}
              />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="text-red-800 mt-2 flex justify-center">{error}</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="bg-blue-800 w-full "
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};