import { db } from "@/config/db";
import { serverSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function ProductVersionListPage({ params }: { params: { id: string } }) {
  const session = await serverSession();
  if (!session?.user?.id) return <div className="p-8">Unauthorized</div>;
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      versions: {
        include: { links: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!product) return <div className="p-8">Product not found</div>;
  return (
    <div className="container mx-auto py-10 px-2">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Version Control</h1>
        <Link href={`/shop/dashboard/products/${params.id}/version/new`}>
          <Button variant="default">+ New Version</Button>
        </Link>
      </div>
      {product.versions.length === 0 ? (
        <Card className="mb-4">
          <CardContent className="p-6 text-center text-muted-foreground">
            No versions published yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {product.versions.map((version) => (
            <div
              key={version.id}
              className="flex flex-col md:flex-row gap-4 border rounded-lg bg-background/80 p-4 items-stretch"
            >
              {/* Info Left */}
              <div className="flex-1 min-w-0 flex flex-col gap-2 justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">v{version.version}</Badge>
                  <span className="font-bold text-lg truncate">{version.name}</span>
                </div>
                <div className="text-muted-foreground text-sm truncate" title={version.description}>{version.description}</div>
                <div className="text-xs text-muted-foreground mt-1">Published: {new Date(version.createdAt).toLocaleString()}</div>
              </div>
              {/* Links Right */}
              <div className="flex-1 flex flex-wrap gap-3 items-start justify-end md:justify-end">
                {version.links.length === 0 ? (
                  <span className="text-muted-foreground text-xs">No links</span>
                ) : (
                  version.links.map((link: any) => (
                    <div
                      key={link.id}
                      className="flex flex-col items-start border rounded px-3 py-2 bg-muted/50 min-w-[160px] max-w-xs"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant={link.tier === "Premium" ? "destructive" : "outline"}>{link.tier}</Badge>
                        <span className="font-medium text-xs truncate">{link.name}</span>
                      </div>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline break-all"
                      >
                        {link.link}
                      </a>
                      {link.description && (
                        <div className="text-xs text-muted-foreground italic mt-1 truncate" title={link.description}>
                          {link.description}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 