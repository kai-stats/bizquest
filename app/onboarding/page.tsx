"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const INTERESTS = [
  "マーケティング", "起業家精神", "会計・財務", "経営戦略", "広告・PR", "営業", "リーダーシップ", "テクノロジー",
];

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ university: "", interests: [] as string[] });
  const [saving, setSaving] = useState(false);

  function toggleInterest(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function handleFinish() {
    setSaving(true);
    await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        university: form.university,
        interests: JSON.stringify(form.interests),
      }),
    });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div>
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ようこそ、{session?.user?.name}さん！
            </h2>
            <p className="text-gray-500 mb-8">BizQuestへようこそ。まず簡単にプロフィールを設定しましょう。</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">大学名（任意）</label>
                <input
                  type="text"
                  className="input"
                  placeholder="例：東京大学、早稲田大学"
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                />
              </div>
            </div>

            <button
              className="btn-primary w-full mt-8"
              onClick={() => setStep(2)}
            >
              次へ →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">興味のある分野は？</h2>
            <p className="text-gray-500 mb-6">あなたに合った課題をおすすめするために使います（複数選択OK）</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                    form.interests.includes(interest)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← 戻る</button>
              <button className="btn-primary flex-1" onClick={() => setStep(3)}>次へ →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">準備完了！</h2>
            <p className="text-gray-500 mb-8">最初のミニレッスンを読んで、課題に挑戦してみましょう！</p>

            <div className="bg-blue-50 rounded-2xl p-5 mb-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">ミニレッスン</p>
                  <p className="text-gray-500 text-xs">3〜5分でビジネス基礎を学ぶ</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">実践課題</p>
                  <p className="text-gray-500 text-xs">リアルな課題に自分なりに答える</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">ポイント獲得</p>
                  <p className="text-gray-500 text-xs">提出するたびにポイントがたまる</p>
                </div>
              </div>
            </div>

            <button
              className="btn-primary w-full"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? "設定中..." : "ダッシュボードへ →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
