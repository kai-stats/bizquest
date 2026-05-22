"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Stats {
  users: number;
  submissions: number;
  challenges: number;
  avgScore: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session && session.user.role !== "admin") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (!session || session.user.role !== "admin") return;
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {
      setStats({ users: 0, submissions: 0, challenges: 5, avgScore: 0 });
    });
  }, [session]);

  if (!session || session.user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">BQ</div>
          <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <Link href="/dashboard" className="text-gray-500 text-sm hover:text-gray-700">← アプリへ戻る</Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "登録ユーザー数", value: stats?.users ?? "-", icon: "👥", color: "bg-blue-50 text-blue-600" },
            { label: "提出済み課題", value: stats?.submissions ?? "-", icon: "📝", color: "bg-green-50 text-green-600" },
            { label: "公開課題数", value: stats?.challenges ?? 5, icon: "🎯", color: "bg-purple-50 text-purple-600" },
            { label: "平均スコア", value: stats?.avgScore ? `${Math.round(stats.avgScore)}点` : "-", icon: "⭐", color: "bg-yellow-50 text-yellow-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center text-xl mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{s.value}</div>
              <div className="text-gray-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { title: "課題管理", desc: "課題の追加・編集・削除", icon: "🎯", href: "#challenges" },
            { title: "ユーザー管理", desc: "ユーザー一覧・権限変更", icon: "👥", href: "#users" },
            { title: "提出一覧", desc: "全提出内容の確認", icon: "📝", href: "#submissions" },
          ].map((l) => (
            <a
              key={l.title}
              href={l.href}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="text-3xl">{l.icon}</div>
              <div>
                <p className="font-bold text-gray-900">{l.title}</p>
                <p className="text-gray-500 text-xs">{l.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="font-bold text-gray-900 mb-4">今後追加すべき機能 (Roadmap)</h2>
          <div className="space-y-3">
            {[
              { phase: "Phase 1", title: "AIフィードバック強化", desc: "Claude APIを使ったリアルタイムの個別フィードバック", status: "todo" },
              { phase: "Phase 1", title: "ソーシャル機能", desc: "他のユーザーの提出を見て学ぶ・コメント機能", status: "todo" },
              { phase: "Phase 2", title: "企業課題掲載", desc: "企業が実際の課題を投稿できる機能", status: "future" },
              { phase: "Phase 2", title: "採用マッチング", desc: "企業が優秀な学生と接点を持てる機能", status: "future" },
              { phase: "Phase 2", title: "大学・学校連携", desc: "大学での授業連携・クラス機能", status: "future" },
              { phase: "Phase 3", title: "課金機能", desc: "プレミアムコース・企業向けプラン", status: "future" },
            ].map((r) => (
              <div key={r.title} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50">
                <span className={`badge text-xs shrink-0 ${
                  r.status === "todo" ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500"
                }`}>
                  {r.phase}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{r.title}</p>
                  <p className="text-gray-500 text-xs">{r.desc}</p>
                </div>
                <span className={`text-xs font-medium ${
                  r.status === "todo" ? "text-orange-500" : "text-gray-400"
                }`}>
                  {r.status === "todo" ? "優先" : "将来"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          BizQuest Admin v0.1 MVP — {new Date().toLocaleDateString("ja-JP")}
        </div>
      </div>
    </div>
  );
}
