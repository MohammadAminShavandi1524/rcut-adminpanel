import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MAX_COVER_SIZE = 5 * 1024 * 1024;


const IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "ورود به حساب کاربری الزامی است.",
        },
        { status: 401 },
      );
    }

    const requiredVariables = [
      "ARVAN_REGION",
      "ARVAN_ENDPOINT",
      "ARVAN_ACCESS_KEY",
      "ARVAN_SECRET_KEY",
      "ARVAN_BUCKET",
      "ARVAN_BUCKET_URL",
    ] as const;

    const missingVariables = requiredVariables.filter(
      (key) => !process.env[key]?.trim(),
    );

    if (missingVariables.length > 0) {
      console.error(
        "CATALOG STORAGE CONFIG ERROR:",
        missingVariables,
      );

      return NextResponse.json(
        {
          success: false,
          message: "تنظیمات فضای ذخیره‌سازی کامل نیست.",
          code: "STORAGE_CONFIG_MISSING",
        },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const kind = formData.get("kind");

    if (kind !== "cover" && kind !== "pdf") {
      return NextResponse.json(
        {
          success: false,
          message: "نوع فایل آپلود مشخص نیست.",
        },
        { status: 400 },
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "فایل انتخاب نشده است.",
        },
        { status: 400 },
      );
    }

    let extension: string;
    let contentType: string;
    let objectFolder: string;

    if (kind === "cover") {
      const imageExtension = IMAGE_TYPES.get(file.type);

      if (!imageExtension) {
        return NextResponse.json(
          {
            success: false,
            message: "فرمت کاور باید JPG، PNG یا WEBP باشد.",
          },
          { status: 400 },
        );
      }

      if (
        file.size === 0 ||
        file.size > MAX_COVER_SIZE
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "حداکثر حجم کاور ۵ مگابایت است.",
          },
          { status: 400 },
        );
      }

      extension = imageExtension;
      contentType = file.type;
      objectFolder = "catalogs/covers";
    } else {
      if (
        !file.name.toLowerCase().endsWith(".pdf") ||
        !["application/pdf", ""].includes(file.type)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "فقط فایل PDF مجاز است.",
          },
          { status: 400 },
        );
      }

      if (file.size === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "فایل PDF نباید خالی باشد.",
          },
          { status: 400 },
        );
      }

      extension = "pdf";
      contentType = "application/pdf";
      objectFolder = "catalogs/files";
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const s3 = new S3Client({
      region: process.env.ARVAN_REGION!,
      endpoint: process.env.ARVAN_ENDPOINT!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.ARVAN_ACCESS_KEY!,
        secretAccessKey: process.env.ARVAN_SECRET_KEY!,
      },
    });

    const objectKey =
      `${objectFolder}/${crypto.randomUUID()}.${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET!,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
        ContentDisposition: "inline",
        ACL: "public-read",
      }),
    );

    const baseUrl =
      process.env.ARVAN_BUCKET_URL!.replace(/\/$/, "");

    return NextResponse.json({
      success: true,
      url: `${baseUrl}/${objectKey}`,
    });
  } catch (error: unknown) {
    const uploadError = error as {
      name?: string;
      message?: string;
      Code?: string;
    };

    console.error("CATALOG UPLOAD ERROR:", {
      name: uploadError?.name,
      message: uploadError?.message,
      code: uploadError?.Code,
    });

    return NextResponse.json(
      {
        success: false,
        message: "آپلود فایل کاتالوگ ناموفق بود.",
        code:
          uploadError?.Code ||
          uploadError?.name ||
          "UPLOAD_FAILED",
      },
      { status: 500 },
    );
  }
}