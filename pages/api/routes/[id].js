import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  const { id } = req.query
  try{
    if(req.method === 'GET'){
      // Get route with worker and items
      const { data, error } = await supabase
        .from('routes')
        .select(`
          id, name, notes, worker_id, created_at,
          workers(id, full_name),
          route_items(
            id, client_id, client_address_id, position, specifications,
            clients(id, name, email),
            client_addresses(id, address_text, notes)
          )
        `)
        .eq('id', id)
        .single()
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'PUT'){
      const { name, notes, worker_id, items } = req.body
      // Update route
      const { data: route, error: err1 } = await supabase
        .from('routes')
        .update({ name, notes, worker_id })
        .eq('id', id)
        .select()
        .single()
      if(err1) throw err1

      // Update items: delete old ones first
      await supabase.from('route_items').delete().eq('route_id', id)
      
      // Insert new items if any
      let itemData = []
      if(items && items.length > 0){
        const { data: itemRes, error: err2 } = await supabase
          .from('route_items')
          .insert(
            items.map((it, idx) => ({
              route_id: id,
              client_id: it.client_id,
              client_address_id: it.client_address_id,
              position: idx,
              specifications: it.specifications
            }))
          )
          .select()
        if(err2) throw err2
        itemData = itemRes
      }
      return res.status(200).json({ route, items: itemData })
    }

    if(req.method === 'DELETE'){
      await supabase.from('routes').delete().eq('id', id)
      return res.status(200).json({ deleted: true })
    }

    res.setHeader('Allow', ['GET','PUT','DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}