"use client";

import { useState } from "react";
import { IconAlertTriangle } from "@tabler/icons-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { User, UserStatus } from "@/services/type/user-type";
import { useUpdateUserStatusMutation } from "@/services/query/user-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: User;
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const [value, setValue] = useState("");
  const { mutateAsync: updateUser } = useUpdateUserStatusMutation();
  const [statusSelected, setStatusSelected] = useState<UserStatus>(
    UserStatus[currentRow.status as keyof typeof UserStatus],
  );

  const handleDelete = async () => {
    if (value.trim() !== currentRow.id) return;

    await updateUser({
      userId: currentRow.id,
      status: statusSelected,
    });

    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      destructive
      confirmText="Delete"
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{" "}
            <span className="font-bold">{currentRow.firstName ?? "" + " " + currentRow.lastName}</span>?
            <br />
            This action will permanently remove the user with the role of{" "}
            <span className="font-bold">
              {currentRow.role?.toUpperCase()}
            </span>{" "}
            from the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Username:
            <Input
              placeholder="Enter username to confirm deletion."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </Label>

          <Select
            value={statusSelected}
            onValueChange={(value) => setStatusSelected(value as UserStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(UserStatus).map(
                  (status) =>
                  (
                    <SelectItem key={status} value={status}>
                      <SelectLabel>{status}</SelectLabel>
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can be affected directly to
              user.
            </AlertDescription>
          </Alert>
        </div>
      }
      disabled={value.trim() !== currentRow.email}
      handleConfirm={handleDelete}
      open={open}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{" "}
          Delete User
        </span>
      }
      onOpenChange={onOpenChange}
    />
  );
}
