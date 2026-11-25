import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      { message: "You must be signed in to add items." },
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
    !body.productId.trim() ||
    (body.count !== undefined &&
      (typeof body.count !== "number" ||
        !Number.isInteger(body.count) ||
        body.count < 1 ||
        body.count > 99))
  ) {
    return Response.json(
      { message: "A valid productId and quantity from 1 to 99 are required." },
      { status: 400 },
    );
  }

  const count = typeof body.count === "number" ? body.count : 1;
  let upstreamResponse: Response | undefined;

  for (let addedCount = 0; addedCount < count; addedCount += 1) {
    try {
      upstreamResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v2/cart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            token: session.accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: body.productId }),
          cache: "no-store",
        },
      );
    } catch {
      return Response.json(
        {
          message:
            addedCount > 0
              ? `Added ${addedCount} of ${count} items before the cart service connection failed.`
              : "Unable to connect to the cart service. Please try again.",
        },
        { status: 502 },
      );
    }

    if (!upstreamResponse.ok) {
      if (addedCount > 0) {
        return Response.json(
          {
            message: `Added ${addedCount} of ${count} items before the cart service returned an error.`,
          },
          { status: 502 },
        );
      }

      break;
    }
  }

  if (!upstreamResponse) {
    return Response.json(
      { message: "The cart service did not return a response." },
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
