"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/nav";
import { getLevelName, getNextLevelPoints, DIFFICULTY_COLORS, DIFFICULTY_LABELS } from "@/lib/utils";

interface UserData {
  name: string;
  points: number;
  level: number;
  streak: number;
  submissions: { id: string; challenge: { title: string } }[];
  lessonProgress: { id: string }[];
}

interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  estimatedTime: number;
  skills: string;
  points: number;
  _count: { submissions: number };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/users/me").then((r) => r.json()).then(setUser);
    fetch("/api/challenges?sort=new").then((r) => r.json()).then((data) => setChallenges(data.slice(0, 3)));
  }, [session]);

  if (!session || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  const levelName = getLevelName(user.level);
  const nextLevelPts = getNextLevelPoints(user.level);
  const progressPct = Math.min((user.points / nextLevelPts) * 100, 100);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-blue-600 pt-6 pb-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-200 text-sm">おはよう 👋</p>
              <h1 className="text-white text-xl font-bold">{user.name}</h1>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-blue-200 text-xs hover:text-white transition-colors"
            >
              ログアウト
            </button>
          </div>

          {/* Level Card */}
          <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-white/70 text-xs">Level {user.level}</span>
                <p className="text-white font-bold">{levelName}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-300 font-black text-xl">{user.points.toLocaleString()}</p>
                <p className="text-white/60 text-xs">ポイント</p>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-white/60 text-xs mt-1">{nextLevelPts - user.points}pt で次のレベルへ</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "完了した課題", value: user.submissions.length, icon: "🎯" },
            { label: "学習済み", value: user.lessonProgress.length, icon: "📚" },
            { label: "連続日数", value: `${user.streak}日`, icon: "🔥" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/challenges" className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🎯</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">課題に挑戦</p>
              <p className="text-gray-500 text-xs">5つの課題が待っている</p>
            </div>
          </Link>
          <Link href="/learn" className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">📚</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">ミニレッスン</p>
              <p className="text-gray-500 text-xs">3分から始められる</p>
            </div>
          </Link>
        </div>

        {/* Today's Challenges */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">おすすめ課題</h2>
            <Link href="/challenges" className="text-blue-600 text-sm font-medium">すべて見る</Link>
          </div>

          <div className="space-y-3">
            {challenges.map((c) => {
              const skills = JSON.parse(c.skills) as string[];
              return (
                <Link
                  key={c.id}
                  href={`/challenges/${c.id}`}
                  className="card p-4 block hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge text-xs ${DIFFICULTY_COLORS[c.difficulty]}`}>
                          {DIFFICULTY_LABELS[c.difficulty]}
                        </span>
                        <span className="text-gray-400 text-xs">⏱ {c.estimatedTime}分</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm leading-snug mb-2">
                        {c.title}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 2).map((s) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-black text-blue-600 text-sm">+{c.points}pt</p>
                      <p className="text-gray-400 text-xs">{c._count.submissions}人参加</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Activity */}
        {user.submissions.length > 0 && (
          <section>
            <h2 className="font-bold text-gray-900 mb-3">最近の提出</h2>
            <div className="space-y-2">
              {user.submissions.slice(0, 3).map((s) => (
                <div key={s.id} className="card p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">✅</div>
                  <p className="text-sm text-gray-700 flex-1 truncate">{s.challenge.title}</p>
                  <span className="text-green-600 text-xs font-bold">提出済み</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
