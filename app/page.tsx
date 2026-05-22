import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-blue-600 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-black text-sm">BQ</div>
            <span className="text-white font-bold text-xl">BizQuest</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm">
              ログイン
            </Link>
            <Link href="/signup" className="bg-white text-blue-600 font-bold px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm">
              無料で始める
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-20 pb-24 text-center px-6">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            ビジネスを、もっと<br />
            <span className="text-yellow-300">気軽に</span>、もっと<span className="text-yellow-300">実践的に</span>。
          </h1>

          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            マーケティング、起業家精神、会計、課題解決。<br />
            大学の外でも、ビジネスを学びながら実践課題に取り組めるプラットフォーム。
          </p>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-yellow-500/30"
          >
            最初の課題に挑戦する →
          </Link>

          <p className="text-white/50 text-sm mt-5">無料・登録3分・ビジコンよりもっと気軽</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { num: "5+", label: "実践課題" },
            { num: "3", label: "スキルトラック" },
            { num: "30分", label: "から始められる" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-blue-600 mb-1">{s.num}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">なぜBizQuestなのか</h2>
          <p className="text-gray-500 text-center mb-12">ビジネスを学ぶ新しい方法</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎮", title: "ゲーム感覚で継続できる", desc: "ポイントとレベルで達成感を感じながら、毎日少しずつスキルを積み上げる" },
              { icon: "💡", title: "実践的な課題で思考力を磨く", desc: "実際のビジネスシナリオに取り組みながら、教科書だけでは得られない実践力を身に付ける" },
              { icon: "⚡", title: "ビジコンよりハードルが低い", desc: "ミニレッスンは3〜5分。課題は30分から。チームも必要ない。一人でいつでも始められる" },
            ].map((f) => (
              <div key={f.title} className="card p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Challenges */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-3">こんな課題に取り組める</h2>
          <p className="text-gray-500 text-center mb-12">すべてリアルなビジネス状況をベースにしています</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { tag: "マーケティング", emoji: "☕", title: "大学近くのカフェの夕方集客を増やすには？", time: "30分", level: "初級", pts: "+50pt" },
              { tag: "グロース", emoji: "📱", title: "新しい学習アプリを大学生に広めるには？", time: "45分", level: "中級", pts: "+60pt" },
              { tag: "ローカルビジネス", emoji: "🍽️", title: "地元のレストランの売上を伸ばすには？", time: "40分", level: "初級", pts: "+50pt" },
              { tag: "イベント集客", emoji: "🎉", title: "学生向けイベントの参加率を上げるには？", time: "25分", level: "初級", pts: "+40pt" },
            ].map((c) => (
              <div key={c.title} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow hover:border-blue-100">
                <div className="text-3xl mb-3">{c.emoji}</div>
                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {c.tag}
                </span>
                <h3 className="font-bold text-gray-900 mb-3 leading-snug text-sm">{c.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>⏱ {c.time} · {c.level}</span>
                  <span className="font-bold text-blue-600">{c.pts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">使い方はシンプル</h2>
          <div className="space-y-8">
            {[
              { step: "01", title: "ミニレッスンで基礎を学ぶ", desc: "3〜5分のレッスンでマーケティング・起業・戦略の基礎知識を身に付ける" },
              { step: "02", title: "実践課題に取り組む", desc: "リアルなビジネスシナリオに対して、自分なりの提案・施策を考える" },
              { step: "03", title: "AIフィードバックでレベルアップ", desc: "提出すると即座にフィードバックとポイントがもらえる。次の課題に進もう" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-5 text-left">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20 text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">今すぐ始めよう</h2>
        <p className="text-white/70 mb-8">登録無料。最初の課題に30分で挑戦できます。</p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-blue-50 transition-colors"
        >
          無料で始める →
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-500 text-center py-8 text-sm">
        © 2026 BizQuest — 大学生のためのビジネス学習プラットフォーム
      </footer>
    </div>
  );
}
