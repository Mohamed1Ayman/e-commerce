import WishlistDetails from "@/components/wishlist/wishlist-details";
import { requireAuth } from "@/lib/require-auth";
import getWishlistProducts from "@/services/wishlist.services";

export default async function WishlistPage() {
  const session = await requireAuth();

  if (!session.accessToken) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          Your session is missing its access token. Please sign out and sign in
          again.
        </p>
      </main>
    );
  }

  try {
    const products = await getWishlistProducts(session.accessToken);
    return <WishlistDetails products={products} />;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load your wishlist.";

    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#26382d]">
          Your wishlist
        </h1>
        <p
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          {message}
        </p>
      </main>
    );
  }
}
