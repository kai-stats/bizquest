"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Submission {
  id: string;
  title: string;
  pointsEarned: number;
  feedbackGood: string;
  feedbackImprove: string;
  feedbackNext: string;
  feedbackScore: number;
  challenge: { id: string; title: string };
}

export default function FeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const submissionId = params.submissionId as string;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/submissions?id=${submissionId}`).then((r) => r.json()).then(setSubmission);
    const timer = setTimeout(() => setAnimating(false), 1200);
    return () => clearTimeout(timer);
  }, [submissionId]);

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-800">
        <div className="text-white text-lg animate-pulse">フィードバックを生成中... ✨</div>
      </div>
    );
  }

  const score = submission.feedbackScore ?? 75;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-800 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-10">
        {/* Score Card */}
        <div className="text-center mb-8">
          <div className={`text-6xl mb-4 transition-transform duration-1000 ${animating ? "scale-150 opacity-0" : "scale-100 opacity-100"}`}>
            🌟
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">提出完了！</h1>
          <p className="text-white/70 text-sm mb-6">{submission.challenge.title}</p>

          <div className="inline-flex items-center gap-3 bg-yellow-400 text-gray-900 px-6 py-3 rounded-2xl font-black text-2xl shadow-lg shadow-yellow-500/30 mb-4">
            <span>⭐</span>
            <span>+{submission.pointsEarned}pt 獲得！</span>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl px-8 py-4 inline-block">
            <p className="text-white/60 text-xs mb-1">AIスコア</p>
            <p className="text-4xl font-black text-white">{score} <span className="text-lg text-white/60">/ 100</span></p>
          </div>
        </div>

        {/* Score Bar */}
        <div className="bg-white/10 rounded-full h-2 mb-8">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-1000"
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Feedback Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-green-500/20 backdrop-blur rounded-2xl p-5 border border-green-400/30">
            <h2 className="text-green-300 font-bold mb-2 flex items-center gap-2">
              <span>👍</span> 良かった点
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">{submission.feedbackGood}</p>
          </div>

          <div className="bg-orange-500/20 backdrop-blur rounded-2xl p-5 border border-orange-400/30">
            <h2 className="text-orange-300 font-bold mb-2 flex items-center gap-2">
              <span>💡</span> 改善できる点
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">{submission.feedbackImprove}</p>
          </div>

          <div className="bg-blue-500/20 backdrop-blur rounded-2xl p-5 border border-blue-400/30">
            <h2 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
              <span>🔭</span> 次に考えるべき問い
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">{submission.feedbackNext}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/challenges"
            className="btn-primary w-full py-4 text-base justify-center"
          >
            次の課題に挑戦する →
          </Link>
          <Link
            href="/dashboard"
            className="block text-center text-white/70 hover:text-white py-3 transition-colors text-sm"
          >
            ダッシュボードへ
          </Link>
        </div>
      </div>
    </div>
  );
}
