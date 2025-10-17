import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  const { id } = req.query
  try{
    if(req.method === 'GET'){
      // Get client with addresses and services
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, created_at, client_addresses(id, address_text, notes), client_services(service_id, price)')
        .eq('id', id)
        .single()
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'PUT'){
      const { name, email, addresses, services } = req.body
      // Update client basic info
      const { data: client, error: err1 } = await supabase.from('clients').update({ name, email }).eq('id', id).select().single()
      if(err1) throw err1
      // Update addresses: delete old, insert new
      await supabase.from('client_addresses').delete().eq('client_id', id)
      let addrData = []
      if(addresses && addresses.length > 0){
        const { data: addrRes, error: err2 } = await supabase.from('client_addresses').insert(
          addresses.map(a => ({ client_id: id, address_text: a.address_text, notes: a.notes }))
        ).select()
        if(err2) throw err2
        addrData = addrRes
      }
      // Update services: delete old, insert new
      await supabase.from('client_services').delete().eq('client_id', id)
      let servData = []
      if(services && services.length > 0){
        const { data: servRes, error: err3 } = await supabase.from('client_services').insert(
          services.map(s => ({ client_id: id, service_id: s.service_id, price: s.price }))
        ).select()
        if(err3) throw err3
        servData = servRes
      }
      return res.status(200).json({ client, addresses: addrData, services: servData })
    }

    if(req.method === 'DELETE'){
      // Delete client and cascade
      await supabase.from('clients').delete().eq('id', id)
      return res.status(200).json({ deleted: true })
    }

    res.setHeader('Allow', ['GET','PUT','DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}