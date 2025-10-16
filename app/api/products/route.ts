import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch?.[1];

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET || "supersecret");

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);

    const newProduct = await prisma.product.create({ data: { name, description, price } });
    return NextResponse.json(newProduct);
  } catch (err: unknown) {
  console.error(err);
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}

}
