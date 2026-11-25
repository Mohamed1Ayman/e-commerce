import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { message: "You must be signed in to add items to your wishlist." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (
    !isRecord(body) ||
    typeof body.productId !== "string" ||
    !body.productId.trim()
  ) {
    return Response.json(
      { message: "A valid productId is required." },
      { status: 400 },
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(
      "https://ecommerce.routemisr.com/api/v1/wishlist",
      {
        method: "POST",
        headers: {
          token: session.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: body.productId }),
        cache: "no-store",
      },
    );
  } catch {
    return Response.json(
      { message: "Unable to connect to the wishlist service. Please try again." },
      { status: 502 },
    );
  }

  const responseBody = await upstreamResponse.text();
  return new Response(responseBody || null, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type":
        upstreamResponse.headers.get("content-type") ?? "application/json",
    },
  });
}
