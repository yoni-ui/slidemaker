/**
 * Creates the demo user in Supabase. Run: npm run create-test-user
 *
 * Uses service role if SUPABASE_SERVICE_ROLE_KEY is set (creates pre-confirmed user).
 * Otherwise uses signUp (user may need email confirmation in Supabase Dashboard).
 */
import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"

config({ path: ".env.local" })

const email = "demo@example.com"
const password = "demo123"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local")
  process.exit(1)
}

async function main() {
  if (serviceKey) {
    const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) {
      if (error.message.includes("already been registered") || error.message.includes("already exists")) {
        console.log("Demo user already exists. Log in with:")
        console.log("  Email:", email)
        console.log("  Password:", password)
        return
      }
      console.error("Error:", error.message)
      process.exit(1)
    }
    console.log("Demo user created successfully (pre-confirmed)!")
    console.log("  Email:", email)
    console.log("  Password:", password)
    return
  }

  const supabase = createClient(url, anonKey)
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    if (error.message.includes("already registered")) {
      console.log("Demo user already exists. Log in with:")
      console.log("  Email:", email)
      console.log("  Password:", password)
      return
    }
    console.error("Error:", error.message)
    process.exit(1)
  }
  console.log("Demo user created!")
  console.log("  Email:", email)
  console.log("  Password:", password)
  if (data?.user?.identities?.length === 0) {
    console.log("\n  Note: Enable 'Confirm email' in Supabase Dashboard > Auth > Providers.")
    console.log("  Or add SUPABASE_SERVICE_ROLE_KEY to .env.local for pre-confirmed users.")
  }
}

main()
