import { z } from "zod";
import { ProductSize, ProductStatus } from "@/services/type/product-type";

export const productUpdateSchema = z.object({
  Name: z.string().min(3, "Product name must be at least 3 characters"),
  UnitPrice: z.coerce.number().positive("Unit price must be positive"),
  PurchasePrice: z.coerce.number().positive("Purchase price must be positive"),
  Description: z.string().min(10, "Description must be at least 10 characters"),
  Status: z.nativeEnum(ProductStatus),
  CategoryId: z.coerce.number().positive("Category is required"),
  Quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
  Sizes: z.array(z.nativeEnum(ProductSize)).min(1, "At least one size must be selected"),
  Gender: z.string().min(1, "Gender is required"),
  slug: z.string(),
  images: z.array(z.string()),
  Files: z.array(z.object({
    file: z.instanceof(File).optional(),
    order: z.number()
  })).optional()
});

export type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>;