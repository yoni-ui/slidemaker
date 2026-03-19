/**
 * Creates the test user in Supabase. Run: npm run create-test-user
 */
import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"

config({ path: ".env.local" })

const email = "yonas.yishac@gmail.com"
const password = "123456"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  process.exit(1)
}

const supabase = createClient(url, anonKey)

async function main() {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    if (error.message.includes("already registered")) {
      console.log("Test user already exists. You can log in with:")
      console.log("  Email:", email)
      console.log("  Password:", password)
      return
    }
    console.error("Error:", error.message)
    process.exit(1)
  }
  console.log("Test user created successfully!")
  console.log("  Email:", email)
  console.log("  Password:", password)
  if (data?.user?.identities?.length === 0) {
    console.log("  (User may need to confirm email in Supabase Dashboard)")
  }
}

main()
