"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { TopBar } from "@/components/nav";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/utils";

interface ChallengeDetail {
  id: string;
  title: string;
  background: string;
  question: string;
  submissionFormat: string;
  criteria: string;
  difficulty: string;
  estimatedTime: number;
  skills: string;
  points: number;
  deadline: string | null;
  lessons: { lesson: { id: string; title: string; duration: number } }[];
  _count: { submissions: number };
}

export default function ChallengeDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const challengeId = params.challengeId as string;

  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [tab, setTab] = useState<"overview" | "lessons">("overview");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/challenges/${challengeId}`).then((r) => r.json()).then(setChallenge);
  }, [challengeId]);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  const skills = JSON.parse(challenge.skills) as string[];
  const criteria = JSON.parse(challenge.criteria) as string[];
  const daysLeft = challenge.deadline
    ? Math.ceil((new Date(challenge.deadline).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="min-h-screen pb-10">
      <TopBar title="課題詳細" back="/challenges" />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 pt-6 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge ${DIFFICULTY_COLORS[challenge.difficulty]} text-xs`}>
              {DIFFICULTY_LABELS[challenge.difficulty]}
            </span>
            {daysLeft !== null && (
              <span className="badge bg-orange-100 text-orange-700 text-xs">残り{daysLeft}日</span>
            )}
            <span className="badge bg-white/20 text-white text-xs">👥 {challenge._count.submissions}人参加</span>
          </div>

          <h1 className="text-xl font-bold text-white mb-3 leading-snug">{challenge.title}</h1>

          <div className="flex items-center gap-4 text-sm text-white/80">
            <span>⏱ {challenge.estimatedTime}分</span>
            <span>·</span>
            <span className="text-yellow-300 font-bold">+{challenge.points}pt</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 -mx-4 px-4">
          {[
            { key: "overview", label: "課題概要" },
            { key: "lessons", label: "参考レッスン" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "overview" | "lessons")}
              className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="space-y-5">
            {/* Background */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>📋</span> 背景
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{challenge.background}</p>
            </div>

            {/* Question */}
            <div className="card p-5 border-l-4 border-blue-500">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>❓</span> 解くべき問い
              </h2>
              <p className="text-gray-800 font-medium text-sm leading-relaxed">{challenge.question}</p>
            </div>

            {/* Submission Format */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>📝</span> 提出形式
              </h2>
              <p className="text-gray-600 text-sm">{challenge.submissionFormat}</p>
            </div>

            {/* Criteria */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>⭐</span> 評価基準
              </h2>
              <ul className="space-y-2">
                {criteria.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500 font-bold mt-0.5">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="card p-5">
              <h2 className="font-bold text-gray-900 mb-3">関連スキル</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="badge bg-blue-50 text-blue-700">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "lessons" && (
          <div className="space-y-3">
            <p className="text-gray-500 text-sm mb-4">
              課題に取り組む前に、これらのレッスンを読んでおくと役立ちます。
            </p>
            {challenge.lessons.length > 0 ? (
              challenge.lessons.map(({ lesson }) => (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow block"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">📚</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{lesson.title}</p>
                    <p className="text-gray-500 text-xs">{lesson.duration}分で読める</p>
                  </div>
                  <span className="text-blue-500 text-sm">→</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">レッスンはありません</p>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 space-y-3">
          <Link
            href={`/challenges/${challenge.id}/submit`}
            className="btn-primary w-full py-4 text-base"
          >
            この課題に挑戦する →
          </Link>
          <Link href="/challenges" className="btn-secondary w-full">
            ← 一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
