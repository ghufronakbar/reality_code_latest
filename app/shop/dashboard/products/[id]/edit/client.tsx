"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Image from "next/image";
import { formatPrice } from "@/helper/formatPrice";
import { Trash } from "lucide-react";
import ProductGallery from "@/components/products/product-gallery";
import ProductInfo from "@/components/products/product-info";
import ProductTabs from "@/components/products/product-tabs";
import { Seller } from "@prisma/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getVideoEmbed } from "@/helper/getVideoEmbed";
import Link from "next/link";

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  headline: z.string().min(2, "Headline is required"),
  description: z.string().min(10, "Description minimum 10 characters"),
  thumbnailUrl: z.string().url("Thumbnail is required"),
  images: z.array(z.string().url()).min(1, "At least one image required"),
  demoVideoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  price: z.coerce.number().min(0, "Price is required"),
  originalPrice: z.coerce
    .number()
    .min(0, "Original price is required")
    .optional(),
  productCategoryId: z.string().min(1, "Category is required"),
  license: z.string().min(1, "License is required"),
  platforms: z.array(z.string()).min(1, "At least one platform required"),
  tags: z.array(z.string()).optional(),
  keyFeatures: z.array(z.string()).optional(),
  isActive: z.boolean(),
  productSpesifications: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  productTools: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        value: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

type ProductForm = z.infer<typeof productSchema>;
interface Props {
  product: any;
  categories: { id: string; name: string }[];
  seller: Seller;
}

export default function EditProductClient({
  product,
  categories,
  seller,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imagesUploading, setImagesUploading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState<string[]>(
    product.images || []
  );

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      headline: product.headline,
      description: product.description,
      thumbnailUrl: product.thumbnailUrl,
      images: product.images || [],
      demoVideoUrl: product.demoVideoUrl || "",
      price: product.price,
      originalPrice: product.originalPrice,
      productCategoryId: product.productCategoryId,
      license: product.license,
      platforms: product.platforms || [],
      tags: product.tags || [],
      keyFeatures: product.keyFeatures || [],
      isActive: product.isActive,
      productSpesifications: product.productSpesifications || [],
      productTools: product.productTools || [],
    },
    mode: "onTouched",
  });

  // --- Tag Input Helper ---
  function TagInput({
    value,
    onChange,
    placeholder,
  }: {
    value: string[];
    onChange: (v: string[]) => void;
    placeholder: string;
  }) {
    const [input, setInput] = useState("");
    return (
      <div className="flex flex-wrap gap-2 border rounded-md px-2 py-1 bg-background">
        {value.map((tag, i) => (
          <Badge
            key={i}
            className="flex items-center gap-1 bg-muted text-foreground"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-xs"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              &times;
            </button>
          </Badge>
        ))}
        <input
          className="flex-1 min-w-[100px] bg-transparent outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.key === "," || e.key === "Enter") && input.trim()) {
              e.preventDefault();
              if (!value.includes(input.trim()))
                onChange([...value, input.trim()]);
              setInput("");
            } else if (e.key === "Backspace" && !input && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={placeholder}
        />
      </div>
    );
  }

  // --- Image Upload Handler ---
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return;
    setImageUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/image", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.data?.url) {
        form.setValue("thumbnailUrl", data.data.url);
        setImagePreview(data.data.url);
        toast.success("Image uploaded!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  }

  // --- Multi-Image Upload Handler ---
  async function handleImagesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    setImagesUploading(true);
    const files = Array.from(e.target.files);
    const uploaded: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data?.data?.url) {
          uploaded.push(data.data.url);
        }
      } catch {}
    }
    const newImages = [...(form.getValues("images") || []), ...uploaded];
    form.setValue("images", newImages);
    setImagesPreview(newImages);
    setImagesUploading(false);
    if (uploaded.length) toast.success("Images uploaded!");
    else toast.error("Failed to upload images");
  }
  function handleRemoveImage(idx: number) {
    const imgs = [...(form.getValues("images") || [])];
    imgs.splice(idx, 1);
    form.setValue("images", imgs);
    setImagesPreview(imgs);
  }
  function handleReorderImage(from: number, to: number) {
    const imgs = [...(form.getValues("images") || [])];
    const [moved] = imgs.splice(from, 1);
    imgs.splice(to, 0, moved);
    form.setValue("images", imgs);
    setImagesPreview(imgs);
  }

  // --- ProductSpesification CRUD ---
  function handleAddSpec() {
    const specs = form.getValues("productSpesifications") || [];
    form.setValue("productSpesifications", [...specs, { name: "", value: "" }]);
  }
  function handleRemoveSpec(idx: number) {
    const specs = form.getValues("productSpesifications") || [];
    form.setValue(
      "productSpesifications",
      specs.filter((_, i) => i !== idx)
    );
  }
  // --- ProductTool CRUD ---
  function handleAddTool() {
    const tools = form.getValues("productTools") || [];
    form.setValue("productTools", [
      ...tools,
      { name: "", value: "", description: "" },
    ]);
  }
  function handleRemoveTool(idx: number) {
    const tools = form.getValues("productTools") || [];
    form.setValue(
      "productTools",
      tools.filter((_, i) => i !== idx)
    );
  }

  // --- Form Submit ---
  const onSubmit = async (values: ProductForm) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Product updated!");
        router.push(`/shop/dashboard/products`);
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // --- Live Preview Data ---
  const watchAll = form.watch();
  const previewImage =
    imagePreview || watchAll.thumbnailUrl || "/placeholder.png";
  const previewCategory = categories.find(
    (cat) => cat.id === watchAll.productCategoryId
  );

  return (
    <div className="container mx-auto py-10 px-2">
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Basic Info */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>Update your product details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Product name"
                  />
                  {form.formState.errors?.name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    {...form.register("headline")}
                    placeholder="Short headline"
                  />
                  {form.formState.errors?.headline && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.headline.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Full description"
                  />
                  {form.formState.errors?.description && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.description.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 items-center flex gap-2">
                  <Label htmlFor="isActive">Active</Label>
                  <Controller
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Media Card (Thumbnail, Images, Demo Video) */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>
                  Upload a thumbnail, images, and add a demo video.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Thumbnail */}
                <div>
                  <Label>Thumbnail</Label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      id="thumbnailImage"
                      className="hidden"
                    />

                    {(imagePreview || form.watch("thumbnailUrl")) && (
                      <Image
                        src={imagePreview || form.watch("thumbnailUrl")}
                        alt="Preview"
                        width={400}
                        height={300}
                        className="!aspect-[16/9] rounded border w-60 h-auto object-cover"
                      />
                    )}
                  </div>
                  <Input type="hidden" {...form.register("thumbnailUrl")} />
                  {form.formState.errors?.thumbnailUrl && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.thumbnailUrl.message}
                    </p>
                  )}
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="w-fit mt-2"
                    onClick={() => {
                      document.getElementById("thumbnailImage")?.click();
                    }}
                    type="button"
                  >
                    Upload
                  </Button>
                  {imageUploading && (
                    <span className="text-xs">Uploading...</span>
                  )}
                </div>
                {/* Images */}
                <div>
                  <div className="flex flex-col gap-2">
                    <Label>Gallery Images</Label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      id="galleryImages"
                      onChange={handleImagesUpload}
                      disabled={imagesUploading}
                      className="hidden"
                    />
                    <Button
                      variant={"outline"}
                      size={"sm"}
                      className="w-fit"
                      onClick={() => {
                        document.getElementById("galleryImages")?.click();
                      }}
                      type="button"
                    >
                      Upload
                    </Button>
                  </div>
                  {imagesUploading && (
                    <span className="text-xs">Uploading...</span>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagesPreview.map((img, i) => (
                      <div
                        key={i}
                        className="relative group !aspect-[16/9] rounded border h-28"
                      >
                        <Image
                          src={img}
                          alt={`Image ${i + 1}`}
                          width={200}
                          height={160}
                          className="w-full h-28 object-cover !aspect-[16/9]"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 text-xs opacity-80 hover:opacity-100 transition !aspect-square"
                          onClick={() => handleRemoveImage(i)}
                          title="Remove image"
                        >
                          &times;
                        </button>
                        {i > 0 && (
                          <button
                            type="button"
                            className="absolute -bottom-2 left-0 bg-muted text-xs rounded p-1"
                            onClick={() => handleReorderImage(i, i - 1)}
                            title="Move left"
                          >
                            ←
                          </button>
                        )}
                        {i < imagesPreview.length - 1 && (
                          <button
                            type="button"
                            className="absolute -bottom-2 right-0 bg-muted text-xs rounded p-1"
                            onClick={() => handleReorderImage(i, i + 1)}
                            title="Move right"
                          >
                            →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Input type="hidden" {...form.register("images")} />
                  {form.formState.errors?.images && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.images.message}
                    </p>
                  )}
                </div>
                {/* Demo Video */}
                <div>
                  <Label>Demo Video URL</Label>
                  <Input
                    {...form.register("demoVideoUrl")}
                    placeholder="YouTube, Vimeo, or direct video URL (optional)"
                  />
                  {form.watch("demoVideoUrl") &&
                    getVideoEmbed(form.watch("demoVideoUrl") || "") && (
                      <div className="mt-2">
                        <iframe
                          src={
                            getVideoEmbed(form.watch("demoVideoUrl") || "") ||
                            ""
                          }
                          title="Demo Video"
                          className="rounded w-full aspect-video"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </div>
                    )}
                  {form.formState.errors?.demoVideoUrl && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.demoVideoUrl.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Pricing & Category */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Pricing & Category</CardTitle>
                <CardDescription>
                  Set your price and choose a category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...form.register("price", { valueAsNumber: true })}
                      placeholder="Price"
                    />
                    {form.formState.errors?.price && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors?.price.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      {...form.register("originalPrice", {
                        valueAsNumber: true,
                      })}
                      placeholder="Original Price (optional)"
                    />
                    {form.formState.errors?.originalPrice && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors?.originalPrice.message}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="productCategoryId">Category</Label>
                    <Controller
                      control={form.control}
                      name="productCategoryId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors?.productCategoryId && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors?.productCategoryId.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* License */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>License</CardTitle>
                <CardDescription>
                  Choose a license for your product.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name="license"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select license" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "MIT License",
                          "GNU General Public License (GPL)",
                          "Apache License 2.0",
                          "Creative Commons (CC)",
                          "BSD License",
                          "Proprietary License",
                          "Lesser General Public License (LGPL)",
                          "End-User License Agreement (EULA)",
                          "Freeware License",
                          "Software as a Service (SaaS) License",
                        ].map((lic) => (
                          <SelectItem key={lic} value={lic}>
                            {lic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors?.license && (
                  <p className="text-xs text-destructive mt-1">
                    {form.formState.errors?.license.message}
                  </p>
                )}
              </CardContent>
              <CardFooter className="text-xs text-foreground">
                <p>
                  Not sure about the license you want to choose?{" "}
                  <Link href={"/ask/license"} className="underline">
                    {" "}
                    Click here
                  </Link>
                </p>
              </CardFooter>
            </Card>
            {/* Details */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>
                  Platforms, tags, and key features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Platforms</Label>
                  <Controller
                    control={form.control}
                    name="platforms"
                    render={({ field }) => (
                      <TagInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Add platform and press Enter..."
                      />
                    )}
                  />
                  {form.formState.errors?.platforms && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors?.platforms.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Tags</Label>
                  <Controller
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <TagInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Add tag and press Enter..."
                      />
                    )}
                  />
                </div>
                <div>
                  <Label>Key Features</Label>
                  <Controller
                    control={form.control}
                    name="keyFeatures"
                    render={({ field }) => (
                      <TagInput
                        value={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Add feature and press Enter..."
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            {/* ProductSpesification */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
                <CardDescription>
                  Add, edit, or remove product specifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddSpec}
                >
                  + Add Specification
                </Button>
                {(form.watch("productSpesifications") || []).map(
                  (spec, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="Name"
                        value={spec.name}
                        onChange={(e) => {
                          const specs = [
                            ...(form.getValues("productSpesifications") || []),
                          ];
                          specs[idx].name = e.target.value;
                          form.setValue("productSpesifications", specs);
                        }}
                      />
                      <Input
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => {
                          const specs = [
                            ...(form.getValues("productSpesifications") || []),
                          ];
                          specs[idx].value = e.target.value;
                          form.setValue("productSpesifications", specs);
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemoveSpec(idx)}
                        className="!aspect-square flex-shrink-0"
                      >
                        <Trash />
                      </Button>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
            {/* ProductTool */}
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle>Product Tools</CardTitle>
                <CardDescription>
                  Add, edit, or remove product tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddTool}
                >
                  + Add Tool
                </Button>
                {(form.watch("productTools") || []).map((tool, idx) => (
                  <div key={idx} className="flex flex-col gap-2 items-center">
                    <div className="flex flex-row gap-2 items-center w-full">
                      <Input
                        placeholder="Name"
                        value={tool.name}
                        onChange={(e) => {
                          const tools = [
                            ...(form.getValues("productTools") || []),
                          ];
                          tools[idx].name = e.target.value;
                          form.setValue("productTools", tools);
                        }}
                      />
                      <Input
                        placeholder="Value"
                        value={tool.value}
                        onChange={(e) => {
                          const tools = [
                            ...(form.getValues("productTools") || []),
                          ];
                          tools[idx].value = e.target.value;
                          form.setValue("productTools", tools);
                        }}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="!aspect-square flex-shrink-0"
                        onClick={() => handleRemoveTool(idx)}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={tool.description || ""}
                      onChange={(e) => {
                        const tools = [
                          ...(form.getValues("productTools") || []),
                        ];
                        tools[idx].description = e.target.value;
                        form.setValue("productTools", tools);
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-lg h-12 mt-2"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <PreviewProduct product={watchAll} seller={seller} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PreviewProps {
  product: ProductForm;
  seller: Seller;
}

const PreviewProduct = ({ product, seller }: PreviewProps) => {
  return (
    <Card className="bg-background">
      <CardContent className="my-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductGallery
            images={[...product.images, product.thumbnailUrl]}
            video={product.demoVideoUrl || null}
          />
          <ProductInfo
            product={{
              category: {
                name: "Some",
                description: "Some",
                id: "",
                createdAt: new Date(),
                slug: "",
                thumbnailUrl: "",
                updatedAt: new Date(),
              },
              createdAt: new Date(),
              demoVideoUrl: product.demoVideoUrl || null,
              description: product.description,
              headline: product.headline,
              id: "",
              images: product.images,
              isActive: product.isActive,
              isBanned: false,
              isDeleted: false,
              keyFeatures: product.keyFeatures || [],
              license: product.license,
              name: product.name,
              onSale:
                typeof product.price === "number" &&
                typeof product.originalPrice === "number" &&
                product.originalPrice > 0
                  ? product.price < product.originalPrice
                  : false,
              originalPrice: product.originalPrice || 0,
              percentageDiscount:
                typeof product.price === "number" &&
                typeof product.originalPrice === "number" &&
                product.originalPrice > 0
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : 0,
              platforms: product.platforms,
              price: product.price,
              productCategoryId: product.productCategoryId,
              productReviews: [],
              productSpesifications:
                product.productSpesifications?.map(
                  (item: { name: string; value: string }) => ({
                    id: "",
                    name: item.name,
                    productId: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    value: item.value,
                  })
                ) || [],
              productTools:
                product.productTools?.map(
                  (item: {
                    name: string;
                    value: string;
                    description?: string;
                  }) => ({
                    id: "",
                    name: item.name,
                    productId: "",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    value: item.value,
                    description: item.description || "",
                  })
                ) || [],
              rating: 4.8,
              reviewCount: 129,
              seller,
              sellerId: seller.id,
              slug: "",
              tags: product.tags || [],
              thumbnailUrl: product.thumbnailUrl,
              updatedAt: new Date(),
            }}
          />
        </div>

        <ProductTabs
          description={product.description}
          specifications={
            product.productSpesifications?.map(
              (item: { name: string; value: string }) => ({
                id: "",
                name: item.name,
                productId: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                value: item.value,
              })
            ) || []
          }
          tools={
            product.productTools?.map(
              (item: {
                name: string;
                value: string;
                description?: string;
              }) => ({
                id: "",
                name: item.name,
                productId: "",
                createdAt: new Date(),
                updatedAt: new Date(),
                value: item.value,
                description: item.description || "",
              })
            ) || []
          }
          reviews={[]}
        />
      </CardContent>
    </Card>
  );
};
