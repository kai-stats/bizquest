import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skill = searchParams.get("skill");
  const difficulty = searchParams.get("difficulty");
  const sort = searchParams.get("sort") ?? "new";

  const where: Record<string, unknown> = { isActive: true };
  if (difficulty) where.difficulty = difficulty;
  if (skill) {
    where.skills = { contains: skill };
  }

  const orderBy =
    sort === "popular"
      ? { submissions: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const challenges = await prisma.challenge.findMany({
    where,
    orderBy,
    include: {
      _count: { select: { submissions: true } },
    },
  });

  return NextResponse.json(challenges);
}

export async function POST(req: Request) {
  const data = await req.json();
  const challenge = await prisma.challenge.create({ data });
  return NextResponse.json(challenge, { status: 201 });
}
