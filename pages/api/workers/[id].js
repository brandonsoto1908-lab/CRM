import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default async function handler(req, res){
  const { id } = req.query
  try{
    if(req.method === 'GET'){
      const { data, error } = await supabase
        .from('workers')
        .select('id, full_name, email, phone, created_at')
        .eq('id', id)
        .single()
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'PUT'){
      const { full_name, email, phone } = req.body
      const { data, error } = await supabase.from('workers').update({ full_name, email, phone }).eq('id', id).select().single()
      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'DELETE'){
      await supabase.from('workers').delete().eq('id', id)
      return res.status(200).json({ deleted: true })
    }

    res.setHeader('Allow', ['GET','PUT','DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: err.message || 'Server error' })
  }
}