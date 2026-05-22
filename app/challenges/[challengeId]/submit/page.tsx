"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { TopBar } from "@/components/nav";

interface Challenge {
  id: string;
  title: string;
  question: string;
  submissionFormat: string;
  points: number;
}

export default function SubmitPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const challengeId = params.challengeId as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetUser: "",
    approach: "",
    reasoning: "",
    references: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/challenges/${challengeId}`).then((r) => r.json()).then(setChallenge);
  }, [challengeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content || !form.targetUser || !form.approach || !form.reasoning) {
      setError("必須項目をすべて入力してください");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, ...form }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "提出に失敗しました");
      setSubmitting(false);
      return;
    }

    const submission = await res.json();
    router.push(`/feedback/${submission.id}`);
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <TopBar
        title="提案を提出"
        back={`/challenges/${challengeId}`}
      />

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Challenge Brief */}
        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-blue-700 mb-1">課題</p>
          <p className="text-gray-800 text-sm font-medium">{challenge.question}</p>
          <p className="text-xs text-gray-500 mt-2">{challenge.submissionFormat}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              提案タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="例：夕方の学習スペース化 × SNS活用施策"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              想定ターゲット <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="例：大学3〜4年生、授業後に勉強したい学生"
              value={form.targetUser}
              onChange={(e) => setForm({ ...form, targetUser: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              具体的な施策 <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="例：夕方17〜21時限定で「学習スペース割引」を設け、Wi-Fi・電源完備を全面に打ち出す。Instagramストーリーズで毎日「今日のカフェ勉強スポット」を投稿し..."
              value={form.approach}
              onChange={(e) => setForm({ ...form, approach: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              提案内容（全体まとめ） <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input resize-none"
              rows={5}
              placeholder="提案全体を300〜600文字でまとめてください。背景の理解、施策の全体像、期待される効果などを含めて..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-1">{form.content.length}文字</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              なぜこれが有効だと思うか <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="例：ターゲットの大学生は課題の多い試験前に静かな作業場所を探しているが、..."
              value={form.reasoning}
              onChange={(e) => setForm({ ...form, reasoning: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              参考にした考え方（任意）
            </label>
            <input
              type="text"
              className="input"
              placeholder="例：ペルソナ分析、Customer Jobs理論"
              value={form.references}
              onChange={(e) => setForm({ ...form, references: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-4 text-base"
          >
            {submitting ? "提出中..." : `提出してAIフィードバックをもらう → +${challenge.points}pt`}
          </button>
        </form>
      </div>
    </div>
  );
}
