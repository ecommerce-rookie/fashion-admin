import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Category } from "@/services/type/category-type";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/services/query/category-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

// Form schema validation using zod
const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface Props {
  currentRow?: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEditing = !!currentRow;

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: currentRow?.name || "",
      description: currentRow?.description || "",
    },
  });

  // Reset form when the dialog opens or the currentRow changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name || "",
        description: currentRow?.description || "",
      });
    }
  }, [form, currentRow, open]);

  // Get mutation hooks for creating and updating categories
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();

  // Form submission handler
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (isEditing && currentRow) {
        // Update existing category
        await updateCategory.mutateAsync({
          id: currentRow.id.toString(),
          name: data.name,
          description: data.description || "",
        });
      } else {
        // Create new category
        await createCategory.mutateAsync({
          name: data.name,
          description: data.description || "",
        });
      }
      // Close dialog on successful submission
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hooks
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Category" : "Create New Category"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      disabled={createCategory.isPending || updateCategory.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description (optional)"
                      {...field}
                      disabled={createCategory.isPending || updateCategory.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {createCategory.isPending || updateCategory.isPending
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}