"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Trash } from "lucide-react";
import { toast } from "sonner";

const linkSchema = z.object({
  name: z.string().min(1, "Name required"),
  link: z.string().url("Valid URL required"),
  description: z.string().optional(),
  tier: z.enum(["Free", "Premium"]),
});
const versionSchema = z.object({
  version: z.string().min(1, "Version required"),
  name: z.string().min(1, "Name required"),
  description: z.string().min(1, "Description required"),
  links: z.array(linkSchema).min(1, "At least one link required"),
});
type VersionForm = z.infer<typeof versionSchema>;

export default function NewProductVersionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "links">("info");
  const form = useForm<VersionForm>({
    resolver: zodResolver(versionSchema),
    defaultValues: { version: "", name: "", description: "", links: [] },
    mode: "onTouched",
  });
  function handleAddLink() {
    form.setValue("links", [
      ...(form.getValues("links") || []),
      { name: "", link: "", description: "", tier: "Free" },
    ]);
  }
  function handleRemoveLink(idx: number) {
    const links = [...(form.getValues("links") || [])];
    links.splice(idx, 1);
    form.setValue("links", links);
  }
  async function onSubmit(values: VersionForm) {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${params.id}/version`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        toast.success("Version published!");
        router.push(`/shop/dashboard/products/${params.id}/version`);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to create version");
      }
    } catch {
      toast.error("Failed to create version");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>New Product Version</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs UI */}
          <div className="flex mb-6 border-b">
            <button
              type="button"
              className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${
                activeTab === "info"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Version Info
            </button>
            <button
              type="button"
              className={`px-4 py-2 font-medium border-b-2 transition-colors duration-150 ${
                activeTab === "links"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-primary"
              }`}
              onClick={() => setActiveTab("links")}
            >
              Links
            </button>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Tab Content */}
            {activeTab === "info" && (
              <div className="space-y-6">
                <div>
                  <Label>Version</Label>
                  <Input
                    {...form.register("version")}
                    placeholder="e.g. 1.0.0"
                  />
                  {form.formState.errors.version && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.version.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    {...form.register("name")}
                    placeholder="Version name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Describe this version"
                  />
                  {form.formState.errors.description && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "links" && (
              <div>
                <Label>Links</Label>

                <div className="flex flex-col gap-2">
                  {(form.watch("links") || []).map((link, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col w-full gap-2 items-center md:items-start border rounded p-2 mb-2 bg-muted/50"
                    >
                      <div className="flex flex-col md:flex-row w-full gap-2">
                        <Input
                          className="flex-1"
                          placeholder="Name"
                          value={link.name}
                          onChange={(e) => {
                            const links = [...(form.getValues("links") || [])];
                            links[idx].name = e.target.value;
                            form.setValue("links", links);
                          }}
                        />
                        <Input
                          className="flex-1"
                          placeholder="URL"
                          value={link.link}
                          onChange={(e) => {
                            const links = [...(form.getValues("links") || [])];
                            links[idx].link = e.target.value;
                            form.setValue("links", links);
                          }}
                        />
                      </div>
                      <Textarea
                        className="flex-1"
                        placeholder="Description"
                        value={link.description || ""}
                        onChange={(e) => {
                          const links = [...(form.getValues("links") || [])];
                          links[idx].description = e.target.value;
                          form.setValue("links", links);
                        }}
                      />

                      <div className="flex flex-row gap-2">
                        <Controller
                          control={form.control}
                          name={`links.${idx}.tier` as const}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Tier" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Free">Free</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />

                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          onClick={() => handleRemoveLink(idx)}
                          className="!aspect-square flex-shrink-0"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddLink}
                    className="mb-2 w-fit"
                  >
                    + Add Link
                  </Button>
                  {form.formState.errors.links && (
                    <p className="text-xs text-destructive mt-1">
                      {form.formState.errors.links.message as string}
                    </p>
                  )}
                </div>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full text-lg h-12 mt-8"
            >
              {loading ? "Publishing..." : "Publish Version"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
