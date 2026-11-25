import type { ReactNode } from "react";
import Navbar from "@/components/common/navbar/page";
import { requireAuth } from "@/lib/require-auth";
import { getCartItemCount } from "@/services/cart.services";

export default async function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAuth();
  let cartItemCount: number | undefined;

  if (session.accessToken) {
    try {
      cartItemCount = await getCartItemCount(session.accessToken);
    } catch (error) {
      console.error("Could not load the cart item count.", error);
    }
  }

  return (
    <>
      <Navbar
        isAuthenticated={Boolean(session)}
        cartItemCount={cartItemCount}
      />
      {children}
    </>
  );
}
