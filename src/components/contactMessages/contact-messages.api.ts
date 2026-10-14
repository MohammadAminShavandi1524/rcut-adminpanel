export interface ContactMessage {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  message: string;
  created: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw data ?? {
      message: `Request failed with status ${response.status}`,
    };
  }

  return data as T;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const response = await fetch("/api/contact-messages", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<ContactMessage[]>(response);
}

export async function getContactMessage(
  id: number | string,
): Promise<ContactMessage> {
  const response = await fetch(
    `/api/contact-messages/${encodeURIComponent(String(id))}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  return parseResponse<ContactMessage>(response);
}

export async function deleteContactMessage(
  id: number | string,
): Promise<unknown> {
  const response = await fetch(
    `/api/contact-messages/${encodeURIComponent(String(id))}`,
    {
      method: "DELETE",
    },
  );

  return parseResponse<unknown>(response);
}