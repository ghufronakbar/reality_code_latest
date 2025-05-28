import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "@/constants/cloudinary";

cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
};

export const getOptimizedImageUrl = (url: string, options: { width?: number; height?: number; quality?: number } = {}) => {
  const { width, height, quality = 80 } = options;
  let transformations = `q_${quality},f_auto`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  
  return url.replace("/upload/", `/upload/${transformations}/`);
};

export default cloudinary;