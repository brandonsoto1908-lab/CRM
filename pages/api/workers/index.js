import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  try{
    if(req.method === 'GET'){
      const { data, error } = await supabase
        .from('workers')
        .select('id, full_name, email, phone, created_at')
        .order('created_at', { ascending: false })
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'POST'){
      const { full_name, email, phone } = req.body
      if(!full_name) return res.status(400).json({ error: 'Full name is required' })
      const { data, error } = await supabase.from('workers').insert([{ full_name, email, phone }]).select().single()
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