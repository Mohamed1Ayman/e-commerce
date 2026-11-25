import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import LogoutButton from "@/components/auth/logout-button";

export default async function GlobalLogout() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <div className="flex justify-end border-b border-[#e9ede9] bg-[#f7f9f7] px-4 py-2 sm:px-6 lg:px-8">
      <LogoutButton />
    </div>
  );
}
