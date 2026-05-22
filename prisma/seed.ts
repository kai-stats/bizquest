import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminPass = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bizquest.jp" },
    update: {},
    create: {
      email: "admin@bizquest.jp",
      name: "管理者",
      password: adminPass,
      role: "admin",
      university: "BizQuest運営",
      points: 9999,
      level: 5,
    },
  });

  // Demo student
  const studentPass = await bcrypt.hash("demo123", 10);
  const student = await prisma.user.upsert({
    where: { email: "kai@example.com" },
    update: {},
    create: {
      email: "kai@example.com",
      name: "Kai",
      password: studentPass,
      university: "メルボルン大学",
      interests: JSON.stringify(["マーケティング", "起業家精神"]),
      points: 1250,
      level: 2,
      streak: 5,
    },
  });

  // Tracks
  const marketingTrack = await prisma.track.upsert({
    where: { id: "track-marketing" },
    update: {},
    create: {
      id: "track-marketing",
      title: "マーケティング基礎",
      description: "顧客理解から施策立案まで、マーケティングの基本を学ぶ",
      icon: "📢",
      color: "#3B82F6",
      order: 1,
    },
  });

  const entrepreneurTrack = await prisma.track.upsert({
    where: { id: "track-entrepreneur" },
    update: {},
    create: {
      id: "track-entrepreneur",
      title: "起業家精神",
      description: "アイデアを形にするための思考法と実践力を磨く",
      icon: "🚀",
      color: "#8B5CF6",
      order: 2,
    },
  });

  const strategyTrack = await prisma.track.upsert({
    where: { id: "track-strategy" },
    update: {},
    create: {
      id: "track-strategy",
      title: "ビジネス問題解決",
      description: "フレームワークを使って実際のビジネス課題を解く",
      icon: "🧩",
      color: "#10B981",
      order: 3,
    },
  });

  // Lessons — Marketing
  const lesson1 = await prisma.lesson.upsert({
    where: { id: "lesson-target" },
    update: {},
    create: {
      id: "lesson-target",
      trackId: marketingTrack.id,
      title: "ターゲットユーザーとは？",
      description: "誰に届けるかを明確にすることがマーケティングの出発点",
      duration: 4,
      order: 1,
      points: 10,
      content: `## ターゲットユーザーとは？

マーケティングの第一歩は「誰に届けるか」を明確にすることです。

### なぜターゲットを絞るの？

すべての人に向けたメッセージは、誰にも刺さりません。ターゲットを絞ることで：
- メッセージが具体的になる
- リソースを効率的に使える
- 顧客の共感を得やすくなる

### ターゲットの定義方法

**デモグラフィック情報**（年齢・性別・職業・収入など）と**サイコグラフィック情報**（価値観・ライフスタイル・悩みなど）を組み合わせます。

**例：**
> 「20代前半の大学生で、就活に向けてビジネス経験を積みたいが、ビジコンはハードルが高いと感じている人」

### ペルソナを作ろう

架空の典型的な顧客像（ペルソナ）を作ると、施策を考えやすくなります。

**ペルソナ例：**
- 名前：田中ひなた（22歳、文系大学3年）
- 悩み：「就活でビジネス経験をアピールしたいが、何もない」
- 目標：「楽しみながらビジネスを学びたい」
- 障壁：「ビジコンは難しそう・怖い」

---

## 確認クイズ

以下の問いに答えてみましょう：

**Q: ターゲットユーザーを絞る主な理由として最も適切なものはどれですか？**

A) より多くの人に届けるため
B) メッセージを具体的にして共感を得るため ✓
C) コストを増やすため
D) 競合を意識しないため

**正解：B**
ターゲットを絞ることで、そのユーザーの悩みや願望に直接訴えかけるメッセージが作れます。`,
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: "lesson-value-prop" },
    update: {},
    create: {
      id: "lesson-value-prop",
      trackId: marketingTrack.id,
      title: "価値提案とは？",
      description: "顧客が「これだ！」と感じる価値をどう伝えるか",
      duration: 3,
      order: 2,
      points: 10,
      content: `## 価値提案（バリュープロポジション）とは？

顧客があなたのサービスや商品を選ぶ理由を一言で表したものです。

### 良い価値提案の3条件

1. **顧客の悩みを解決する**：何の問題を解決するのか
2. **競合より優れている**：なぜあなたのものを選ぶのか
3. **シンプルに伝わる**：5秒で理解できるか

### フレームワーク：バリュープロポジションキャンバス

**顧客セグメント**（右側）
- やりたいこと（Jobs to be done）
- 悩み・不満
- 求める成果

**価値マップ**（左側）
- 痛み解消剤（Pain relievers）
- 利得創出剤（Gain creators）
- 製品・サービス

### 例：BizQuestの価値提案

> 「ビジネスを、もっと気軽に、もっと実践的に。」
> ビジコンはハードルが高い大学生が、5分から取り組める実践課題でビジネス思考を磨ける。

---

## 確認クイズ

**Q: 価値提案に必ず含むべき要素はどれですか？（最も重要なもの1つ）**

A) 会社の歴史
B) 顧客の悩みへの解決策 ✓
C) 詳細な機能リスト
D) 価格の安さ

**正解：B**`,
    },
  });

  const lesson3 = await prisma.lesson.upsert({
    where: { id: "lesson-competitor" },
    update: {},
    create: {
      id: "lesson-competitor",
      trackId: marketingTrack.id,
      title: "競合分析とは？",
      description: "競合を知ることで、自分たちのポジションを明確にする",
      duration: 4,
      order: 3,
      points: 10,
      content: `## 競合分析とは？

自社の強み・弱みを知るために、競合他社を体系的に分析することです。

### なぜ競合分析が必要か

- 市場の全体像が見える
- 差別化ポイントが明確になる
- 未開拓の機会を発見できる

### 競合分析の手順

**Step 1: 競合を特定する**
- 直接競合：同じ顧客層に同じ解決策を提供
- 間接競合：同じ問題を違う方法で解決
- 代替品：顧客が今使っているもの

**Step 2: 分析軸を決める**
価格、品質、ターゲット層、チャネル、ブランドイメージなど

**Step 3: ポジショニングマップを作る**
2つの軸でプロットし、競合との位置関係を可視化する

### 例：大学生向けビジネス学習市場

| サービス | 特徴 | 課題 |
|---------|------|------|
| スタサプ | 体系的な講義動画 | 受動的・実践がない |
| ビジコン | 実践的 | ハードルが高い |
| BizQuest | 実践的×ゲーム感覚 | 新参 |

---

## 確認クイズ

**Q: ポジショニングマップの目的は何ですか？**

A) 競合の売上を調べること
B) 市場における自社の立ち位置を視覚的に確認すること ✓
C) 広告の効果を測ること
D) 従業員の評価をすること

**正解：B**`,
    },
  });

  // Lessons — Entrepreneur
  const lesson4 = await prisma.lesson.upsert({
    where: { id: "lesson-problem" },
    update: {},
    create: {
      id: "lesson-problem",
      trackId: entrepreneurTrack.id,
      title: "なぜ顧客の行動を見る必要があるのか？",
      description: "言葉ではなく行動から本当のニーズを見つける方法",
      duration: 5,
      order: 1,
      points: 10,
      content: `## なぜ顧客の行動を観察するのか？

人は自分のニーズを正確に言葉にできないことが多いです。

### 有名な言葉

> "If I had asked people what they wanted, they would have said faster horses."
> — Henry Ford（ヘンリー・フォード）

顧客が「欲しい」と言うものと、実際に「必要な」ものは違うことがあります。

### 観察と聞くことの違い

| 手法 | 強み | 弱み |
|------|------|------|
| インタビュー | 深い理由を聞ける | 建前が出やすい |
| 観察 | 本音の行動がわかる | 文脈が読みにくい |
| データ分析 | 客観的 | なぜかがわからない |

### 実践：行動観察のポイント

1. **何をしているか**ではなく**なぜそうしているか**を考える
2. 「不満そうにしている瞬間」を探す
3. 「工夫している行動」に注目する（そこにニーズがある）

### 例：カフェの行動観察

夕方のカフェを観察すると：
- スマホを何度も確認している → 誰かを待っている？
- 一人でPCを広げている → 静かな作業スペースを求めている？
- すぐ出ていく人が多い → 長居しにくい雰囲気？

---

## 確認クイズ

**Q: 顧客観察で最も重要な視点はどれですか？**

A) 顧客が言ったことをそのまま記録する
B) 行動の背後にある「なぜ」を考える ✓
C) 競合より多くのデータを集める
D) 全員を同じように観察する

**正解：B**`,
    },
  });

  // Lessons — Strategy
  const lesson5 = await prisma.lesson.upsert({
    where: { id: "lesson-framework" },
    update: {},
    create: {
      id: "lesson-framework",
      trackId: strategyTrack.id,
      title: "ビジネスフレームワーク入門",
      description: "SWOT・3C・4Pを使って問題を構造的に考える",
      duration: 5,
      order: 1,
      points: 10,
      content: `## ビジネスフレームワーク入門

フレームワークとは「考えるための型」です。複雑な問題を整理しやすくなります。

### 3C分析

**Company（自社）・Customer（顧客）・Competitor（競合）**の3つで市場を分析します。

- **Customer**：誰が買うか、何に困っているか
- **Competitor**：誰が競合か、どんな強みがあるか
- **Company**：自社の強みは何か、リソースは

### SWOT分析

|  | プラス | マイナス |
|--|--------|----------|
| **内部** | Strength（強み） | Weakness（弱み） |
| **外部** | Opportunity（機会） | Threat（脅威） |

### 4P分析

マーケティングミックスとも呼ばれます：
- **Product**（製品）：何を売るか
- **Price**（価格）：いくらで売るか
- **Place**（流通）：どこで売るか
- **Promotion**（プロモーション）：どう知ってもらうか

### 使い方のコツ

フレームワークは「答え」ではなく「問いを出すための道具」です。埋めることが目的ではなく、重要な問いに気づくために使いましょう。

---

## 確認クイズ

**Q: 3C分析の「3C」に含まれないものはどれですか？**

A) Customer（顧客）
B) Competitor（競合）
C) Cost（コスト） ✓
D) Company（自社）

**正解：C**`,
    },
  });

  // Challenges
  const challenge1 = await prisma.challenge.upsert({
    where: { id: "challenge-cafe" },
    update: {},
    create: {
      id: "challenge-cafe",
      title: "大学近くのカフェの夕方集客を増やすには？",
      background:
        "大学近くにある「カフェ・サクラ」は、平日の昼間は学生で混雑しているが、夕方（17時〜20時）の来客数が極端に少ない。オーナーは大学生を中心に夕方以降の利用を増やしたいと考えている。席数20席・Wi-Fi完備・電源あり。価格帯は学生向けで500〜800円程度。",
      question:
        "このカフェが大学生の夕方利用を増やすためには、どのような施策を行うべきか？具体的な施策を提案してください。",
      submissionFormat: "300〜600文字の提案文",
      criteria: JSON.stringify([
        "顧客理解：大学生の夕方の行動や悩みを理解しているか",
        "実現可能性：小規模カフェが実際に実行できる施策か",
        "独自性：他のカフェと差別化されているか",
        "ビジネス的な説得力：なぜこの施策が効果的か説明できているか",
      ]),
      difficulty: "beginner",
      estimatedTime: 30,
      skills: JSON.stringify(["マーケティング", "顧客理解", "施策立案"]),
      points: 50,
      deadline: new Date("2026-06-30"),
    },
  });

  const challenge2 = await prisma.challenge.upsert({
    where: { id: "challenge-app" },
    update: {},
    create: {
      id: "challenge-app",
      title: "新しい学習アプリを大学生に広めるには？",
      background:
        "あなたはスタートアップのマーケティング担当者です。新しい学習アプリ「StudyMate」（月額980円）をリリースしましたが、ダウンロード数が伸び悩んでいます。ターゲットは大学生で、機能的には競合より優れているのに使われていません。予算は月10万円以内。",
      question:
        "大学生の間でStudyMateを広めるための具体的なグロース戦略を提案してください。",
      submissionFormat: "400〜700文字の提案文",
      criteria: JSON.stringify([
        "チャネル選定：大学生にリーチできる適切なチャネルを選んでいるか",
        "バイラル設計：口コミや拡散を促す仕組みがあるか",
        "費用対効果：予算10万円以内で実現可能か",
        "継続利用：ダウンロードだけでなく継続利用を考慮しているか",
      ]),
      difficulty: "intermediate",
      estimatedTime: 45,
      skills: JSON.stringify(["マーケティング", "グロースハック", "SNSマーケ"]),
      points: 60,
      deadline: new Date("2026-07-15"),
    },
  });

  const challenge3 = await prisma.challenge.upsert({
    where: { id: "challenge-restaurant" },
    update: {},
    create: {
      id: "challenge-restaurant",
      title: "地元の小さなレストランの売上を伸ばすには？",
      background:
        "地元で20年続く「洋食レストランたけだ」は、常連客はいるが新規客が来ない。料理の品質は高く、Googleレビューは4.2。しかし認知度が低く、席数30席のうち平日は平均15席しか埋まっていない。オーナーは広告費をかけたくない。",
      question:
        "広告費をかけずに新規客を増やし、売上を伸ばすための施策を3つ提案してください。",
      submissionFormat: "各施策200文字程度、合計600文字以内",
      criteria: JSON.stringify([
        "低コスト実現性：広告費なしで実行できるか",
        "具体性：すぐに行動に移せる具体的な施策か",
        "顧客獲得：新規客を獲得できる仕組みがあるか",
        "継続性：一度きりでなく継続的に効果があるか",
      ]),
      difficulty: "beginner",
      estimatedTime: 40,
      skills: JSON.stringify(["マーケティング", "ローカルビジネス", "SNSマーケ"]),
      points: 50,
      deadline: new Date("2026-07-01"),
    },
  });

  const challenge4 = await prisma.challenge.upsert({
    where: { id: "challenge-event" },
    update: {},
    create: {
      id: "challenge-event",
      title: "学生向けイベントの参加率を上げるには？",
      background:
        "大学のキャリアセンターが主催する「ビジネス勉強会」は月1回開催されているが、参加率が20〜30人と低迷している。参加した学生からの評判は良いが、「知らなかった」「興味はあるけど忘れた」という声が多い。告知はLINEグループとポスターのみ。",
      question:
        "このイベントの参加率を2倍にするための告知・集客戦略を提案してください。",
      submissionFormat: "300〜500文字の提案文",
      criteria: JSON.stringify([
        "認知向上：より多くの学生に知ってもらえるか",
        "行動促進：「知ってる」から「参加する」へのハードルを下げているか",
        "リピート設計：一度参加した人が次も来たくなる仕組みがあるか",
        "実現可能性：学生・学校の規模で実行できるか",
      ]),
      difficulty: "beginner",
      estimatedTime: 25,
      skills: JSON.stringify(["マーケティング", "イベント集客", "コミュニティ"]),
      points: 40,
      deadline: new Date("2026-06-20"),
    },
  });

  const challenge5 = await prisma.challenge.upsert({
    where: { id: "challenge-earphone" },
    update: {},
    create: {
      id: "challenge-earphone",
      title: '低価格イヤホンを「懐かしい音」として売るには？',
      background:
        '「SoundRetro 2000」は、音質が高いわけではないが、2000年代のMDプレーヤーや初期iPodのような「こもった音・懐かしい音感」が特徴の2,980円のイヤホン。Z世代（15〜25歳）を中心に、「エモい」「あの頃の音がする」という口コミが一部で広がっている。しかし、Amazonや量販店では音質で評価されるため売れていない。',
      question:
        "SoundRetro 2000の「懐かしい音」という特徴を強みとして、どのようなマーケティング戦略でZ世代にアプローチするか提案してください。",
      submissionFormat: "400〜700文字の提案文",
      criteria: JSON.stringify([
        "ポジショニング：音質競争を避けた独自の価値軸を作れているか",
        "感情訴求：懐かしさ・エモさを効果的に活用しているか",
        "チャネル：Z世代にリーチできる適切なチャネルを選んでいるか",
        "独自性：他の安価イヤホンとの差別化が明確か",
      ]),
      difficulty: "intermediate",
      estimatedTime: 45,
      skills: JSON.stringify(["マーケティング", "ブランディング", "感情訴求", "Z世代"]),
      points: 60,
      deadline: new Date("2026-07-31"),
    },
  });

  // Link lessons to challenges
  await prisma.challengeLesson.deleteMany({
    where: { challengeId: { in: ["challenge-cafe", "challenge-app", "challenge-restaurant", "challenge-event", "challenge-earphone"] } },
  });

  await prisma.challengeLesson.createMany({
    data: [
      { challengeId: challenge1.id, lessonId: lesson1.id },
      { challengeId: challenge1.id, lessonId: lesson2.id },
      { challengeId: challenge1.id, lessonId: lesson4.id },
      { challengeId: challenge2.id, lessonId: lesson1.id },
      { challengeId: challenge2.id, lessonId: lesson3.id },
      { challengeId: challenge3.id, lessonId: lesson2.id },
      { challengeId: challenge3.id, lessonId: lesson5.id },
      { challengeId: challenge4.id, lessonId: lesson1.id },
      { challengeId: challenge5.id, lessonId: lesson2.id },
      { challengeId: challenge5.id, lessonId: lesson3.id },
    ],
  });

  console.log("Seed completed!");
  console.log(`Admin: admin@bizquest.jp / admin123`);
  console.log(`Student: kai@example.com / demo123`);
  console.log({ admin: admin.id, student: student.id });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
