import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  try{
    if(req.method === 'GET'){
      // List clients with addresses and services
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, created_at, client_addresses(id, address_text, notes), client_services(service_id, price)')
        .order('created_at', { ascending: false })
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      const { name, email, addresses, services } = req.body
      if(!name) return res.status(400).json({ error: 'Name is required' })
      // Create client
      const { data: client, error: err1 } = await supabase.from('clients').insert([{ name, email }]).select().single()
      if(err1) throw err1
      // Add addresses
      let addrData = []
      if(addresses && addresses.length > 0){
        const { data: addrRes, error: err2 } = await supabase.from('client_addresses').insert(
          addresses.map(a => ({ client_id: client.id, address_text: a.address_text, notes: a.notes }))
        ).select()
        if(err2) throw err2
        addrData = addrRes
      }
      // Add services
      let servData = []
      if(services && services.length > 0){
        const { data: servRes, error: err3 } = await supabase.from('client_services').insert(
          services.map(s => ({ client_id: client.id, service_id: s.service_id, price: s.price }))
        ).select()
        if(err3) throw err3
        servData = servRes
      }
      return res.status(201).json({ client, addresses: addrData, services: servData })
    }

    res.setHeader('Allow', ['GET','POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}