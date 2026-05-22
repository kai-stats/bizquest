import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcLevel } from "@/lib/utils";

const MOCK_FEEDBACK_TEMPLATES = [
  {
    good: "顧客視点がしっかりと捉えられており、ターゲットユーザーへの理解が深まっています。具体的な施策が提案されており、実現可能性を感じます。",
    improve: "競合他社との差別化がより明確になると、提案の説得力が高まります。また、コスト面の考慮も加えると実践的になります。",
    next: "実際の顧客インタビューを想定した場合、どんな質問をしますか？顧客の潜在的なニーズを深掘りしてみましょう。",
  },
  {
    good: "問題の本質を捉えた良い分析です。独自のアイデアが光っており、差別化ポイントが明確です。",
    improve: "施策の優先順位と実施順序をより具体的に示すと、実行計画として完成度が上がります。",
    next: "この施策のKPIとしてどんな指標を設定しますか？成功の定義を明確にしてみましょう。",
  },
  {
    good: "ビジネスの構造をよく理解した上で提案ができています。論理的な流れで読みやすい提案です。",
    improve: "数値的な根拠（例：集客数の目標値や費用対効果）があると、ビジネス的な説得力が格段に上がります。",
    next: "この施策を3ヶ月試した後、次のステップとして何を考えますか？スケールアップの方法を考えてみましょう。",
  },
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { challengeId, title, content, targetUser, approach, reasoning, references } =
    await req.json();

  const existing = await prisma.submission.findFirst({
    where: { userId: session.user.id, challengeId },
  });

  if (existing) {
    return NextResponse.json({ error: "すでに提出済みです" }, { status: 400 });
  }

  const template = MOCK_FEEDBACK_TEMPLATES[Math.floor(Math.random() * MOCK_FEEDBACK_TEMPLATES.length)];
  const score = Math.floor(Math.random() * 21) + 70;
  const pointsEarned = 50;

  const submission = await prisma.submission.create({
    data: {
      userId: session.user.id,
      challengeId,
      title,
      content,
      targetUser,
      approach,
      reasoning,
      references,
      status: "reviewed",
      feedbackGood: template.good,
      feedbackImprove: template.improve,
      feedbackNext: template.next,
      feedbackScore: score,
      pointsEarned,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user) {
    const newPoints = user.points + pointsEarned;
    const newLevel = calcLevel(newPoints);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { points: newPoints, level: newLevel, lastActiveAt: new Date() },
    });
  }

  return NextResponse.json(submission, { status: 201 });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const submissionId = searchParams.get("id");

  if (submissionId) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { challenge: true },
    });
    return NextResponse.json(submission);
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    include: { challenge: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}
