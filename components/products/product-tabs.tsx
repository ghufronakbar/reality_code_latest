"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Circle, Pointer, Star } from "lucide-react";
import {
  ProductReview,
  ProductSpesification,
  ProductTool,
  User,
} from "@prisma/client";
import { formatDate } from "@/helper/formatDate";
import Image from "next/image";

interface ProductTabsProps {
  description: string;
  specifications: ProductSpesification[];
  tools: ProductTool[];
  reviews: (ProductReview & { reviewer: Partial<User> })[];
  isSeller?: boolean;
}

export default function ProductTabs({
  description,
  specifications,
  tools,
  reviews,
  isSeller = false,
}: ProductTabsProps) {
  return (
    <div className="mt-12">
      <Tabs defaultValue="description">
        <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto flex items-center flex-wrap">
          <TabsTrigger
            value="description"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="specifications"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger
            value="requirements"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
          >
            Tools & Requirements
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
          >
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specifications.map((specGroup, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-3">{specGroup.name}</h3>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">
                    {specGroup.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="mt-6">
          <div className="space-y-6">
            {tools.map((t) => (
              <div key={t.id}>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Circle className="w-2 h-2" /> {t.value} ({t.name})
                </h3>
                <p className="text-muted-foreground">{t.description}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-row items-center gap-4">
                      <Image
                        src={
                          review.reviewer.profilePictureUrl ||
                          "/default-avatar.png"
                        }
                        alt={""}
                        className="w-auto h-full aspect-square rounded-full object-cover"
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium line-clamp-1">
                            {review.reviewer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt, true)}
                          </span>
                        </div>
                        <div className="flex mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(review.rating)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium bg-muted px-2 py-1 rounded">
                      {/* {review.verified ? "Verified Purchase" : "Unverified"}TODO */}
                      Verified Purchase
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium">{review.title}</h4>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
