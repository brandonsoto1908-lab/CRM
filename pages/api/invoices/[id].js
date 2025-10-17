import { supabaseServer as supabase } from '@/lib/supabaseServerClient'

export default async function handler(req, res) {
  const { id } = req.query

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
          ),
          payments (id, amount, payment_method, payment_date, reference_number)
        `)
        .eq('id', id)
        .single()

      if(error) throw error
      if(!data) return res.status(404).json({ error: 'Invoice not found' })
      return res.status(200).json(data)
    }

    if(req.method === 'PUT'){
      const { status, notes, issued_at, due_date } = req.body
      const { data, error } = await supabase
        .from('invoices')
        .update({ status, notes, issued_at, due_date })
        .eq('id', id)
        .select()
        .single()

      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'DELETE'){
      // Only allow deletion of draft invoices
      const { data: invoice } = await supabase
        .from('invoices')
        .select('status')
        .eq('id', id)
        .single()

      if(invoice?.status !== 'draft') {
        return res.status(400).json({ error: 'Only draft invoices can be deleted' })
      }

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)

      if(error) throw error
      return res.status(204).end()
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}