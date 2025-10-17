-- Supabase/Postgres schema for STONE BY RIC CRM
-- Tables designed to respect up to 3rd normal form

-- services: catalog of available services
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- clients: customer basic info
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

-- client_addresses: clients can have multiple addresses
CREATE TABLE client_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  address_text text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- client_services: many-to-many between clients and services
CREATE TABLE client_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  price numeric(12,2), -- optional override price
  notes text,
  created_at timestamptz DEFAULT now()
);

-- workers
CREATE TABLE workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- routes: a route assigned to a worker
CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES workers(id) ON DELETE SET NULL,
  name text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- route_items: ordered list of client visits for a route
CREATE TABLE route_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  client_address_id uuid REFERENCES client_addresses(id) ON DELETE SET NULL,
  position integer NOT NULL DEFAULT 0, -- ordering index
  specifications text,
  created_at timestamptz DEFAULT now()
);

-- invoices: manual billing records
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE RESTRICT,
  invoice_number text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
  subtotal numeric(12,2) NOT NULL,
  tax numeric(12,2) NOT NULL,
  total numeric(12,2) NOT NULL,
  issued_at timestamptz,
  due_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- invoice_items: the services and prices for an invoice
CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  route_item_id uuid REFERENCES route_items(id) ON DELETE SET NULL,
  description text,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(12,2) NOT NULL,
  amount numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- payments
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  paid_at timestamptz DEFAULT now(),
  method text,
  notes text
);
