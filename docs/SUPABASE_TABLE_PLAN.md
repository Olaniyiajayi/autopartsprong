# Supabase Table Plan – AutoParts Pro NG

This document defines the database schema for AutoParts Pro NG using Supabase (PostgreSQL). The app is **multi-tenant**: **tenants** (organizations) own all business data, and **users are assigned to tenants**. Each tenant can have multiple users; a user can be assigned to one or more tenants with a role per tenant.

---

## Multi-tenant model (overview)

- **Tenants** = `public.organizations` (e.g. "Lagos Central Branch", "Kano Hub"). Each tenant has its own customers, parts, invoices, and orders.
- **Users** = `auth.users` + `public.profiles`. A user signs up once; they do not "belong" to a tenant until assigned.
- **Assignment** = `public.organization_members`. Each row means "user X is assigned to tenant Y with role Z." Tenants have users assigned to them; users see only data for tenants they are a member of.
- **RLS**: All tenant-scoped tables restrict access to rows where `organization_id` is in the set of tenants the current user is a member of (via `organization_members`).

---

## 1. Account & signup

Supabase provides `auth.users`; you extend it with **profiles** (global user info) and **organization_members** (tenant assignments and per-tenant roles).

### 1.1 `auth.users` (Supabase-managed)

Used for signup/login. You do not create this table; Supabase maintains it.

| Column (typical) | Type | Notes |
|------------------|------|--------|
| id | uuid | PK, use as `user_id` in your tables |
| email | text | Unique |
| encrypted_password | text | Managed by Supabase |
| email_confirmed_at | timestamptz | |
| created_at, updated_at | timestamptz | |
| raw_user_meta_data | jsonb | Signup payload (e.g. display_name) |
| raw_app_meta_data | jsonb | App-specific (e.g. role) |

**Signup flow:**  
User signs up via Supabase Auth (`signUp({ email, password })`). Optionally set `raw_user_meta_data` (e.g. `{ "full_name": "Alex" }`). A trigger creates a row in `public.profiles`. The user has **no tenant access** until an admin adds them to a tenant via `organization_members` (invite/assign flow).

---

### 1.2 `public.profiles`

One row per user; extends `auth.users` with **global** app fields. Tenant membership and roles live in `organization_members`, not here.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| email | text | NOT NULL | | Denormalized from auth for easy querying |
| full_name | text | YES | | Display name |
| avatar_url | text | YES | | Profile image URL |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Primary key:** `id`  
**Unique:** `id`

**RLS:**  
- Enable RLS.  
- Select: user can read own profile (`auth.uid() = id`); optionally allow members of the same tenant(s) to read basic profile (e.g. for "assigned users" lists).  
- Update: `auth.uid() = id` (users edit own profile only).  
- Insert: from trigger on `auth.users` only (or service role).

**Trigger (recommended):**  
On `auth.users` AFTER INSERT, insert into `public.profiles (id, email, full_name)` from `NEW`.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 1.3 `public.organizations` (tenants)

**Tenants** in the app (stores/hubs). All business data is scoped by `organization_id`.  

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| name | text | NOT NULL | | e.g. "Lagos Central Branch" |
| slug | text | NOT NULL | | Unique, e.g. "lagos-central" |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Unique:** `slug`  
**Indexes:** `organizations_slug_idx (slug)`

**RLS:**  
- Enable RLS.  
- Select: user can read organizations where they are a member (exists in `organization_members` for that org).  
- Insert/update/delete: restrict to users with role `owner` or `admin` in that org (check `organization_members.role`).

---

### 1.4 `public.organization_members` (tenant–user assignment)

Assigns **users to tenants** and gives a **role per tenant**. Tenants "have users assigned"; this table is the source of truth.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| organization_id | uuid | NOT NULL | | FK → `organizations(id)` ON DELETE CASCADE |
| user_id | uuid | NOT NULL | | FK → `auth.users(id)` ON DELETE CASCADE |
| role | text | NOT NULL | | `owner`, `admin`, `store_manager`, `viewer` (per tenant) |
| invited_by | uuid | YES | | FK → `auth.users(id)`; who added this user |
| invited_at | timestamptz | NOT NULL | `now()` | |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Unique:** `(organization_id, user_id)` — a user can be assigned to a tenant only once; role is updated in place.  
**Indexes:**  
- `organization_members_organization_id_idx (organization_id)`  
- `organization_members_user_id_idx (user_id)`

**RLS:**  
- Enable RLS.  
- Select: user can see rows where `user_id = auth.uid()` (own memberships) or where they are `owner`/`admin` in that `organization_id` (to manage members).  
- Insert: only `owner` or `admin` of the organization (add/invite users to the tenant).  
- Update: only `owner` or `admin` (e.g. change role).  
- Delete: only `owner` or `admin` (remove user from tenant); optionally allow user to delete own row (leave tenant).

**App behavior:**  
- After login, resolve "current tenant" (e.g. first membership or last-used tenant from session).  
- All queries filter by `organization_id` = current tenant; RLS enforces that the user has a row in `organization_members` for that tenant.

---

## 2. Customers

Stores buyers and business partners (Add New Customer form + Customers list).

### 2.1 `public.customers`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| organization_id | uuid | NOT NULL | | FK → `organizations(id)`; tenant scope |
| name | text | NOT NULL | | Full name |
| phone | text | NOT NULL | | e.g. "+234 803 123 4567" |
| business_name | text | YES | | Shop or company name |
| email | text | YES | | |
| market_location_id | uuid | YES | | FK → `market_locations(id)` |
| notes | text | YES | | Special instructions / preferences |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Indexes:**  
- `customers_organization_id_idx (organization_id)`  
- `customers_phone_idx (phone)`  
- `customers_name_trgm_idx` (GIN on `name gin_trgm_ops`) for search by name/phone if using pg_trgm

**RLS:**  
- Enable RLS.  
- Policies: allow CRUD only if the current user is a member of the row's `organization_id` (exists in `organization_members` for that org).

**Derived fields (not stored):**  
- **Orders:** `COUNT(orders.id)`  
- **Total spent:** `SUM(orders.total_amount)` or from `invoices`  
- **Last order:** `MAX(orders.created_at)` or from `invoices`

---

### 2.2 `public.market_locations`

Reference table for “Market Location” dropdown (Add Customer form).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| name | text | NOT NULL | | e.g. "Ladipo Market", "Aspamda" |
| sort_order | int | NOT NULL | `0` | For dropdown order |
| created_at | timestamptz | NOT NULL | `now()` | |

**Unique:** `name` (or per-org if you scope by `organization_id`)

---

## 3. Parts (inventory)

Single part listing (Add Part form + Bulk Upload rows).

### 3.1 `public.parts`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| organization_id | uuid | NOT NULL | | FK → `organizations(id)`; tenant scope |
| part_type | text | NOT NULL | | e.g. "Brake Pads", "Alternator" |
| vehicle_model | text | NOT NULL | | e.g. "Camry", "Corolla" |
| year_range | text | NOT NULL | | e.g. "2018-2023" |
| local_nickname | text | YES | | e.g. "Evil Spirit", "Big Daddy" |
| sku | text | NOT NULL | | Part number / SKU; unique per org |
| condition | text | NOT NULL | | e.g. "TOKUNBO", "NEW", "NIGERIAN" |
| category | text | YES | | e.g. "engine-components" |
| display_name | text | YES | | Generated name for listing |
| price_naira | decimal(14,2) | YES | | Price in Naira (N) |
| quantity_in_stock | int | NOT NULL | `0` | Stock count (low-stock alerts) |
| created_by | uuid | YES | | FK → `auth.users(id)` |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Unique:** `(organization_id, sku)`  
**Indexes:**  
- `parts_organization_id_idx (organization_id)`  
- `parts_sku_idx (sku)`  
- `parts_condition_idx (condition)`  
- `parts_vehicle_model_idx (vehicle_model)`  
- Optional: GIN on `part_type`, `vehicle_model` for search

**RLS:**  
- Enable RLS.  
- Policies: CRUD only if the current user is a member of the row's `organization_id` (exists in `organization_members`).

---

## 4. Invoices

Invoice header (Invoices page: ID, date, customer, amount, status, payment via).

### 4.1 `public.invoices`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| organization_id | uuid | NOT NULL | | FK → `organizations(id)`; tenant scope |
| invoice_number | text | NOT NULL | | e.g. "INV-8821"; unique per org |
| customer_id | uuid | NOT NULL | | FK → `customers(id)` |
| status | text | NOT NULL | | `draft`, `awaiting_payment`, `paid`, `overdue`, `cancelled` |
| total_amount_naira | decimal(14,2) | NOT NULL | | Total in Naira |
| payment_via | text | YES | | e.g. "OPay", "Moniepoint", "Kuda Bank", "Bank Transfer" |
| due_at | date | YES | | For overdue logic |
| paid_at | timestamptz | YES | | When marked paid |
| created_by | uuid | YES | | FK → `auth.users(id)` |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Unique:** `(organization_id, invoice_number)`  
**Indexes:**  
- `invoices_organization_id_idx (organization_id)`  
- `invoices_customer_id_idx (customer_id)`  
- `invoices_status_idx (status)`  
- `invoices_created_at_idx (created_at DESC)`

**RLS:**  
- Enable RLS.  
- Policies: CRUD only if the current user is a member of the row's `organization_id` (exists in `organization_members`).

---

### 4.2 `public.invoice_lines`

Line items per invoice (part, quantity, unit price, amount).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| invoice_id | uuid | NOT NULL | | FK → `invoices(id)` ON DELETE CASCADE |
| part_id | uuid | YES | | FK → `parts(id)`; NULL if ad-hoc description |
| description | text | YES | | Fallback when no part (e.g. "Engine Oil (5 Cartons)") |
| quantity | int | NOT NULL | `1` | |
| unit_price_naira | decimal(14,2) | NOT NULL | | |
| line_total_naira | decimal(14,2) | NOT NULL | | quantity * unit_price_naira |
| created_at | timestamptz | NOT NULL | `now()` | |

**Indexes:** `invoice_lines_invoice_id_idx (invoice_id)`

**RLS:**  
- Enable RLS.  
- Policies: allow access if user can access parent `invoices` row.

**Trigger (optional):**  
Before INSERT/UPDATE, set `line_total_naira = quantity * unit_price_naira`.  
After INSERT/UPDATE/DELETE on `invoice_lines`, recalc and update `invoices.total_amount_naira`.

---

## 5. Orders / transactions (optional)

If “Recent Transactions” and “Last order” are first-class entities (not only from invoices), add an **orders** table and optionally link invoices to orders.

### 5.1 `public.orders`

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|--------|
| id | uuid | NOT NULL | `gen_random_uuid()` | PK |
| organization_id | uuid | NOT NULL | | FK → `organizations(id)`; tenant scope |
| customer_id | uuid | NOT NULL | | FK → `customers(id)` |
| invoice_id | uuid | YES | | FK → `invoices(id)`; one-to-one or one invoice per order |
| total_amount_naira | decimal(14,2) | NOT NULL | | |
| payment_via | text | YES | | |
| status | text | NOT NULL | | e.g. `pending`, `paid`, `cancelled` |
| created_at | timestamptz | NOT NULL | `now()` | |
| updated_at | timestamptz | NOT NULL | `now()` | |

**Indexes:**  
- `orders_organization_id_idx (organization_id)`  
- `orders_customer_id_idx (customer_id)`  
- `orders_created_at_idx (created_at DESC)`

**RLS:**  
- Same pattern as invoices: CRUD only if the current user is a member of the row's `organization_id` (exists in `organization_members`).

Then you can compute **customer orders count**, **total spent**, and **last order** from `orders` (or from `invoices` if you treat invoice as the main “order” record).

---

## 6. Summary: tables and relationships

| Table | Purpose |
|-------|--------|
| `auth.users` | Supabase auth (signup/login) – managed |
| `public.profiles` | App user profile (global: name, avatar) |
| `public.organizations` | Tenants (stores/hubs) |
| `public.organization_members` | Tenant–user assignment (user assigned to tenant + role per tenant) |
| `public.market_locations` | Dropdown for customer market location |
| `public.customers` | Customers (name, phone, location, notes) |
| `public.parts` | Inventory parts (SKU, type, vehicle, condition, price, stock) |
| `public.invoices` | Invoice header (number, customer, status, total, payment) |
| `public.invoice_lines` | Invoice line items (part, qty, price) |
| `public.orders` | Optional – orders/transactions for dashboard and customer stats |

**Relationships (high level):**  
- `organization_members.organization_id` → `organizations.id`  
- `organization_members.user_id` → `auth.users.id`  
- `customers.market_location_id` → `market_locations.id`  
- `customers.organization_id` → `organizations.id`  
- `parts.organization_id` → `organizations.id`  
- `invoices.customer_id` → `customers.id`  
- `invoices.organization_id` → `organizations.id`  
- `invoice_lines.invoice_id` → `invoices.id`  
- `invoice_lines.part_id` → `parts.id`  
- `orders.customer_id` → `customers.id`  
- `orders.organization_id` → `organizations.id`  
- `orders.invoice_id` → `invoices.id` (optional)

---

## 7. RLS helper (multi-tenant)

Use a shared helper so policies stay consistent. Example:

```sql
-- Returns true if the current user is a member of the given organization
CREATE OR REPLACE FUNCTION public.user_has_org_access(org_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

Then tenant-scoped table policies use:  
`WHERE user_has_org_access(organization_id)` (for SELECT/UPDATE/DELETE) and  
`WITH CHECK (user_has_org_access(organization_id))` (for INSERT).

---

## 8. Supabase setup checklist

1. Create project and get URL + anon/service keys.  
2. Run migrations (or SQL Editor) to create:  
   - `profiles` (+ trigger on `auth.users`).  
   - `organizations` (tenants).  
   - `organization_members` (tenant-user assignment).  
   - `market_locations`.  
   - `customers`.  
   - `parts`.  
   - `invoices`.  
   - `invoice_lines`.  
   - `orders` (optional).  
3. Create `user_has_org_access(org_id)` (or equivalent) for RLS.  
4. Enable RLS on all `public` tables; policies must check membership via `organization_members`.  
5. Seed `market_locations` (Ladipo Market, Aspamda, Ikorodu, etc.).  
6. In the app: use Supabase Auth for signup/login; after login, resolve current tenant from `organization_members` and scope all queries by that `organization_id`.

This gives you a detailed table plan for a **multi-tenant** app where tenants have users assigned, with account/signup on Supabase.
