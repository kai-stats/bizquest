"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BottomNav, TopBar } from "@/components/nav";
import { getLevelName, getNextLevelPoints, DIFFICULTY_LABELS } from "@/lib/utils";

interface UserProfile {
  name: string;
  email: string;
  university: string | null;
  bio: string | null;
  interests: string | null;
  points: number;
  level: number;
  streak: number;
  createdAt: string;
  submissions: {
    id: string;
    title: string;
    feedbackScore: number | null;
    pointsEarned: number;
    createdAt: string;
    challenge: { title: string; difficulty: string };
  }[];
  lessonProgress: { id: string }[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/users/me").then((r) => r.json()).then(setUser);
  }, [session]);

  if (!user) return null;

  const levelName = getLevelName(user.level);
  const nextLevelPts = getNextLevelPoints(user.level);
  const progressPct = Math.min((user.points / nextLevelPts) * 100, 100);
  const interests = user.interests ? JSON.parse(user.interests) as string[] : [];

  const skillCounts: Record<string, number> = {};
  user.submissions.forEach((s) => {
    skillCounts[s.challenge.difficulty] = (skillCounts[s.challenge.difficulty] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen pb-24">
      <TopBar title="プロフィール" />

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="card p-6 mb-5 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-4">
            {user.name[0]}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h1>
          {user.university && (
            <p className="text-gray-500 text-sm mb-3">🎓 {user.university}</p>
          )}
          {interests.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {interests.map((i: string) => (
                <span key={i} className="badge bg-blue-50 text-blue-600">{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Level & Points */}
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-500 text-xs">現在のレベル</p>
              <p className="font-bold text-gray-900">Level {user.level} · {levelName}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">総獲得ポイント</p>
              <p className="font-black text-2xl text-blue-600">{user.points.toLocaleString()}<span className="text-sm text-gray-500 font-normal">pt</span></p>
            </div>
          </div>
          <div className="progress-bar mb-1">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-gray-400 text-xs">{nextLevelPts - user.points}pt でLevel {user.level + 1}へ</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "提出した課題", value: user.submissions.length, icon: "🎯" },
            { label: "完了レッスン", value: user.lessonProgress.length, icon: "📚" },
            { label: "連続日数", value: `${user.streak}日`, icon: "🔥" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xl font-black text-gray-900">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Submission History */}
        {user.submissions.length > 0 && (
          <div className="card p-5 mb-5">
            <h2 className="font-bold text-gray-900 mb-4">提出履歴</h2>
            <div className="space-y-3">
              {user.submissions.map((s) => (
                <div key={s.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{s.challenge.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-blue-600 font-bold text-sm">+{s.pointsEarned}pt</p>
                      {s.feedbackScore && (
                        <p className="text-gray-400 text-xs">{s.feedbackScore}/100</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {DIFFICULTY_LABELS[s.challenge.difficulty]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level Roadmap */}
        <div className="card p-5 mb-5">
          <h2 className="font-bold text-gray-900 mb-4">レベルロードマップ</h2>
          <div className="space-y-2">
            {[
              { level: 1, name: "Beginner", pts: 0 },
              { level: 2, name: "Explorer", pts: 100 },
              { level: 3, name: "Builder", pts: 300 },
              { level: 4, name: "Strategist", pts: 600 },
              { level: 5, name: "Business Challenger", pts: 1000 },
            ].map((l) => (
              <div
                key={l.level}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  l.level === user.level
                    ? "bg-blue-50 border-2 border-blue-200"
                    : l.level < user.level
                    ? "opacity-50"
                    : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${
                  l.level <= user.level ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {l.level <= user.level ? "✓" : l.level}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Level {l.level} · {l.name}</p>
                  <p className="text-gray-500 text-xs">{l.pts}pt から</p>
                </div>
                {l.level === user.level && (
                  <span className="badge bg-blue-100 text-blue-700 text-xs">現在</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="btn-secondary w-full text-gray-500 border-gray-200"
        >
          ログアウト
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
