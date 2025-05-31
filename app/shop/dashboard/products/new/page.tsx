import { db } from "@/config/db";
import NewProductPageClient from "./client";

const getCategories = async () => {
  return await db.productCategory.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

const NewProductPage = async () => {
  const categories = await getCategories();
  return <NewProductPageClient categories={categories} />;
};

export default NewProductPage;
