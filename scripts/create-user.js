const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas')
  process.exit(1)
}

const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)

async function createInitialUser() {
  const email = 'stonebyric@example.com'
  const password = 'ricard0'

  try {
    // Check if user exists
    const { data: { users }, error: listError } = await supabaseServer.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error listing users:', listError.message)
      return
    }

    const userExists = users?.some(u => u.email === email)
    if (userExists) {
      console.log('Usuario ya existe')
      return
    }

    // Create user
    const { data, error } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      console.error('Error creating user:', error.message)
      return
    }

    console.log('Usuario creado exitosamente:', data.user.id)
  } catch (err) {
    console.error('Error inesperado:', err.message)
  }
}

createInitialUser()