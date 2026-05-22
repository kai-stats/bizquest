import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcLevel } from "@/lib/utils";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { track: true },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { quizScore } = await req.json();

  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId: session.user.id, lessonId: id } },
  });

  if (existing?.completed) {
    return NextResponse.json(existing);
  }

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: id } },
    create: {
      userId: session.user.id,
      lessonId: id,
      completed: true,
      quizScore,
      completedAt: new Date(),
    },
    update: {
      completed: true,
      quizScore,
      completedAt: new Date(),
    },
  });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    const newPoints = user.points + lesson.points;
    const newLevel = calcLevel(newPoints);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { points: newPoints, level: newLevel, lastActiveAt: new Date() },
    });
  }

  return NextResponse.json(progress);
}
