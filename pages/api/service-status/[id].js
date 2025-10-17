import { supabaseServer as supabase } from '@/lib/supabaseServerClient'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    if(req.method === 'GET'){
      const { data, error } = await supabase
        .from('service_status')
        .select()
        .eq('id', id)
        .single()

      if(error) throw error
      if(!data) return res.status(404).json({ error: 'Service status not found' })
      return res.status(200).json(data)
    }

    if(req.method === 'PUT'){
      const { status, notes } = req.body
      const { data, error } = await supabase
        .from('service_status')
        .update({
          status,
          notes,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id)
        .select()
        .single()

      if(error) throw error
      return res.status(200).json(data)
    }

    if(req.method === 'DELETE'){
      const { error } = await supabase
        .from('service_status')
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