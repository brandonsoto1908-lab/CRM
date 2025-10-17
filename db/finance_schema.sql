-- Tabla para registrar el estado de los servicios realizados
CREATE TABLE service_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_item_id uuid REFERENCES route_items(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Tabla para las facturas
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

-- Tabla para los items de la factura
CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  route_item_id uuid REFERENCES route_items(id),
  service_id uuid REFERENCES services(id),
  description text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price numeric(12,2) NOT NULL,
  amount numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabla para los pagos
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL,
  payment_method text NOT NULL,
  payment_date timestamptz NOT NULL,
  reference_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);