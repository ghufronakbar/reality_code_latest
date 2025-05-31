import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Suspense } from "react";
import { formatPrice } from "@/helper/formatPrice";
import { Badge } from "@/components/ui/badge";

async function getSellerProducts({
  sellerId,
  status,
  category,
}: {
  sellerId: string;
  status?: string;
  category?: string;
}) {
  return db.product.findMany({
    where: {
      sellerId,
      isDeleted: false,
      ...(status === "active" ? { isActive: true, isBanned: false } : {}),
      ...(status === "inactive" ? { isActive: false, isBanned: false } : {}),
      ...(status === "banned" ? { isBanned: true } : {}),
      ...(category ? { productCategoryId: category } : {}),
    },
    include: {
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getCategories() {
  return db.productCategory.findMany({ orderBy: { name: "asc" } });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    category?: string;
    search?: string;
  }>;
}) {
  const session = await serverSession();
  if (!session?.user?.id) {
    return <div className="p-8 text-center">Not authorized</div>;
  }
  const seller = await db.seller.findUnique({
    where: { userId: session.user.id },
  });
  if (!seller) {
    return <div className="p-8 text-center">No seller found</div>;
  }
  const categories = await getCategories();
  const { category, search, status } = await searchParams;
  const qStatus = status && status !== "all" ? status : "";
  const qCategory = category && category !== "all" ? category : "";
  const qSearch = search || "";
  let products = await getSellerProducts({
    sellerId: seller.id,
    status: qStatus,
    category: qCategory,
  });
  if (qSearch) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(qSearch.toLowerCase())
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              name="search"
              placeholder="Search by name..."
              defaultValue={qSearch}
              className="w-full md:w-64"
            />
            <Select name="status" defaultValue={status || "all"}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select name="category" defaultValue={category || "all"}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="md:ml-auto">
              Filter
            </Button>
            <Link href="/shop/dashboard/products/new">
              <Button type="button" variant="default">
                + Add Product
              </Button>
            </Link>
          </form>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category?.name || "-"}</TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-2">
                        {formatPrice(product.price)}
                        {!!product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.originalPrice, true)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.isBanned ? (
                        <span className="text-destructive">Banned</span>
                      ) : product.isActive ? (
                        <span className="text-success">Active</span>
                      ) : (
                        <span className="text-muted-foreground">Inactive</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row gap-2">
                        <Link
                          href={`/shop/dashboard/products/${product.id}/edit`}
                        >
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Link
                          href={`/shop/dashboard/products/${product.id}/version`}
                        >
                          <Button size="sm" variant="secondary">
                            Version Control
                          </Button>
                        </Link>
                        <Link href={`/shop/dashboard/products/${product.id}`}>
                          <Button size="sm" variant="default">
                            Preview
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
