import { createClient } from "@/app/lib/supabase/server";
import LogoutButton from "@/app/components/LogoutButton";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nama = user?.user_metadata?.username ?? user?.email;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-gray-900">CareerPlace</h1>
      <p className="text-gray-700">Halo, {nama}!</p>
      <LogoutButton />
    </main>
  );
}