const { createClient } = require('@supabase/supabase-js')

async function createInitialUser() {
  const supabaseUrl = 'https://rbmvltlazuchttyiffjc.supabase.co'
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXZsdGxhenVjaHR0eWlmZmpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUxNTkwMiwiZXhwIjoyMDc2MDkxOTAyfQ.V8PmWqKZKoXNDYVos2ObDyPZVyQ5ndoWZIIY5l7gFA0'

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'stonebyric@example.com'
  const password = 'ricard0'

  try {
    // Intentar crear el usuario
    const { data, error } = await supabase.auth.admin.createUser({
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