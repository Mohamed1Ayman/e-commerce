import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { message: "You must be signed in to update your cart." },
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
    typeof body.count !== "number" ||
    !Number.isInteger(body.count) ||
    body.count < 1
  ) {
    return Response.json(
      { message: "A positive whole-number count is required." },
      { status: 400 },
    );
  }

  const { productId } = await params;
  if (!productId.trim()) {
    return Response.json(
      { message: "A valid product ID is required." },
      { status: 400 },
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart/${encodeURIComponent(productId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          token: session.accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: body.count }),
        cache: "no-store",
      },
    );
  } catch {
    return Response.json(
      { message: "Unable to connect to the cart service. Please try again." },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { message: "You must be signed in to remove items." },
      { status: 401 },
    );
  }

  const { productId } = await params;
  if (!productId.trim()) {
    return Response.json(
      { message: "A valid product ID is required." },
      { status: 400 },
    );
  }

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart/${encodeURIComponent(productId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          token: session.accessToken,
        },
        cache: "no-store",
      },
    );
  } catch {
    return Response.json(
      { message: "Unable to connect to the cart service. Please try again." },
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
