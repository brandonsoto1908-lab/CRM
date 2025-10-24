import { supabaseServer } from '../lib/supabaseServerClient'

async function createInitialUser() {
  const email = 'stonebyric@example.com'
  const password = 'ricard0'

  // Check if user exists
  const { data: existingUser } = await supabaseServer.auth.admin.listUsers()
  const userExists = existingUser?.users?.some(u => u.email === email)
  
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
}

createInitialUser()