"use client";

import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { getVideoEmbed } from "@/helper/getVideoEmbed";

interface ProductGalleryProps {
  images: string[];
  video: string | null;
}

export default function ProductGallery({ images, video }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border">
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-zoom-in">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={selectedImage}
                  alt="Product image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </AspectRatio>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="relative w-full overflow-hidden rounded-lg">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={selectedImage}
                  alt="Product image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </AspectRatio>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`aspect-square cursor-pointer rounded-md overflow-hidden border transition-all ${
              selectedImage === image
                ? "ring-2 ring-primary ring-offset-2"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        {video && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="aspect-square cursor-pointer rounded-md overflow-hidden border relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/70 transition-colors">
                  <Play className="h-8 w-8 text-white" />
                </div>
                {getVideoEmbed(video) && (
                  <iframe
                    src={getVideoEmbed(video || undefined) || ""}
                    title="Demo Video"
                    className="rounded w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
                <div className="h-full w-full bg-muted" />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="relative w-full overflow-hidden rounded-lg">
                <AspectRatio ratio={16 / 9}>
                  {getVideoEmbed(video) && (
                    <iframe
                      src={getVideoEmbed(video) || ""}
                      title="Demo Video"
                      className="rounded w-full aspect-video"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  )}
                </AspectRatio>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
