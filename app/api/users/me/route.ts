import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      submissions: {
        include: { challenge: true },
        orderBy: { createdAt: "desc" },
      },
      lessonProgress: {
        where: { completed: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { password: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { university, bio, interests } = await req.json();

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { university, bio, interests },
  });

  const { password: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}
