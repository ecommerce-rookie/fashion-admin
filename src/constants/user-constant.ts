import {
  IconSchool,
  IconShield,
  IconUsersGroup,
  IconUserShield,
} from "@tabler/icons-react";

export const callTypes = new Map<string, string>([
  ["Active", "bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200"],
  ["Pending", "bg-neutral-300/40 border-neutral-300"],
  ["Deleted", "bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300"],
  [
    "Blocked",
    "bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10",
  ],
]);

export const userTypes = [
  {
    label: "Admin",
    value: "Admin",
    icon: IconShield,
  },
  {
    label: "Moderator",
    value: "Moderator",
    icon: IconUserShield,
  },
  {
    label: "Student",
    value: "Student",
    icon: IconUsersGroup,
  },
  {
    label: "Teacher",
    value: "Teacher",
    icon: IconSchool,
  },
] as const;
