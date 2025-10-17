import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  try{
    if(req.method === 'GET'){
  const { data, error } = await supabase.from('services').select('id, name, description, price, created_at').order('created_at', { ascending: false })
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
  const { name, description, price } = req.body
  if(!name) return res.status(400).json({ error: 'Name is required' })
  const { data, error } = await supabase.from('services').insert([{ name, description, price }]).select().single()
      if(error) throw error
      return res.status(201).json(data)
    }

    res.setHeader('Allow', ['GET','POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}
