import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "File CV wajib diupload" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "hiring-management/cv",
          resource_type: "raw", // penting untuk PDF/DOC/DOCX
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      resumeUrl: result.secure_url,
      resumePublicId: result.public_id,
      resumeFileName: file.name,
    });
  } catch (error) {
    console.error("Upload CV error:", error);

    return NextResponse.json(
      { error: "Gagal upload CV ke Cloudinary" },
      { status: 500 }
    );
  }
}