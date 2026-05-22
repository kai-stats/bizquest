"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav, TopBar } from "@/components/nav";
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS, SKILL_CATEGORIES } from "@/lib/utils";

interface Challenge {
  id: string;
  title: string;
  difficulty: string;
  estimatedTime: number;
  skills: string;
  points: number;
  deadline: string | null;
  _count: { submissions: number };
}

const TIME_OPTIONS = [
  { label: "すべて", value: "" },
  { label: "〜30分", value: "short" },
  { label: "30〜60分", value: "medium" },
  { label: "60分以上", value: "long" },
];

export default function ChallengesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filters, setFilters] = useState({ skill: "", difficulty: "", time: "", sort: "new" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.skill) params.set("skill", filters.skill);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    params.set("sort", filters.sort);
    fetch(`/api/challenges?${params}`).then((r) => r.json()).then(setChallenges);
  }, [filters]);

  function filterTime(c: Challenge) {
    if (!filters.time) return true;
    if (filters.time === "short") return c.estimatedTime <= 30;
    if (filters.time === "medium") return c.estimatedTime > 30 && c.estimatedTime <= 60;
    return c.estimatedTime > 60;
  }

  const filtered = challenges.filter(filterTime);

  if (!session) return null;

  return (
    <div className="min-h-screen pb-24">
      <TopBar title="チャレンジ一覧" />

      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Filter Bar */}
        <div className="overflow-x-auto -mx-4 px-4 mb-4">
          <div className="flex gap-2 pb-2 min-w-max">
            {/* Sort */}
            <select
              className="text-xs font-medium bg-white border border-gray-200 rounded-full px-3 py-2 outline-none"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value="new">新着順</option>
              <option value="popular">人気順</option>
            </select>

            {/* Difficulty */}
            <select
              className="text-xs font-medium bg-white border border-gray-200 rounded-full px-3 py-2 outline-none"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">難易度: すべて</option>
              <option value="beginner">初級</option>
              <option value="intermediate">中級</option>
              <option value="advanced">上級</option>
            </select>

            {/* Skill */}
            <select
              className="text-xs font-medium bg-white border border-gray-200 rounded-full px-3 py-2 outline-none"
              value={filters.skill}
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
            >
              <option value="">スキル: すべて</option>
              {SKILL_CATEGORIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Time */}
            {TIME_OPTIONS.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilters({ ...filters, time: t.value })}
                className={`text-xs font-medium px-3 py-2 rounded-full border transition-colors whitespace-nowrap ${
                  filters.time === t.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-xs mb-4">{filtered.length}件の課題</p>

        {/* Challenge Cards */}
        <div className="space-y-4">
          {filtered.map((c) => {
            const skills = JSON.parse(c.skills) as string[];
            const daysLeft = c.deadline
              ? Math.ceil((new Date(c.deadline).getTime() - Date.now()) / 86400000)
              : null;

            return (
              <Link
                key={c.id}
                href={`/challenges/${c.id}`}
                className="card p-5 block hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`badge ${DIFFICULTY_COLORS[c.difficulty]}`}>
                        {DIFFICULTY_LABELS[c.difficulty]}
                      </span>
                      {daysLeft !== null && daysLeft <= 14 && (
                        <span className="badge bg-orange-50 text-orange-600">
                          残り{daysLeft}日
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 leading-snug">{c.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {skills.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>⏱ {c.estimatedTime}分</span>
                      <span>👥 {c._count.submissions}人参加</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-black text-blue-600">+{c.points}pt</p>
                    <p className="text-gray-400 text-xs mt-1">→</p>
                  </div>
                </div>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">🔍</div>
              <p>条件に合う課題が見つかりません</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
