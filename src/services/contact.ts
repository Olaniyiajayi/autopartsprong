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

export const createContact = async (data: ContactPost) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";
  
  const res = await fetch(`${apiUrl}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create contact");
  }

  return res.json();
};
