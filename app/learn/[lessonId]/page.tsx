"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { TopBar } from "@/components/nav";

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  points: number;
  track: { title: string; icon: string };
}

const QUIZ_DATA: Record<string, { q: string; options: string[]; answer: number }> = {
  "lesson-target": {
    q: "ターゲットユーザーを絞る主な理由として最も適切なものはどれですか？",
    options: ["より多くの人に届けるため", "メッセージを具体的にして共感を得るため", "コストを増やすため", "競合を意識しないため"],
    answer: 1,
  },
  "lesson-value-prop": {
    q: "価値提案に必ず含むべき要素はどれですか？",
    options: ["会社の歴史", "顧客の悩みへの解決策", "詳細な機能リスト", "価格の安さ"],
    answer: 1,
  },
  "lesson-competitor": {
    q: "ポジショニングマップの目的は何ですか？",
    options: ["競合の売上を調べること", "市場における自社の立ち位置を視覚的に確認すること", "広告の効果を測ること", "従業員の評価をすること"],
    answer: 1,
  },
  "lesson-problem": {
    q: "顧客観察で最も重要な視点はどれですか？",
    options: ["顧客が言ったことをそのまま記録する", "行動の背後にある「なぜ」を考える", "競合より多くのデータを集める", "全員を同じように観察する"],
    answer: 1,
  },
  "lesson-framework": {
    q: "3C分析の「3C」に含まれないものはどれですか？",
    options: ["Customer（顧客）", "Competitor（競合）", "Cost（コスト）", "Company（自社）"],
    answer: 2,
  },
};

export default function LessonPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [phase, setPhase] = useState<"reading" | "quiz" | "done">("reading");
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`).then((r) => r.json()).then(setLesson);
  }, [lessonId]);

  const quiz = QUIZ_DATA[lessonId];

  async function handleSubmitQuiz() {
    if (selected === null) return;
    setSubmitting(true);
    await fetch(`/api/lessons/${lessonId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizScore: selected === quiz?.answer ? 100 : 60 }),
    });
    setPhase("done");
    setSubmitting(false);
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  const contentLines = lesson.content.split("\n");

  return (
    <div className="min-h-screen pb-10">
      <TopBar
        title={`${lesson.track.icon} ${lesson.track.title}`}
        back="/learn"
      />

      <div className="max-w-lg mx-auto px-4 py-6">
        {phase === "reading" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>⏱ {lesson.duration}分</span>
                <span>·</span>
                <span className="text-blue-600 font-medium">+{lesson.points}pt</span>
              </div>
            </div>

            <div className="card p-6 mb-6 prose-sm">
              {contentLines.map((line, i) => {
                if (line.startsWith("## ")) {
                  return <h2 key={i} className="text-lg font-bold text-gray-900 mt-4 mb-2">{line.slice(3)}</h2>;
                } else if (line.startsWith("### ")) {
                  return <h3 key={i} className="font-bold text-gray-800 mt-3 mb-1">{line.slice(4)}</h3>;
                } else if (line.startsWith("**") && line.endsWith("**")) {
                  return <p key={i} className="font-bold text-gray-800 mt-2">{line.slice(2, -2)}</p>;
                } else if (line.startsWith("- ") || line.startsWith("* ")) {
                  return <li key={i} className="ml-4 text-gray-700 text-sm">{line.slice(2)}</li>;
                } else if (line.startsWith("> ")) {
                  return (
                    <blockquote key={i} className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-3 text-sm">
                      {line.slice(2)}
                    </blockquote>
                  );
                } else if (line.startsWith("| ")) {
                  return null;
                } else if (line === "---") {
                  return <hr key={i} className="my-4 border-gray-200" />;
                } else if (line.trim() === "") {
                  return <div key={i} className="h-2" />;
                } else {
                  return <p key={i} className="text-gray-700 text-sm leading-relaxed">{line}</p>;
                }
              })}
            </div>

            <button
              className="btn-primary w-full"
              onClick={() => setPhase("quiz")}
            >
              確認クイズへ進む →
            </button>
          </>
        )}

        {phase === "quiz" && quiz && (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <span>📝</span> 確認クイズ
              </div>
              <h2 className="text-lg font-bold text-gray-900">{quiz.q}</h2>
            </div>

            <div className="space-y-3 mb-8">
              {quiz.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ${
                    selected === i
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            <button
              className="btn-primary w-full"
              onClick={handleSubmitQuiz}
              disabled={selected === null || submitting}
            >
              {submitting ? "確認中..." : "答えを確認する"}
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center py-10">
            <div className="text-6xl mb-4">
              {selected === quiz?.answer ? "🎉" : "📖"}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selected === quiz?.answer ? "正解！" : "惜しい！"}
            </h2>
            <p className="text-gray-500 mb-2">
              {selected === quiz?.answer
                ? "完璧です。次のレッスンに進みましょう！"
                : `正解は「${quiz?.options[quiz.answer ?? 0]}」でした。`}
            </p>
            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl font-bold mb-8">
              <span>⭐</span>
              <span>+{lesson.points}pt 獲得！</span>
            </div>

            <div className="space-y-3">
              <button
                className="btn-primary w-full"
                onClick={() => router.push("/challenges")}
              >
                課題に挑戦する →
              </button>
              <button
                className="btn-secondary w-full"
                onClick={() => router.push("/learn")}
              >
                ← 学習トラックへ戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
