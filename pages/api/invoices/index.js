import { supabaseServer as supabase } from '@/lib/supabaseServerClient'

export default async function handler(req, res) {
  try {
    if(req.method === 'GET'){
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id, invoice_number, status, subtotal, tax, total, 
          issued_at, due_date, notes, created_at,
          clients (id, name, email),
          invoice_items (
            id, description, quantity, price, amount,
            route_items (
              id, specifications,
              routes (id, name, workers(full_name))
            )
          )
        `)
        .order('created_at', { ascending: false })

      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      const { client_id, items, notes } = req.body
      if(!client_id || !items?.length) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      // Calculate total directly from items with exact 2 decimal precision
      const total = Number(items.reduce((sum, item) => {
        const price = Number(item.price) || 0
        const quantity = Number(item.quantity) || 0
        return sum + (price * quantity)
      }, 0).toFixed(2))

      // Generate invoice number (simple sequential for now)
      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('invoice_number')
        .order('created_at', { ascending: false })
        .limit(1)
      
      const lastNumber = lastInvoice?.[0]?.invoice_number?.split('-')[1] || '0'
      const newNumber = String(parseInt(lastNumber) + 1).padStart(6, '0')
      const invoice_number = `INV-${newNumber}`

      // Create invoice
      const { data: invoice, error: err1 } = await supabase
        .from('invoices')
        .insert([{
          client_id,
          invoice_number,
          status: 'draft',
          subtotal: total, // Total amount
          tax: 0, // No tax applied
          total, // Same as subtotal
          notes,
          discount_amount: 0 // No discount applied
        }])
        .select()
        .single()

      if(err1) throw err1

      // Create invoice items
      const { data: invoiceItems, error: err2 } = await supabase
        .from('invoice_items')
        .insert(
          items.map(item => ({
            invoice_id: invoice.id,
            route_item_id: item.route_item_id,
            service_id: item.service_id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            amount: Number((item.price * item.quantity).toFixed(2))
          }))
        )
        .select()

      if(err2) throw err2

      return res.status(201).json({ ...invoice, items: invoiceItems })
    }

    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}