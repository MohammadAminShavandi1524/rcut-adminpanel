import {
  getCategories,
  type Category,
} from "@/components/categories/categories.api";

export type { Category };

export const getLeafCategories = async (): Promise<Category[]> => {
  const categories = await getCategories();

  return categories.filter((category) => category.child_count === 0);
};

export interface CreateProductPayload {
  name: string;
  description: string;
  image: string;
  category_id: number;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail;

    throw new Error(
      typeof detail === "string" ? detail : "درخواست با خطا مواجه شد.",
    );
  }

  return data;
}

export async function createProduct(payload: CreateProductPayload) {
  return parseResponse(
    await fetch("/api/shop/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }),
  );
}

interface UploadResponse {
  success?: boolean;
  url?: string;
  message?: string;
  detail?: string;
  code?: string;
}

export async function uploadProductImage(
  file: File,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  const form = new FormData();

  form.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload/product-image");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onerror = () => {
      reject(new Error("اتصال هنگام آپلود تصویر قطع شد."));
    };

    xhr.onabort = () => {
      reject(new Error("آپلود تصویر لغو شد."));
    };

    xhr.ontimeout = () => {
      reject(new Error("زمان آپلود تصویر به پایان رسید."));
    };

    xhr.onload = () => {
      let data: UploadResponse | null = null;

      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // Invalid JSON response.
      }

      if (
        xhr.status < 200 ||
        xhr.status >= 300 ||
        data?.success !== true ||
        !data?.url
      ) {
        const message =
          data?.message || data?.detail || "آپلود تصویر ناموفق بود.";

        const code = data?.code ? ` (${data.code})` : "";

        reject(new Error(`${message}${code}`));

        return;
      }

      resolve(data.url);
    };

    xhr.send(form);
  });
}
