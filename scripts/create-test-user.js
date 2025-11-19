const { createClient } = require('@supabase/supabase-js')

async function createTestUser() {
  const supabaseUrl = 'https://rbmvltlazuchttyiffjc.supabase.co'
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXZsdGxhenVjaHR0eWlmZmpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUxNTkwMiwiZXhwIjoyMDc2MDkxOTAyfQ.V8PmWqKZKoXNDYVos2ObDyPZVyQ5ndoWZIIY5l7gFA0'

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const email = 'crm@stonebyric.com'
  const password = 'aaa'

  try {
    console.log('Creando usuario:', email)
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (error) {
      if (error.message.includes('already been registered')) {
        console.log('✓ El usuario ya existe')
      } else {
        console.error('✗ Error creating user:', error.message)
      }
      return
    }

    console.log('✓ Usuario creado exitosamente!')
    console.log('  ID:', data.user.id)
    console.log('  Email:', data.user.email)
    console.log('\nCredenciales:')
    console.log('  Email:', email)
    console.log('  Password:', password)
  } catch (err) {
    console.error('✗ Error inesperado:', err.message)
  }
}

createTestUser()