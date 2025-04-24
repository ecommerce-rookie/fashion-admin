"use client";

import { Button } from "@highschool/ui/components/ui/button";
import { Input } from "@highschool/ui/components/ui/input";
import { HighSchoolAssets, UserPreview } from "@highschool/interfaces";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@highschool/ui/components/ui/sheet";
import { Label } from "@highschool/ui/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@highschool/ui/components/ui/tooltip";
import { Textarea } from "@highschool/ui/components/ui/textarea";
import { IconRepeat } from "@tabler/icons-react";
import { useState } from "react";
import {
  useCheckUsernameQuery,
  useCreateUserMutation,
  useUploaderMutation,
} from "@highschool/react-query/queries";
import { toast } from "sonner";
import { useDebounceValue } from "@highschool/hooks";
import { cn } from "@highschool/ui/lib/utils";

import ImageUploader from "@/components/ui/image-upload";
import { generatePassword } from "@/domain/utils/password";
import { PasswordInput } from "@/components/ui/password-input";
import { AnimatedCheckCircle } from "@/components/core/common/animated-icons/animated-check-circle";
import { AnimatedXCircle } from "@/components/core/common/animated-icons/animated-x-icon";
import { useTable } from "@/stores/table-context";

interface Props {
  currentRow?: UserPreview;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  return <div>okok</div>
}


// export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
//   const { open: typeOpen } = useTable();
//   const title =
//     typeOpen === "add"
//       ? "Add Profile"
//       : typeOpen === "edit"
//         ? "Edit Profile"
//         : "View Profile";

//   const { mutate: createUser, isPending: isCreating } = useCreateUserMutation();

//   const [username, setUsername] = useState<string>(currentRow?.username ?? "");
//   const debouncedUsername = useDebounceValue(username, 1000);
//   const [email, setEmail] = useState<string>(currentRow?.email ?? "");
//   const [password, setPassword] = useState<string>("");
//   const [bio, setBio] = useState<string>("");
//   const [fullName, setFullName] = useState<string>(currentRow?.fullname ?? "");

//   const checkUsername = useCheckUsernameQuery({
//     username: debouncedUsername,
//   });

//   const [singleFile, setSingleFile] = useState<File | null>(null);

//   const uploadImage = useUploaderMutation();

//   const clearFields = () => {
//     setUsername("");
//     setEmail("");
//     setPassword("");
//     setBio("");
//     setFullName("");
//     setSingleFile(null);
//   };

//   const handleUpload = async () => {
//     if (singleFile) {
//       toast.info("Uploading image...");

//       try {
//         // Simulate upload delay
//         const data = await uploadImage.mutateAsync(
//           {
//             image: singleFile,
//             fileName: title,
//             folder: HighSchoolAssets.Test,
//             presetName: "avatar",
//           },
//           {
//             onSuccess: (data) => {
//               return data;
//             },
//           },
//         );

//         toast.success("Image uploaded successfully");

//         return data.data ?? "";
//       } catch {
//         toast.error("Failed to upload image");

//         return "";
//       }
//     }

//     return "";
//   };

//   const validationFields = () => {
//     if (!username && !email && !password && !fullName && !singleFile) {
//       return "Please fill all required fields";
//     }

//     if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
//       return "Invalid email format";
//     }

//     if (username.length < 3) {
//       return "Username must be at least 3 characters";
//     }

//     if (checkUsername.data) {
//       return "Username already exists";
//     }

//     if (fullName.length < 3) {
//       return "Full name must be at least 3 characters";
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!passwordRegex.test(password)) {
//       return "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
//     }

//     if (!singleFile) {
//       return "Please upload an image";
//     }

//     return "";
//   };

//   const handleImageChange = (file: File | null) => {
//     if (file === null) {
//       setSingleFile(null);
//     } else {
//       setSingleFile(file);
//     }
//   };

//   const handleSaveChange = async () => {
//     const error = validationFields();

//     if (error !== "") {
//       toast.error(error);

//       return;
//     }
//     const profilePicture = await handleUpload();

//     createUser({
//       user: {
//         username,
//         email,
//         bio,
//         fullName,
//         password,
//         profilePicture: profilePicture,
//       },
//     });

//     clearFields();
//     onOpenChange(false);
//   };

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent className="overflow-y-auto">
//         <SheetHeader>
//           <SheetTitle>{title}</SheetTitle>
//           <SheetDescription>
//             Make changes to your profile here. Click save when you&apos;re done.
//           </SheetDescription>
//         </SheetHeader>
//         <div className="grid gap-4 overflow-y-auto py-4">
//           <div>
//             <Label className="text-sm font-semibold">
//               Username <span className="text-primary">(required)</span>
//             </Label>
//             <div className="relative">
//               <Input
//                 placeholder="Username"
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <div
//                 className={cn(
//                   "flex h-full items-center justify-center px-3 absolute top-0 right-0",
//                   checkUsername.isLoading
//                     ? "text-gray-200 dark:text-gray-700"
//                     : checkUsername.data === false
//                       ? "text-destructive"
//                       : "text-emerald-500",
//                 )}
//                 style={{
//                   color: checkUsername.isLoading
//                     ? "gray"
//                     : checkUsername.data
//                       ? "red"
//                       : "green",
//                 }}
//               >
//                 {checkUsername.isLoading && checkUsername.data === false ? (
//                   <AnimatedCheckCircle />
//                 ) : (
//                   <AnimatedXCircle />
//                 )}
//               </div>
//             </div>
//           </div>
//           <div>
//             <Label className="text-sm font-semibold">
//               Email <span className="text-primary">(required)</span>
//             </Label>
//             <Input
//               placeholder="Email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div>
//             <Label className="flex justify-between text-sm font-semibold">
//               <div>
//                 Password <span className="text-primary">(required)</span>
//               </div>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <IconRepeat
//                       className="mr-2 cursor-pointer"
//                       size={14}
//                       onClick={() => setPassword(generatePassword())}
//                     />
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Generate Password</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </Label>
//             <PasswordInput
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div>
//             <Label className="text-sm font-semibold">
//               Full name <span className="text-primary">(required)</span>
//             </Label>
//             <Input
//               placeholder="Full name"
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//             />
//           </div>
//           <div>
//             <Label className="text-sm font-semibold">Bio</Label>
//             <Textarea
//               placeholder="Bio"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//             />
//           </div>
//           <div>
//             <ImageUploader
//               defaultMode="single"
//               label="Avatar"
//               maxImages={1}
//               showModeToggle={false}
//               value={currentRow?.profilePicture ?? ""}
//               onChange={(e) => handleImageChange(Array.isArray(e) ? e[0] : e)}
//             />
//           </div>
//         </div>
//         <SheetFooter>
//           <Button type="submit" onClick={handleSaveChange}>
//             Save changes
//           </Button>
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }
