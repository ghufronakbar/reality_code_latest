import { NextRequest, NextResponse } from "next/server";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "@/config/cloudinary";

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "reality_code",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({
        status: 400,
        message: "Harap upload gambar",
      });
    }

    const fileBuffer = await image.arrayBuffer();

    const mimeType = image.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const res = await uploadToCloudinary(fileUri, image.name);
    if (res.success && res.result) {
      return NextResponse.json({
        status: 200,
        message: "Success to upload image",
        data: { url: res.result.secure_url },
      });
    }

    return NextResponse.json(
      { status: 500, message: "Gagal upload gambar" },
      {
        status: 500,
      }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { status: 500, message: "Gagal upload gambar", error: error },
      {
        status: 500,
      }
    );
  }
}
