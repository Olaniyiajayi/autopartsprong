import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/lib/cognito";

export type PaymentType = "ACCOUNT" | "CASH" | "CAPRICORN";
export type ContactType = "CUSTOMER" | "SUPPLIER" | "BOTH";

export interface Address {
  attention?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}

export interface ContactPost {
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  account_number?: string;
  is_hidden?: boolean;
  payment_type?: PaymentType;
  delivery_address: Address;
  same_as_delivery_address?: boolean;
  billing_address: Address;
  note?: string;
  contact_type?: ContactType;
}

export interface ContactPut {
  contact_id: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  account_number?: string;
  is_hidden?: boolean;
  payment_type?: PaymentType;
  delivery_address: Address;
  same_as_delivery_address?: boolean;
  billing_address: Address;
  note?: string;
  contact_type?: ContactType;
}

export interface Contact extends ContactPost {
  contact_id: string;
  tenant_id: string;
  contact_status: string;
  created_at: string;
  updated_at: string;
}

const getHeaders = async () => {
  let token = "";
  try {
    const sSession = await supabase.auth.getSession();
    if (sSession.data.session?.access_token) {
      token = sSession.data.session.access_token;
    } else {
      const cSession = getSession();
      if (cSession?.idToken) {
        token = cSession.idToken;
      }
    }
  } catch (e) {
    console.error("Auth session fetch error:", e);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const createContact = async (data: ContactPost) => {
  const apiUrl = (import.meta.env.VITE_API_URL || "https://3jksg6k247.execute-api.us-east-1.amazonaws.com/dev").replace(/\/$/, "");
  const headers = await getHeaders();

  const res = await fetch(`${apiUrl}/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create contact");
  }

  return res.json();
};

export const updateContact = async (data: ContactPut) => {
  const apiUrl = (import.meta.env.VITE_API_URL || "https://3jksg6k247.execute-api.us-east-1.amazonaws.com/dev").replace(/\/$/, "");
  const headers = await getHeaders();

  const res = await fetch(`${apiUrl}/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update contact");
  }

  return res.json();
};

export const getContacts = async (filters: { contact_type?: ContactType; limit?: number; last_evaluated_key?: string } = {}): Promise<{ items: Contact[]; last_evaluated_key?: any }> => {
  const apiUrl = (import.meta.env.VITE_API_URL || "https://3jksg6k247.execute-api.us-east-1.amazonaws.com/dev").replace(/\/$/, "");
  const headers = await getHeaders();

  const queryParams = new URLSearchParams();
  if (filters.contact_type) queryParams.append("contact_type", filters.contact_type);
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.last_evaluated_key) queryParams.append("last_evaluated_key", filters.last_evaluated_key);

  const queryString = queryParams.toString();
  const url = queryString ? `${apiUrl}/?${queryString}` : `${apiUrl}/`;

  const res = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch contacts");
  }

  const data = await res.json();
  
  // Handle both old and new formats for robustness
  if (Array.isArray(data)) {
    return { items: data };
  }
  
  return {
    items: data.items || [],
    last_evaluated_key: data.last_evaluated_key
  };
};

export const getContact = async (contactId: string): Promise<Contact> => {
  const apiUrl = (import.meta.env.VITE_API_URL || "https://3jksg6k247.execute-api.us-east-1.amazonaws.com/dev").replace(/\/$/, "");
  const headers = await getHeaders();

  const res = await fetch(`${apiUrl}/?contact_id=${contactId}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch contact");
  }

  return res.json();
};
