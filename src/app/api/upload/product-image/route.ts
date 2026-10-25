import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

const s3 = new S3Client({
  region: process.env.ARVAN_REGION!,
  endpoint: process.env.ARVAN_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.ARVAN_ACCESS_KEY!,
    secretAccessKey: process.env.ARVAN_SECRET_KEY!,
  },
});

export async function POST(req: Request) {
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

    const requiredEnvironmentVariables = [
      "ARVAN_REGION",
      "ARVAN_ENDPOINT",
      "ARVAN_ACCESS_KEY",
      "ARVAN_SECRET_KEY",
      "ARVAN_BUCKET",
      "ARVAN_BUCKET_URL",
    ] as const;

    const missingVariables = requiredEnvironmentVariables.filter(
      (key) => !process.env[key]?.trim(),
    );

    if (missingVariables.length > 0) {
      console.error(
        "PRODUCT UPLOAD CONFIG ERROR: Missing variables:",
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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "تصویر محصول انتخاب نشده است.",
        },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "فقط فرمت‌های JPG، PNG و WEBP مجاز هستند.",
        },
        { status: 400 },
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "حجم تصویر باید بیشتر از صفر و حداکثر ۵ مگابایت باشد.",
        },
        { status: 400 },
      );
    }

    const extension = ALLOWED_TYPES.get(file.type)!;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${crypto.randomUUID()}.${extension}`;
    const objectKey = `products/images/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.ARVAN_BUCKET!,
        Key: objectKey,
        Body: buffer,
        ContentType: file.type,
        ContentDisposition: "inline",
        ACL: "public-read",
      }),
    );

    const baseUrl = process.env.ARVAN_BUCKET_URL!;

    const url = `${baseUrl.replace(/\/$/, "")}/${objectKey}`;

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error: unknown) {
    const awsError = error as {
      name?: string;
      message?: string;
      Code?: string;
      $metadata?: {
        httpStatusCode?: number;
        requestId?: string;
      };
    };

    console.error("PRODUCT IMAGE UPLOAD ERROR =>", {
      name: awsError?.name,
      message: awsError?.message,
      code: awsError?.Code,
      status: awsError?.$metadata?.httpStatusCode,
      requestId: awsError?.$metadata?.requestId,
    });

    const code = awsError?.Code || awsError?.name || "UPLOAD_FAILED";

    return NextResponse.json(
      {
        success: false,
        message: "آپلود تصویر در فضای ابری ناموفق بود.",
        code,
      },
      { status: 500 },
    );
  }
}
