export interface CreateCatalogPayload {
  title: string;
  description: string;
  image: string;
  brand_id: number;
  cover: string;
  file: string;
}

export type CatalogMediaKind = "cover" | "image" | "pdf";

interface UploadResponse {
  success?: boolean;
  url?: string;
  message?: string;
  detail?: string;
  code?: string;
}

async function parseResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.detail;

    throw new Error(
      typeof detail === "string"
        ? detail
        : typeof detail?.detail === "string"
          ? detail.detail
          : "ثبت کاتالوگ ناموفق بود.",
    );
  }

  return data;
}

export async function createCatalog(payload: CreateCatalogPayload) {
  const response = await fetch("/api/catalog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
}

export function uploadCatalogMedia(
  file: File,
  kind: CatalogMediaKind,
  onProgress?: (percentage: number) => void,
): Promise<string> {
  const form = new FormData();

  form.append("file", file);
  form.append("kind", kind);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/api/upload/catalog");
    xhr.timeout = 180000;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onerror = () => {
      reject(new Error("اتصال هنگام آپلود فایل قطع شد."));
    };

    xhr.onabort = () => {
      reject(new Error("آپلود فایل لغو شد."));
    };

    xhr.ontimeout = () => {
      reject(new Error("زمان آپلود فایل به پایان رسید."));
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
        !data.url
      ) {
        const message =
          data?.message || data?.detail || "آپلود فایل ناموفق بود.";

        const code = data?.code ? ` (${data.code})` : "";

        reject(new Error(`${message}${code}`));
        return;
      }

      onProgress?.(100);
      resolve(data.url);
    };

    xhr.send(form);
  });
}
