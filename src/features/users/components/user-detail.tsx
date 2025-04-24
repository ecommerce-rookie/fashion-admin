// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import {
//   IconBook,
//   IconCalendar,
//   IconClock,
//   IconMail,
//   IconPhone,
//   IconSchool,
//   IconShield,
//   IconUser,
// } from "@tabler/icons-react";
// import { Student, Teacher, User } from "@highschool/interfaces";
// import { useUserDetailQuery } from "@highschool/react-query/queries";

// const isStudent = (user: any): user is Student => {
//   return user.roleName === "Student";
// };

// const isTeacher = (user: any): user is Teacher => {
//   return user.roleName === "Teacher";
// };

// interface UserDetailsModalProps {
//   isOpen: boolean;
//   onOpenChange: () => void;
//   currentUser: User | Teacher | Student;
// }

// export function UserDetailsModal({
//   isOpen,
//   onOpenChange,
//   currentUser,
// }: UserDetailsModalProps) {
//   const [activeTab, setActiveTab] = useState("info");

//   const { data: user, isPending: isUserLoading } = useUserDetailQuery({
//     username: "nglethienduc",
//   });

//   if (isUserLoading) {
//     return (
//       <Dialog open={isUserLoading}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold">
//               Loading...
//             </DialogTitle>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   const userData = user?.data;

//   // Get status color
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       case "Inactive":
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
//       case "Suspended":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
//     }
//   };

//   // Get role icon
//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case "Student":
//         return <IconSchool className="mr-1 size-4" />;
//       case "Teacher":
//         return <IconBook className="mr-1 size-4" />;
//       case "Moderator":
//       case "Admin":
//         return <IconShield className="mr-1 size-4" />;
//       default:
//         return <IconUser className="mr-1 size-4" />;
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">
//             User Details
//           </DialogTitle>
//         </DialogHeader>

//         <div className="flex flex-col items-center py-4">
//           <Avatar className="mb-4 size-20">
//             <AvatarImage
//               alt={userData?.fullname}
//               src={userData?.profilePicture || "/placeholder.svg"}
//             />
//             <AvatarFallback className="text-lg">ok</AvatarFallback>
//           </Avatar>
//           <h2 className="text-xl font-bold">{userData?.fullname}</h2>
//           <div className="mt-1 flex items-center gap-2">
//             <Badge
//               className={`flex items-center ${getStatusColor(userData?.status ?? "")}`}
//               variant="outline"
//             >
//               {userData?.status}
//             </Badge>
//             <Badge className="flex items-center" variant="outline">
//               {getRoleIcon(userData?.roleName ?? "")}
//               {userData?.roleName}
//             </Badge>
//           </div>
//         </div>

//         <Tabs
//           className="w-full"
//           defaultValue="info"
//           value={activeTab}
//           onValueChange={setActiveTab}
//         >
//           <TabsList className="mb-4 grid grid-cols-3">
//             <TabsTrigger value="info">Basic Info</TabsTrigger>
//             <TabsTrigger value="details">Details</TabsTrigger>
//             <TabsTrigger value="activity">Activity</TabsTrigger>
//           </TabsList>

//           <TabsContent className="space-y-4" value="info">
//             <div className="grid gap-3">
//               <div className="flex items-center gap-2">
//                 <IconUser className="text-muted-foreground size-4" />
//                 <span className="text-sm font-medium">Username:</span>
//                 <span className="text-sm">{userData?.username}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <IconMail className="text-muted-foreground size-4" />
//                 <span className="text-sm font-medium">Email:</span>
//                 <span className="text-sm">{userData?.email}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <IconPhone className="text-muted-foreground size-4" />
//                 <span className="text-sm font-medium">Phone:</span>
//                 <span className="text-sm">{userData?.phone}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <IconClock className="text-muted-foreground size-4" />
//                 <span className="text-sm font-medium">Created:</span>
//                 <span className="text-sm">{userData?.createdAt}</span>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="details">
//             {isStudent(userData) && (
//               <div className="grid gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Grade:</span>
//                   <span className="text-sm">{userData?.grade}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Enrollment:</span>
//                   <span className="text-sm">
//                     {userData?.enrollments.length} courses
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">School Name:</span>
//                   <span className="text-sm">{userData?.schoolName}</span>
//                 </div>
//                 <div className="mt-4">
//                   <h3 className="mb-2 text-sm font-semibold">Courses</h3>
//                   <div className="divide-y rounded-md border">
//                     {userData?.enrollments.map((course) => (
//                       <div key={course.id} className="flex justify-between p-2">
//                         <span className="text-sm">{course.name}</span>
//                         {course.grade && (
//                           <span className="text-sm font-medium">
//                             {course.grade}
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {isTeacher(userData) && (
//               <div className="grid gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Verified:</span>
//                   <span className="text-sm">
//                     {userData?.verified ? "Yes" : "No"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Graduation:</span>
//                   <span className="text-sm">
//                     {userData?.graduatedUniversity}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Work Place:</span>
//                   <span className="text-sm">{userData?.workPlace}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Qualification:</span>
//                   <span className="text-sm">{userData?.experienceYears}</span>
//                 </div>
//                 <div className="mt-2">
//                   <h3 className="mb-2 text-sm font-semibold">Subjects</h3>
//                   <div className="flex flex-wrap gap-1">
//                     {userData?.subjectsTaught.map((subject, index) => (
//                       <Badge key={index} variant="secondary">
//                         {subject}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {!isStudent(userData) && !isTeacher(userData) && (
//               <div className="grid gap-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Role:</span>
//                   <span className="text-sm">{userData?.roleName}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Status:</span>
//                   <span className="text-sm">{userData?.status}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-medium">Created At:</span>
//                   <span className="text-sm">{userData?.createdAt}</span>
//                 </div>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent value="activity">
//             <div className="space-y-4">
//               <div className="flex items-start gap-4">
//                 <IconCalendar className="text-muted-foreground mt-0.5 size-5" />
//                 <div>
//                   <p className="text-sm font-medium">Last login</p>
//                   <p className="text-muted-foreground text-sm">
//                     {userData?.lastLoginAt.toString() || "No recent login data"}
//                   </p>
//                 </div>
//               </div>

//               {/* Additional activity information could be added here */}
//               <div className="mt-4 border-t pt-4">
//                 <p className="text-muted-foreground text-sm">
//                   Activity history is limited to the last 30 days.
//                 </p>
//               </div>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   );
// }
