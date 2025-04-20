import { GetAllCategories } from "../api/category-api";

export const useCategoriesQuery = () => {
    const queryKey = ['categories'];
    const queryFn = async () => {
        return GetAllCategories();
    }

    return { queryKey, queryFn };
}