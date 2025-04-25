


import { useTable } from "@/stores/table-context";
import { CategoryActionDialog } from "./category-action-dialog";
import { CategoryDeleteDialog } from "./category-delete-dialog";

export function CategoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTable();

  return (
    <>
      <CategoryActionDialog
        key="user-add"
        open={open === "add"}
        onOpenChange={() => setOpen("add")}
      />

      {currentRow && (
        <>
          {/* <UserDetailsModal
            currentUser={currentRow}
            isOpen={open === "view"}
            onOpenChange={() => {
              setOpen("view");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
          /> */}

          <CategoryActionDialog
            key={`user-edit-${currentRow.id}`}
            currentRow={currentRow}
            open={open === "edit"}
            onOpenChange={() => {
              setOpen(open);
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
          />

          <CategoryDeleteDialog
            key={`user-delete-${currentRow.id}`}
            currentRow={currentRow}
            open={open === "delete"}
            onOpenChange={() => {
              setOpen("delete");
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
          />
        </>
      )}
    </>
  );
}
