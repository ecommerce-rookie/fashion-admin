


import { useTable } from "@/stores/table-context";
import { OrderActionDialog } from "./order-action-dialog";
import { OrderUpdateDialog } from "./order-delete-dialog";

export function OrderDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTable();

  return (
    <>
      <OrderActionDialog
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

          <OrderActionDialog
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

          <OrderUpdateDialog
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
