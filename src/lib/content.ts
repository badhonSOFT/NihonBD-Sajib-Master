// Starter content. Japanese markup: {surface|reading|romaji|বাংলা} for tappable words,
// [[target]] for the underlined word being tested (shown without furigana).

export type Level = "N5" | "N4" | "NAT";
export type Skill = "kanji" | "vocab" | "grammar" | "reading" | "listening";

export const SKILL_LABEL_BN: Record<Skill, string> = {
  kanji: "কাঞ্জি",
  vocab: "শব্দভান্ডার",
  grammar: "ব্যাকরণ",
  reading: "পঠন",
  listening: "শ্রবণ",
};

export interface Question {
  id: string;
  skill: Skill;
  prompt: string;
  promptBn: string;
  options: string[];
  answer: number;
  explanationBn: string;
}

export interface Line {
  jp: string;
  bn: string;
  speaker?: string;
}

export interface Exam {
  id: string;
  level: Level;
  title: string;
  titleBn: string;
  free?: boolean;
  vocab: { durationMin: number; questions: Question[] };
  reading: { durationMin: number; title: string; passage: Line[]; questions: Question[] };
  listening: { durationMin: number; situation: Line; script: Line[]; questions: Question[] };
}

// ---------------- JLPT N5 Mock 1 ----------------

const n5Vocab: Question[] = [
  {
    id: "n5-v1",
    skill: "kanji",
    prompt: "[[学校]]へ {行きます|いきます|ikimasu|যাই}。",
    promptBn: "আমি স্কুলে যাই।",
    options: ["がっこう", "がこう", "がっこ", "かっこう"],
    answer: 0,
    explanationBn:
      "学校 এর সঠিক উচ্চারণ「がっこう」(gakkō) — অর্থ বিদ্যালয়। 学 (がく) + 校 (こう) মিলে ছোট っ যোগ হয়ে がっこう হয়। かっこう মানে ‘চেহারা/স্টাইল’, তাই সেটি ভুল।",
  },
  {
    id: "n5-v2",
    skill: "kanji",
    prompt: "{毎朝|まいあさ|maiasa|প্রতিদিন সকালে} [[七時]]に {起きます|おきます|okimasu|ঘুম থেকে উঠি}。",
    promptBn: "আমি প্রতিদিন সকালে সাতটায় ঘুম থেকে উঠি।",
    options: ["ななじ", "しちじ", "ひちじ", "しじ"],
    answer: 1,
    explanationBn:
      "সময় বলার সময় ৭টা =「しちじ」। 七 একা পড়লে なな হতে পারে, কিন্তু ‘~時’ এর আগে সবসময় しち ব্যবহার হয়। ৪টা (よじ) ও ৯টা (くじ) এর মতো এটিও বিশেষ উচ্চারণ।",
  },
  {
    id: "n5-v3",
    skill: "kanji",
    prompt: "[[やま]]に {登りました|のぼりました|noborimashita|উঠেছিলাম}。",
    promptBn: "আমি পাহাড়ে উঠেছিলাম।",
    options: ["川", "山", "出", "田"],
    answer: 1,
    explanationBn:
      "やま = 山 (পাহাড়)। 川 (かわ) = নদী, 出 (で) = বের হওয়া, 田 (た) = ধানক্ষেত। 山 কাঞ্জিটি দেখতে তিনটি চূড়ার মতো — মনে রাখা সহজ।",
  },
  {
    id: "n5-v4",
    skill: "vocab",
    prompt: "{暑い|あつい|atsui|গরম}ですから、まどを（　）ください。",
    promptBn: "গরম লাগছে, তাই জানালাটা (   ) দিন।",
    options: ["あけて", "しめて", "けして", "つけて"],
    answer: 0,
    explanationBn:
      "গরম লাগছে বলে জানালা ‘খুলে’ দিতে বলা হচ্ছে — あけて (開けて, খোলা)। しめて = বন্ধ করা, けして = নেভানো (লাইট), つけて = জ্বালানো। ～てください = অনুগ্রহ করে ~ করুন।",
  },
  {
    id: "n5-v5",
    skill: "grammar",
    prompt:
      "{私|わたし|watashi|আমি}は {毎日|まいにち|mainichi|প্রতিদিন} バス（　）{会社|かいしゃ|kaisha|অফিস/কোম্পানি}へ {行きます|いきます|ikimasu|যাই}。",
    promptBn: "আমি প্রতিদিন বাসে (   ) অফিসে যাই।",
    options: ["で", "に", "を", "が"],
    answer: 0,
    explanationBn:
      "যানবাহন বা মাধ্যম বোঝাতে কণা「で」ব্যবহার হয় — バスで = বাসে করে। に গন্তব্য/সময় বোঝায়, を কর্ম বোঝায়, が কর্তা বোঝায়।",
  },
  {
    id: "n5-v6",
    skill: "grammar",
    prompt: "{昨日|きのう|kinō|গতকাল}は {雨|あめ|ame|বৃষ্টি}（　）。",
    promptBn: "গতকাল বৃষ্টি (   )।",
    options: ["です", "でした", "だ", "じゃない"],
    answer: 1,
    explanationBn:
      "昨日 (গতকাল) অতীত সময়, তাই নামবাচক বাক্যের অতীত ভদ্র রূপ「でした」লাগবে। です বর্তমান, だ সাধারণ (casual) বর্তমান, じゃない না-বাচক বর্তমান।",
  },
  {
    id: "n5-v7",
    skill: "vocab",
    prompt: "{図書館|としょかん|toshokan|লাইব্রেরি}で {本|ほん|hon|বই}を（　）。",
    promptBn: "লাইব্রেরি থেকে বই (   )।",
    options: ["かします", "かります", "かきます", "かいます"],
    answer: 1,
    explanationBn:
      "লাইব্রেরি থেকে বই ‘ধার নেওয়া’ = かります (借ります)। かします (貸します) = ধার দেওয়া — উল্টো অর্থ, এটা পরীক্ষায় খুব সাধারণ ফাঁদ! かきます = লেখা, かいます = কেনা।",
  },
  {
    id: "n5-v8",
    skill: "grammar",
    prompt: "{日本語|にほんご|nihongo|জাপানি ভাষা}を {話す|はなす|hanasu|বলা}ことが（　）。",
    promptBn: "জাপানি ভাষা বলতে (   )।",
    options: ["します", "あります", "できます", "なります"],
    answer: 2,
    explanationBn:
      "‘ক্রিয়ার অভিধান রূপ + ことができます’ = ~ করতে পারি (সামর্থ্য)। 話すことができます = জাপানি বলতে পারি। ～ことがあります অর্থ ‘কখনো কখনো ~ হয়’ — ভিন্ন অর্থ।",
  },
];

const n5Passage: Line[] = [
  {
    jp: "{私|わたし|watashi|আমি}は ラヒムです。",
    bn: "আমি রহিম।",
  },
  {
    jp: "バングラデシュの ダッカから {来ました|きました|kimashita|এসেছি}。",
    bn: "আমি বাংলাদেশের ঢাকা থেকে এসেছি।",
  },
  {
    jp: "{今|いま|ima|এখন} {東京|とうきょう|tōkyō|টোকিও}の {日本語学校|にほんごがっこう|nihongo gakkō|জাপানি ভাষা স্কুল}で {勉強|べんきょう|benkyō|পড়াশোনা}して います。",
    bn: "এখন টোকিওর একটি জাপানি ভাষা স্কুলে পড়াশোনা করছি।",
  },
  {
    jp: "{毎朝|まいあさ|maiasa|প্রতিদিন সকালে} {六時|ろくじ|rokuji|ছয়টা}に {起きて|おきて|okite|উঠে}、{電車|でんしゃ|densha|ট্রেন}で {学校|がっこう|gakkō|বিদ্যালয়}へ {行きます|いきます|ikimasu|যাই}。",
    bn: "প্রতিদিন সকাল ছয়টায় উঠে ট্রেনে করে স্কুলে যাই।",
  },
  {
    jp: "{学校|がっこう|gakkō|বিদ্যালয়}は {九時|くじ|kuji|নয়টা}から {三時|さんじ|sanji|তিনটা}までです。",
    bn: "স্কুল নয়টা থেকে তিনটা পর্যন্ত।",
  },
  {
    jp: "{週末|しゅうまつ|shūmatsu|সপ্তাহান্ত}は {友達|ともだち|tomodachi|বন্ধু}と {公園|こうえん|kōen|পার্ক}へ {行きます|いきます|ikimasu|যাই}。",
    bn: "সপ্তাহান্তে বন্ধুদের সাথে পার্কে যাই।",
  },
  {
    jp: "{来年|らいねん|rainen|আগামী বছর} {大学|だいがく|daigaku|বিশ্ববিদ্যালয়}に {入りたい|はいりたい|hairitai|ভর্তি হতে চাই}です。",
    bn: "আগামী বছর বিশ্ববিদ্যালয়ে ভর্তি হতে চাই।",
  },
];

const n5Reading: Question[] = [
  {
    id: "n5-r1",
    skill: "reading",
    prompt: "ラヒムさんは どこから {来ました|きました|kimashita|এসেছেন}か。",
    promptBn: "রহিম কোথা থেকে এসেছেন?",
    options: ["ダッカ", "{東京|とうきょう|tōkyō|টোকিও}", "{大阪|おおさか|ōsaka|ওসাকা}", "チッタゴン"],
    answer: 0,
    explanationBn:
      "দ্বিতীয় বাক্যে বলা আছে「バングラデシュの ダッカから来ました」— ঢাকা থেকে এসেছেন। টোকিও হলো যেখানে তিনি এখন পড়ছেন, সেটি ফাঁদ।",
  },
  {
    id: "n5-r2",
    skill: "reading",
    prompt: "ラヒムさんは {何|なに|nani|কী}で {学校|がっこう|gakkō|বিদ্যালয়}へ {行きます|いきます|ikimasu|যান}か。",
    promptBn: "রহিম কীসে করে স্কুলে যান?",
    options: ["バス", "{電車|でんしゃ|densha|ট্রেন}", "{自転車|じてんしゃ|jitensha|সাইকেল}", "あるいて"],
    answer: 1,
    explanationBn:
      "「電車で学校へ行きます」— ট্রেনে করে যান। এখানে で কণা যানবাহন বোঝায় (বাসে = バスで, সাইকেলে = 自転車で)।",
  },
  {
    id: "n5-r3",
    skill: "reading",
    prompt: "{学校|がっこう|gakkō|বিদ্যালয়}は {何時|なんじ|nanji|কয়টায়}に {終わります|おわります|owarimasu|শেষ হয়}か。",
    promptBn: "স্কুল কয়টায় শেষ হয়?",
    options: ["{九時|くじ|kuji|নয়টা}", "{六時|ろくじ|rokuji|ছয়টা}", "{三時|さんじ|sanji|তিনটা}", "{十二時|じゅうにじ|jūniji|বারোটা}"],
    answer: 2,
    explanationBn:
      "「九時から三時までです」— ~から = থেকে, ~まで = পর্যন্ত। তাই স্কুল শেষ হয় তিনটায়। নয়টা শুরুর সময়।",
  },
];

const n5Script: Line[] = [
  { speaker: "女", jp: "いらっしゃいませ。", bn: "স্বাগতম।" },
  {
    speaker: "男",
    jp: "すみません、この {赤い|あかい|akai|লাল} かさは いくらですか。",
    bn: "মাফ করবেন, এই লাল ছাতাটার দাম কত?",
  },
  { speaker: "女", jp: "{千五百円|せんごひゃくえん|sengohyaku en|১৫০০ ইয়েন}です。", bn: "১৫০০ ইয়েন।" },
  { speaker: "男", jp: "じゃ、その {青い|あおい|aoi|নীল} かさは？", bn: "তাহলে ওই নীল ছাতাটা?" },
  { speaker: "女", jp: "{青い|あおい|aoi|নীল}のは {千円|せんえん|sen en|১০০০ ইয়েন}です。", bn: "নীলটা ১০০০ ইয়েন।" },
  { speaker: "男", jp: "じゃ、{青い|あおい|aoi|নীল}のを ください。", bn: "তাহলে নীলটা দিন।" },
];

const n5Listening: Question[] = [
  {
    id: "n5-l1",
    skill: "listening",
    prompt: "{男|おとこ|otoko|পুরুষ}の{人|ひと|hito|লোক}は {何|なに|nani|কী}を {買います|かいます|kaimasu|কিনবেন}か。",
    promptBn: "লোকটি কী কিনবেন?",
    options: ["{赤い|あかい|akai|লাল} かさ", "{青い|あおい|aoi|নীল} かさ", "{赤い|あかい|akai|লাল} かばん", "{青い|あおい|aoi|নীল} かばん"],
    answer: 1,
    explanationBn:
      "শেষে লোকটি বলেন「青いのをください」— নীলটা দিন। এখানে の = ‘টা/জিনিসটা’ (かさ শব্দের পুনরাবৃত্তি এড়াতে)। প্রথমে লাল ছাতার কথা জিজ্ঞেস করলেও কেনেননি।",
  },
  {
    id: "n5-l2",
    skill: "listening",
    prompt: "{青い|あおい|aoi|নীল} かさは いくらですか。",
    promptBn: "নীল ছাতার দাম কত?",
    options: ["{千円|せんえん|sen en|১০০০ ইয়েন}", "{千五百円|せんごひゃくえん|sengohyaku en|১৫০০ ইয়েন}", "{五百円|ごひゃくえん|gohyaku en|৫০০ ইয়েন}", "{二千円|にせんえん|nisen en|২০০০ ইয়েন}"],
    answer: 0,
    explanationBn:
      "「青いのは千円です」— নীলটা ১০০০ ইয়েন। ১৫০০ ইয়েন লাল ছাতার দাম। সংখ্যা: 千 (せん) = ১০০০, 五百 (ごひゃく) = ৫০০।",
  },
];

const n5Mock: Exam = {
  id: "n5-mock-1",
  level: "N5",
  title: "JLPT N5 Full Mock Test 01",
  titleBn: "JLPT N5 পূর্ণাঙ্গ মক টেস্ট ০১",
  vocab: { durationMin: 20, questions: n5Vocab },
  reading: {
    durationMin: 40,
    title: "わたしの まいにち",
    passage: n5Passage,
    questions: n5Reading,
  },
  listening: {
    durationMin: 30,
    situation: {
      jp: "{店|みせ|mise|দোকান}で {男|おとこ|otoko|পুরুষ}の{人|ひと|hito|লোক}と {店|みせ|mise|দোকান}の{人|ひと|hito|লোক}が {話して|はなして|hanashite|কথা বলছেন} います。",
      bn: "একটি দোকানে একজন লোক ও দোকানদার কথা বলছেন।",
    },
    script: n5Script,
    questions: n5Listening,
  },
};

const n5Demo: Exam = {
  id: "n5-demo",
  level: "N5",
  free: true,
  title: "JLPT N5 Free Demo Test",
  titleBn: "JLPT N5 ফ্রি ডেমো টেস্ট",
  vocab: { durationMin: 5, questions: n5Vocab.filter((_, i) => [0, 3, 4, 6].includes(i)) },
  reading: { ...n5Mock.reading, durationMin: 8, questions: n5Reading.slice(0, 2) },
  listening: { ...n5Mock.listening, durationMin: 5, questions: n5Listening.slice(0, 1) },
};

// ---------------- JLPT N4 Mock 1 ----------------

const n4Mock: Exam = {
  id: "n4-mock-1",
  level: "N4",
  title: "JLPT N4 Mock Test 01",
  titleBn: "JLPT N4 মক টেস্ট ০১",
  vocab: {
    durationMin: 25,
    questions: [
      {
        id: "n4-v1",
        skill: "kanji",
        prompt: "[[急いで]] ください。",
        promptBn: "দয়া করে তাড়াতাড়ি করুন।",
        options: ["いそいで", "およいで", "さわいで", "ぬいで"],
        answer: 0,
        explanationBn:
          "急ぐ (いそぐ) = তাড়াতাড়ি করা; て-রূপ 急いで। およいで = সাঁতার কেটে, さわいで = হৈচৈ করে, ぬいで = খুলে (জামা)।",
      },
      {
        id: "n4-v2",
        skill: "grammar",
        prompt: "{空|そら|sora|আকাশ}が {暗い|くらい|kurai|অন্ধকার}です。{雨|あめ|ame|বৃষ্টি}が {降り|ふり|furi|পড়া}（　）です。",
        promptBn: "আকাশ অন্ধকার। মনে হচ্ছে বৃষ্টি (   )।",
        options: ["そう", "よう", "らしい", "みたい"],
        answer: 0,
        explanationBn:
          "চোখে দেখে অনুমান: ক্রিয়ার ます-কাণ্ড + そうです = ‘মনে হচ্ছে ~ হবে’। 降りそうです = বৃষ্টি হবে বলে মনে হচ্ছে। よう/みたい/らしい ক্রিয়ার সাধারণ রূপের (降る) সাথে বসে।",
      },
      {
        id: "n4-v3",
        skill: "grammar",
        prompt: "{先生|せんせい|sensei|শিক্ষক}に {作文|さくぶん|sakubun|রচনা}を {見て|みて|mite|দেখে}（　）。",
        promptBn: "শিক্ষককে দিয়ে রচনাটা দেখিয়ে (   )।",
        options: ["いただきました", "くださいました", "あげました", "くれました"],
        answer: 0,
        explanationBn:
          "‘(ব্যক্তি)に ~ていただく’ = উচ্চপদস্থ কারো কাছ থেকে উপকার পাওয়া (বিনয়ী)। কণা に থাকায় いただきました সঠিক। くださいました হলে 先生が লাগত।",
      },
      {
        id: "n4-v4",
        skill: "vocab",
        prompt: "この {薬|くすり|kusuri|ঔষধ}を {飲めば|のめば|nomeba|খেলে}、（　）なります。",
        promptBn: "এই ঔষধ খেলে (   ) হয়ে যাবেন।",
        options: ["よく", "いい", "よい", "よくて"],
        answer: 0,
        explanationBn:
          "い-বিশেষণ + なる: শেষের い বাদ দিয়ে く যোগ হয়। いい এর ক্ষেত্রে ব্যতিক্রম — よく なります (ভালো হয়ে যাবেন)।",
      },
    ],
  },
  reading: {
    durationMin: 55,
    title: "{図書館|としょかん|toshokan|লাইব্রেরি}からの お{知らせ|しらせ|shirase|নোটিশ}",
    passage: [
      {
        jp: "{来週|らいしゅう|raishū|আগামী সপ্তাহ}の {土曜日|どようび|doyōbi|শনিবার}に {町|まち|machi|শহর}の {図書館|としょかん|toshokan|লাইব্রেরি}で {日本|にほん|nihon|জাপান}の {文化|ぶんか|bunka|সংস্কৃতি}の イベントが あります。",
        bn: "আগামী সপ্তাহের শনিবার শহরের লাইব্রেরিতে জাপানি সংস্কৃতির একটি অনুষ্ঠান আছে।",
      },
      {
        jp: "{時間|じかん|jikan|সময়}は {午前|ごぜん|gozen|সকাল} {十時|じゅうじ|jūji|দশটা}から {午後|ごご|gogo|বিকেল} {四時|よじ|yoji|চারটা}までです。",
        bn: "সময় সকাল দশটা থেকে বিকেল চারটা পর্যন্ত।",
      },
      {
        jp: "{着物|きもの|kimono|কিমোনো}を {着る|きる|kiru|পরা} {体験|たいけん|taiken|অভিজ্ঞতা}も できます。",
        bn: "কিমোনো পরার অভিজ্ঞতাও নেওয়া যাবে।",
      },
      {
        jp: "{参加|さんか|sanka|অংশগ্রহণ}したい {人|ひと|hito|মানুষ}は {金曜日|きんようび|kin'yōbi|শুক্রবার}までに {電話|でんわ|denwa|ফোন}で {予約|よやく|yoyaku|বুকিং}して ください。",
        bn: "অংশ নিতে চাইলে শুক্রবারের মধ্যে ফোনে বুকিং করুন।",
      },
      {
        jp: "{料金|りょうきん|ryōkin|ফি}は {無料|むりょう|muryō|বিনামূল্যে}です。",
        bn: "কোনো ফি নেই (বিনামূল্যে)।",
      },
    ],
    questions: [
      {
        id: "n4-r1",
        skill: "reading",
        prompt: "イベントに {参加|さんか|sanka|অংশগ্রহণ}したい {人|ひと|hito|মানুষ}は {何|なに|nani|কী}を しなければ なりませんか。",
        promptBn: "অংশ নিতে চাইলে কী করতে হবে?",
        options: [
          "{金曜日|きんようび|kin'yōbi|শুক্রবার}までに {電話|でんわ|denwa|ফোন}で {予約|よやく|yoyaku|বুকিং}する",
          "{土曜日|どようび|doyōbi|শনিবার}に お{金|かね|kane|টাকা}を {払う|はらう|harau|পরিশোধ করা}",
          "{着物|きもの|kimono|কিমোনো}を {持って|もって|motte|নিয়ে} {行く|いく|iku|যাওয়া}",
          "{図書館|としょかん|toshokan|লাইব্রেরি}で {本|ほん|hon|বই}を {借りる|かりる|kariru|ধার নেওয়া}",
        ],
        answer: 0,
        explanationBn:
          "「金曜日までに電話で予約してください」— までに = ‘এর মধ্যে (ডেডলাইন)’। ফি বিনামূল্যে, তাই টাকা দিতে হবে না।",
      },
      {
        id: "n4-r2",
        skill: "reading",
        prompt: "イベントは いつ ありますか。",
        promptBn: "অনুষ্ঠানটি কবে?",
        options: [
          "{来週|らいしゅう|raishū|আগামী সপ্তাহ}の {土曜日|どようび|doyōbi|শনিবার}",
          "{今週|こんしゅう|konshū|এই সপ্তাহ}の {金曜日|きんようび|kin'yōbi|শুক্রবার}",
          "{来週|らいしゅう|raishū|আগামী সপ্তাহ}の {金曜日|きんようび|kin'yōbi|শুক্রবার}",
          "{毎週|まいしゅう|maishū|প্রতি সপ্তাহ} {土曜日|どようび|doyōbi|শনিবার}",
        ],
        answer: 0,
        explanationBn: "প্রথম বাক্য:「来週の土曜日に…イベントがあります」। শুক্রবার হলো বুকিংয়ের শেষ দিন।",
      },
    ],
  },
  listening: {
    durationMin: 35,
    situation: {
      jp: "{会社|かいしゃ|kaisha|অফিস}で {男|おとこ|otoko|পুরুষ}の{人|ひと|hito|লোক}と {女|おんな|onna|নারী}の{人|ひと|hito|লোক}が {話して|はなして|hanashite|কথা বলছেন} います。",
      bn: "অফিসে একজন পুরুষ ও একজন নারী কথা বলছেন।",
    },
    script: [
      { speaker: "男", jp: "{明日|あした|ashita|আগামীকাল}の {会議|かいぎ|kaigi|মিটিং}は {何時|なんじ|nanji|কয়টা}からですか。", bn: "আগামীকালের মিটিং কয়টা থেকে?" },
      { speaker: "女", jp: "{十時|じゅうじ|jūji|দশটা}からの {予定|よてい|yotei|পরিকল্পনা}でしたが、{十一時|じゅういちじ|jūichiji|এগারোটা}に {変わりました|かわりました|kawarimashita|পরিবর্তন হয়েছে}。", bn: "দশটা থেকে হওয়ার কথা ছিল, কিন্তু এগারোটায় পরিবর্তন হয়েছে।" },
      { speaker: "男", jp: "{場所|ばしょ|basho|জায়গা}は {同じ|おなじ|onaji|একই}ですか。", bn: "জায়গা কি একই?" },
      { speaker: "女", jp: "いいえ、{三階|さんがい|sangai|তিনতলা}の {会議室|かいぎしつ|kaigishitsu|মিটিং রুম}です。", bn: "না, তিনতলার মিটিং রুমে।" },
    ],
    questions: [
      {
        id: "n4-l1",
        skill: "listening",
        prompt: "{会議|かいぎ|kaigi|মিটিং}は {何時|なんじ|nanji|কয়টায়}に {始まります|はじまります|hajimarimasu|শুরু হবে}か。",
        promptBn: "মিটিং কয়টায় শুরু হবে?",
        options: ["{十時|じゅうじ|jūji|দশটা}", "{十一時|じゅういちじ|jūichiji|এগারোটা}", "{三時|さんじ|sanji|তিনটা}", "{一時|いちじ|ichiji|একটা}"],
        answer: 1,
        explanationBn:
          "「十時からの予定でしたが、十一時に変わりました」— ~でしたが = ‘ছিল, কিন্তু’। পরিবর্তনের পরের তথ্যই উত্তর: এগারোটা।",
      },
    ],
  },
};

// ---------------- NAT-TEST 5Q Mock 1 ----------------

const natMock: Exam = {
  id: "nat-5q-1",
  level: "NAT",
  title: "NAT-TEST 5Q Mock 01",
  titleBn: "NAT-TEST ৫কিউ মক টেস্ট ০১",
  vocab: {
    durationMin: 25,
    questions: [
      {
        id: "nat-v1",
        skill: "kanji",
        prompt: "[[電車]]で {行きます|いきます|ikimasu|যাই}。",
        promptBn: "ট্রেনে করে যাই।",
        options: ["でんしゃ", "でんしや", "てんしゃ", "でんちゃ"],
        answer: 0,
        explanationBn: "電車 = でんしゃ (ট্রেন)। しゃ তে ছোট ゃ — বড় や লিখলে (しや) ভুল। 電 = বিদ্যুৎ, 車 = গাড়ি।",
      },
      {
        id: "nat-v2",
        skill: "vocab",
        prompt: "{今日|きょう|kyō|আজ}は {天気|てんき|tenki|আবহাওয়া}が（　）です。{散歩|さんぽ|sanpo|হাঁটা}に {行きましょう|いきましょう|ikimashō|চলুন যাই}。",
        promptBn: "আজ আবহাওয়া (   )। চলুন হাঁটতে যাই।",
        options: ["いい", "おいしい", "たかい", "ひろい"],
        answer: 0,
        explanationBn: "আবহাওয়া ভালো = 天気がいい। おいしい = সুস্বাদু (খাবার), たかい = দামি/উঁচু, ひろい = প্রশস্ত।",
      },
      {
        id: "nat-v3",
        skill: "grammar",
        prompt: "{私|わたし|watashi|আমি}の {部屋|へや|heya|ঘর}に テレビ（　）ありません。",
        promptBn: "আমার ঘরে টিভি নেই।",
        options: ["は", "を", "で", "へ"],
        answer: 0,
        explanationBn:
          "না-বাচক অস্তিত্বে (～はありません) কণা は ব্যবহার করে বিষয়টিকে জোর দেওয়া হয়। を কর্মকারক, で স্থান (কাজের), へ দিক বোঝায় — ありません এর সাথে বসে না।",
      },
    ],
  },
  reading: {
    durationMin: 50,
    title: "ナディアさんへの メモ",
    passage: [
      { jp: "ナディアさんへ", bn: "নাদিয়ার প্রতি" },
      {
        jp: "きょうは {母|はは|haha|মা}の {誕生日|たんじょうび|tanjōbi|জন্মদিন}ですから、{早く|はやく|hayaku|তাড়াতাড়ি} {帰ります|かえります|kaerimasu|ফিরে যাব}。",
        bn: "আজ আমার মায়ের জন্মদিন, তাই তাড়াতাড়ি বাসায় ফিরব।",
      },
      {
        jp: "すみませんが、{明日|あした|ashita|আগামীকাল}の {朝|あさ|asa|সকাল} この {手紙|てがみ|tegami|চিঠি}を {田中|たなか|tanaka|তানাকা}さんに {渡して|わたして|watashite|হস্তান্তর করে} ください。",
        bn: "কষ্ট দিচ্ছি, আগামীকাল সকালে এই চিঠিটা তানাকা সাহেবকে দিয়ে দেবেন।",
      },
      { jp: "マリより", bn: "— মারি" },
    ],
    questions: [
      {
        id: "nat-r1",
        skill: "reading",
        prompt: "マリさんは ナディアさんに {何|なに|nani|কী}を たのみましたか。",
        promptBn: "মারি নাদিয়াকে কী করতে অনুরোধ করেছেন?",
        options: [
          "{手紙|てがみ|tegami|চিঠি}を {田中|たなか|tanaka|তানাকা}さんに {渡す|わたす|watasu|দেওয়া}",
          "{早く|はやく|hayaku|তাড়াতাড়ি} {帰る|かえる|kaeru|ফেরা}",
          "プレゼントを {買う|かう|kau|কেনা}",
          "{母|はは|haha|মা}に {電話|でんわ|denwa|ফোন}する",
        ],
        answer: 0,
        explanationBn:
          "অনুরোধ বোঝায় ～てください:「手紙を田中さんに渡してください」। তাড়াতাড়ি ফেরা মারির নিজের পরিকল্পনা, অনুরোধ নয়।",
      },
    ],
  },
  listening: {
    durationMin: 30,
    situation: {
      jp: "{道|みち|michi|রাস্তা}で {女|おんな|onna|নারী}の{人|ひと|hito|লোক}が {聞いて|きいて|kiite|জিজ্ঞেস করছেন} います。",
      bn: "রাস্তায় একজন নারী পথ জিজ্ঞেস করছেন।",
    },
    script: [
      { speaker: "女", jp: "すみません、{駅|えき|eki|স্টেশন}は どこですか。", bn: "মাফ করবেন, স্টেশন কোথায়?" },
      {
        speaker: "男",
        jp: "この {道|みち|michi|রাস্তা}を まっすぐ {行って|いって|itte|গিয়ে}、{二つ目|ふたつめ|futatsume|দ্বিতীয়}の {角|かど|kado|মোড়}を {右|みぎ|migi|ডান}に {曲がって|まがって|magatte|ঘুরে} ください。",
        bn: "এই রাস্তা ধরে সোজা গিয়ে দ্বিতীয় মোড়ে ডানে ঘুরুন।",
      },
      { speaker: "女", jp: "ありがとうございます。", bn: "ধন্যবাদ।" },
    ],
    questions: [
      {
        id: "nat-l1",
        skill: "listening",
        prompt: "{駅|えき|eki|স্টেশন}へ どう {行きます|いきます|ikimasu|যাবেন}か。",
        promptBn: "স্টেশনে কীভাবে যাবেন?",
        options: [
          "{二つ目|ふたつめ|futatsume|দ্বিতীয়}の {角|かど|kado|মোড়}を {右|みぎ|migi|ডান}",
          "{一つ目|ひとつめ|hitotsume|প্রথম}の {角|かど|kado|মোড়}を {右|みぎ|migi|ডান}",
          "{二つ目|ふたつめ|futatsume|দ্বিতীয়}の {角|かど|kado|মোড়}を {左|ひだり|hidari|বাম}",
          "まっすぐ だけ",
        ],
        answer: 0,
        explanationBn: "「二つ目の角を右に曲がってください」— ~つ目 = ক্রমবাচক (দ্বিতীয়), 右 = ডান, 左 = বাম।",
      },
    ],
  },
};

export const EXAMS: Exam[] = [n5Demo, n5Mock, n4Mock, natMock];
export const getExam = (id: string) => EXAMS.find((e) => e.id === id);

export const examQuestions = (e: Exam) => [
  ...e.vocab.questions,
  ...e.reading.questions,
  ...e.listening.questions,
];
export const examDurationMin = (e: Exam) =>
  e.vocab.durationMin + e.reading.durationMin + e.listening.durationMin;

// ---------------- Study books ----------------

export type BookEntry =
  | { kind: "vocab"; jp: string; reading: string; romaji: string; bn: string }
  | { kind: "kanji"; kanji: string; on: string; kun: string; bn: string; example: string }
  | { kind: "grammar"; pattern: string; bn: string; example: string; exampleBn: string };

export interface Chapter {
  title: string;
  titleBn: string;
  entries: BookEntry[];
}

export interface Book {
  id: string;
  title: string;
  titleBn: string;
  cover: string;
  subtitle: string;
  chapters: Chapter[];
}

const v = (jp: string, reading: string, romaji: string, bn: string): BookEntry => ({
  kind: "vocab",
  jp,
  reading,
  romaji,
  bn,
});
const k = (kanji: string, on: string, kun: string, bn: string, example: string): BookEntry => ({
  kind: "kanji",
  kanji,
  on,
  kun,
  bn,
  example,
});

export const BOOKS: Book[] = [
  {
    id: "minna-vocab",
    title: "Minna no Nihongo Vocabulary",
    titleBn: "মিন্না নো নিহোঙ্গো শব্দতালিকা",
    cover: "語",
    subtitle: "পাঠ ১–৫ · বাংলা অর্থ সহ",
    chapters: [
      {
        title: "第1課",
        titleBn: "পাঠ ১ · পরিচয়",
        entries: [
          v("私", "わたし", "watashi", "আমি"),
          v("学生", "がくせい", "gakusei", "ছাত্র/ছাত্রী"),
          v("先生", "せんせい", "sensei", "শিক্ষক"),
          v("会社員", "かいしゃいん", "kaishain", "কোম্পানির কর্মচারী"),
          v("医者", "いしゃ", "isha", "ডাক্তার"),
        ],
      },
      {
        title: "第2課",
        titleBn: "পাঠ ২ · জিনিসপত্র",
        entries: [
          v("本", "ほん", "hon", "বই"),
          v("辞書", "じしょ", "jisho", "অভিধান"),
          v("雑誌", "ざっし", "zasshi", "ম্যাগাজিন"),
          v("新聞", "しんぶん", "shinbun", "সংবাদপত্র"),
          v("傘", "かさ", "kasa", "ছাতা"),
        ],
      },
      {
        title: "第3課",
        titleBn: "পাঠ ৩ · জায়গা",
        entries: [
          v("教室", "きょうしつ", "kyōshitsu", "শ্রেণীকক্ষ"),
          v("食堂", "しょくどう", "shokudō", "ক্যান্টিন"),
          v("事務所", "じむしょ", "jimusho", "অফিস"),
          v("受付", "うけつけ", "uketsuke", "অভ্যর্থনা কক্ষ"),
          v("階段", "かいだん", "kaidan", "সিঁড়ি"),
        ],
      },
      {
        title: "第4課",
        titleBn: "পাঠ ৪ · দৈনন্দিন কাজ",
        entries: [
          v("起きます", "おきます", "okimasu", "ঘুম থেকে ওঠা"),
          v("寝ます", "ねます", "nemasu", "ঘুমানো"),
          v("働きます", "はたらきます", "hatarakimasu", "কাজ করা"),
          v("休みます", "やすみます", "yasumimasu", "বিশ্রাম/ছুটি নেওয়া"),
          v("勉強します", "べんきょうします", "benkyō shimasu", "পড়াশোনা করা"),
        ],
      },
      {
        title: "第5課",
        titleBn: "পাঠ ৫ · যাতায়াত",
        entries: [
          v("行きます", "いきます", "ikimasu", "যাওয়া"),
          v("来ます", "きます", "kimasu", "আসা"),
          v("帰ります", "かえります", "kaerimasu", "ফিরে যাওয়া"),
          v("電車", "でんしゃ", "densha", "ট্রেন"),
          v("飛行機", "ひこうき", "hikōki", "বিমান"),
        ],
      },
    ],
  },
  {
    id: "n5-kanji",
    title: "N5 Essential Kanji Cards",
    titleBn: "N5 জরুরি কাঞ্জি কার্ড",
    cover: "漢",
    subtitle: "২০টি কাঞ্জি · অন/কুন পাঠ",
    chapters: [
      {
        title: "数字",
        titleBn: "অধ্যায় ১ · সংখ্যা",
        entries: [
          k("一", "イチ", "ひと(つ)", "এক", "{一つ|ひとつ|hitotsu|একটি}"),
          k("二", "ニ", "ふた(つ)", "দুই", "{二人|ふたり|futari|দুইজন}"),
          k("三", "サン", "みっ(つ)", "তিন", "{三月|さんがつ|sangatsu|মার্চ}"),
          k("十", "ジュウ", "とお", "দশ", "{十日|とおか|tōka|দশ তারিখ}"),
          k("百", "ヒャク", "—", "একশো", "{百円|ひゃくえん|hyaku en|১০০ ইয়েন}"),
        ],
      },
      {
        title: "曜日",
        titleBn: "অধ্যায় ২ · সপ্তাহের দিন",
        entries: [
          k("日", "ニチ", "ひ", "দিন / সূর্য", "{日曜日|にちようび|nichiyōbi|রবিবার}"),
          k("月", "ゲツ・ガツ", "つき", "চাঁদ / মাস", "{月曜日|げつようび|getsuyōbi|সোমবার}"),
          k("火", "カ", "ひ", "আগুন", "{火曜日|かようび|kayōbi|মঙ্গলবার}"),
          k("水", "スイ", "みず", "পানি", "{水曜日|すいようび|suiyōbi|বুধবার}"),
          k("木", "モク", "き", "গাছ", "{木曜日|もくようび|mokuyōbi|বৃহস্পতিবার}"),
        ],
      },
      {
        title: "人",
        titleBn: "অধ্যায় ৩ · মানুষ",
        entries: [
          k("人", "ジン・ニン", "ひと", "মানুষ", "{日本人|にほんじん|nihonjin|জাপানি ব্যক্তি}"),
          k("男", "ダン", "おとこ", "পুরুষ", "{男の子|おとこのこ|otoko no ko|ছেলে}"),
          k("女", "ジョ", "おんな", "নারী", "{女の人|おんなのひと|onna no hito|মহিলা}"),
          k("子", "シ", "こ", "শিশু", "{子ども|こども|kodomo|শিশু}"),
          k("先", "セン", "さき", "আগে", "{先週|せんしゅう|senshū|গত সপ্তাহ}"),
        ],
      },
      {
        title: "場所",
        titleBn: "অধ্যায় ৪ · স্থান",
        entries: [
          k("山", "サン", "やま", "পাহাড়", "{富士山|ふじさん|fujisan|ফুজি পর্বত}"),
          k("川", "セン", "かわ", "নদী", "{川|かわ|kawa|নদী}"),
          k("学", "ガク", "まな(ぶ)", "শেখা", "{大学|だいがく|daigaku|বিশ্ববিদ্যালয়}"),
          k("校", "コウ", "—", "বিদ্যালয়", "{学校|がっこう|gakkō|বিদ্যালয়}"),
          k("駅", "エキ", "—", "স্টেশন", "{駅前|えきまえ|ekimae|স্টেশনের সামনে}"),
        ],
      },
    ],
  },
  {
    id: "n5-grammar",
    title: "N5 Grammar Summary Sheets",
    titleBn: "N5 ব্যাকরণ সারসংক্ষেপ",
    cover: "文",
    subtitle: "গুরুত্বপূর্ণ প্যাটার্ন · উদাহরণ সহ",
    chapters: [
      {
        title: "～は～です",
        titleBn: "শিট ১ · পরিচয় বাক্য",
        entries: [
          {
            kind: "grammar",
            pattern: "N1 は N2 です",
            bn: "N1 হলো N2 — পরিচয় বা সংজ্ঞা দেওয়ার মৌলিক বাক্য।",
            example: "{私|わたし|watashi|আমি}は {学生|がくせい|gakusei|ছাত্র}です。",
            exampleBn: "আমি একজন ছাত্র।",
          },
          {
            kind: "grammar",
            pattern: "N1 は N2 じゃありません",
            bn: "N1, N2 নয় — না-বাচক রূপ।",
            example: "{私|わたし|watashi|আমি}は {先生|せんせい|sensei|শিক্ষক}じゃありません。",
            exampleBn: "আমি শিক্ষক নই।",
          },
        ],
      },
      {
        title: "これ・それ・あれ",
        titleBn: "শিট ২ · নির্দেশক শব্দ",
        entries: [
          {
            kind: "grammar",
            pattern: "これ / それ / あれ",
            bn: "এটা (কাছে) / ওটা (শ্রোতার কাছে) / ঐটা (দুজনের থেকেই দূরে)।",
            example: "これは {本|ほん|hon|বই}です。",
            exampleBn: "এটা একটা বই।",
          },
          {
            kind: "grammar",
            pattern: "N1 の N2",
            bn: "N1 এর N2 — মালিকানা বা সম্পর্ক।",
            example: "{私|わたし|watashi|আমি}の {傘|かさ|kasa|ছাতা}です。",
            exampleBn: "এটা আমার ছাতা।",
          },
        ],
      },
      {
        title: "あります・います",
        titleBn: "শিট ৩ · অস্তিত্ব",
        entries: [
          {
            kind: "grammar",
            pattern: "(স্থান) に N が あります",
            bn: "নির্জীব জিনিসের অস্তিত্ব — ~ তে ~ আছে।",
            example: "{机|つくえ|tsukue|টেবিল}の {上|うえ|ue|উপর}に {本|ほん|hon|বই}が あります。",
            exampleBn: "টেবিলের উপর বই আছে।",
          },
          {
            kind: "grammar",
            pattern: "(স্থান) に N が います",
            bn: "জীবিত প্রাণী/মানুষের অস্তিত্ব।",
            example: "{教室|きょうしつ|kyōshitsu|শ্রেণীকক্ষ}に {先生|せんせい|sensei|শিক্ষক}が います。",
            exampleBn: "শ্রেণীকক্ষে শিক্ষক আছেন।",
          },
        ],
      },
      {
        title: "～ましょう・～たい",
        titleBn: "শিট ৪ · প্রস্তাব ও ইচ্ছা",
        entries: [
          {
            kind: "grammar",
            pattern: "V-ましょう",
            bn: "চলুন ~ করি — প্রস্তাব দেওয়া।",
            example: "{一緒|いっしょ|issho|একসাথে}に {食べましょう|たべましょう|tabemashō|খাই চলুন}。",
            exampleBn: "চলুন একসাথে খাই।",
          },
          {
            kind: "grammar",
            pattern: "V(ます-কাণ্ড) + たいです",
            bn: "~ করতে চাই — নিজের ইচ্ছা প্রকাশ।",
            example: "{日本|にほん|nihon|জাপান}へ {行きたい|いきたい|ikitai|যেতে চাই}です。",
            exampleBn: "আমি জাপানে যেতে চাই।",
          },
        ],
      },
    ],
  },
];

export const getBook = (id: string) => BOOKS.find((b) => b.id === id);

/** Interactive sample on the homepage hero. */
export const HERO_SAMPLE = {
  sentence:
    "{私|わたし|watashi|আমি}{は||wa|(বিষয় নির্দেশক কণা)} {毎朝|まいあさ|maiasa|প্রতিদিন সকালে} {電車|でんしゃ|densha|ট্রেন}{で||de|দিয়ে/করে} [[学校]]{へ||e|দিকে} {行きます|いきます|ikimasu|যাই}。",
  bn: "আমি প্রতিদিন সকালে ট্রেনে করে স্কুলে যাই।",
  question: "「学校」の よみかたは？",
  options: ["がっこう", "がくこう", "かっこう", "がっこ"],
  answer: 0,
  explanationBn: "学校 = がっこう (gakkō) — বিদ্যালয়।",
};
