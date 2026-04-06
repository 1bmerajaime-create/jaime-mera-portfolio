(() => {
  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const searchData = window.PORTFOLIO_INDEX || [];
  const projects = window.PORTFOLIO_PROJECTS || {};
  const profile = window.JAIME_PROFILE || {};
  const qaPairs = window.JAIME_QA || [];
  const inputs = Array.from(document.querySelectorAll(".search-bar input"));
  const thread = document.querySelector(".chat-thread");
  const searchBars = Array.from(document.querySelectorAll(".search-bar"));
  const sendButtons = Array.from(document.querySelectorAll(".send-button"));
  const quickRow = document.querySelector(".chat-quick");
  const quickButtons = document.querySelectorAll(".chat-quick .quick-chip");
  const body = document.body;
  const logoLinks = document.querySelectorAll(".logo");
  const backButton = document.querySelector(".chat-back");
  const STORAGE_VERSION = "4";
  const PROJECT_STORAGE_KEY = "jaime-chat-project";
  const CLICKED_SUGGESTIONS_KEY = "jaime-chat-clicked-suggestions";
  const PENDING_CARDS_KEY = "jaime-chat-pending-cards";
  const SHOWN_CARDS_KEY = "jaime-chat-shown-cards";

  // Lightweight conversational state (not persisted across sessions)
  let chatTurnCount = 0;
  let lastIntroUsed = "";
  let lastAssistantMessage = "";
  let lastAssistantFirstWord = "";
  let lastOpenerUsed = "";
  /** Anthropic thread (only used when PORTFOLIO_CHAT_API_URL / meta is set). */
  let llmMessages = [];

  if (!inputs.length || !thread) return;

  const getChatApiUrl = () => {
    const fromWin =
      typeof window !== "undefined" && window.PORTFOLIO_CHAT_API_URL
        ? String(window.PORTFOLIO_CHAT_API_URL).trim()
        : "";
    if (fromWin) return fromWin;
    const meta = document.querySelector('meta[name="portfolio-chat-api"]');
    return (meta && meta.getAttribute("content") ? meta.getAttribute("content") : "").trim();
  };

  const isAffirmative = (normalized) =>
    /^(yes|yep|yeah|sure|ok|okay|do it|show me|let’s do it|lets do it|go ahead|sounds good)\b/.test(
      normalized
    );

  const isNegative = (normalized) =>
    /^(no|nope|nah|not now|later|don’t|dont)\b/.test(normalized);

  const getPendingCards = () => {
    const stored = localStorage.getItem(PENDING_CARDS_KEY);
    if (!stored) return [];
    try {
      const keys = JSON.parse(stored);
      if (!Array.isArray(keys)) return [];
      return keys.map((k) => projects[k]).filter(Boolean);
    } catch (error) {
      return [];
    }
  };

  const setPendingCards = (cards = []) => {
    const keys = Object.keys(projects).filter((key) =>
      cards.some((card) => card && card.url && card.url === projects[key]?.url)
    );
    localStorage.setItem(PENDING_CARDS_KEY, JSON.stringify(keys.slice(0, 2)));
  };

  const clearPendingCards = () => {
    localStorage.removeItem(PENDING_CARDS_KEY);
  };

  const getShownCardUrls = () => {
    const stored = localStorage.getItem(SHOWN_CARDS_KEY);
    if (!stored) return new Set();
    try {
      const arr = JSON.parse(stored);
      if (!Array.isArray(arr)) return new Set();
      return new Set(arr.filter(Boolean));
    } catch (error) {
      return new Set();
    }
  };

  const persistShownCardUrls = (set) => {
    localStorage.setItem(SHOWN_CARDS_KEY, JSON.stringify([...set]));
  };

  const markCardsShown = (cards = []) => {
    const shown = getShownCardUrls();
    cards.forEach((card) => {
      if (card && card.url) shown.add(card.url);
    });
    persistShownCardUrls(shown);
  };

  const rehydrateShownCardsFromDOM = () => {
    const shown = getShownCardUrls();
    thread.querySelectorAll(".chat-card").forEach((el) => {
      const href = el.getAttribute("href");
      if (href) shown.add(href);
    });
    persistShownCardUrls(shown);
  };

  const getLlmFollowUpChips = (lastUserText) => {
    const n = normalize(lastUserText || "");
    if (/(adidas|click|wholesale|b2b)/.test(n)) {
      return [
        "What did you learn on the shop floor?",
        "Numbers behind the design system",
        "Open the Adidas case study",
      ];
    }
    if (/(system|galatea|component|token)/.test(n)) {
      return [
        "Galatea vs Click—how were they different?",
        "How did you get teams to adopt it?",
        "Biggest system mistake you avoid now",
      ];
    }
    if (/(sabadell|bank|banking|galatea)/.test(n)) {
      return [
        "What moved mobile conversion?",
        "Private banking lead story",
        "Open the Sabadell case study",
      ];
    }
    if (/(metric|impact|result|kpi|conversion)/.test(n)) {
      return [
        "Strongest proof from Adidas",
        "Banking outcomes at Sabadell",
        "Where efficiency showed up at Rio Tinto",
      ];
    }
    if (/(ai|claude|chatgpt|aily|llm)/.test(n)) {
      return [
        "How AI shows up in your workflow",
        "Designing AI products at AILY",
        "Where you still go slow on craft",
      ];
    }
    if (/(hire|hiring|candidate|join (my|our) team|recruit)/.test(n)) {
      return [
        "Your process with PM and engineering",
        "A case study that matches our domain",
        "What you need to know about the role",
      ];
    }
    return [
      "Which case study should I read first?",
      "How do you start a messy project?",
      "What kind of role are you open to?",
    ];
  };

  const getContextualSuggestions = (text) => {
    const t = normalize(text);
    if (t.includes("adidas") || t.includes("click")) {
      return [
        "Tell me about the mobile app",
        "How did you build the design system?",
        "Show me the project",
      ];
    }
    if (t.includes("design system") || t.includes("components")) {
      return ["What was the impact?", "Show me examples", "What were the challenges?"];
    }
    if (t.includes("sabadell") || t.includes("galatea")) {
      return ["What drove the conversion lift?", "Show me the project", "How did you roll it out?"];
    }
    if (t.includes("beedata")) {
      return ["What changed in the dashboards?", "How did you improve onboarding?", "Show me the project"];
    }
    if (t.includes("shell") || t.includes("payments") || t.includes("ev")) {
      return ["What were the edge cases?", "How did you scale it globally?", "Show me the project"];
    }
    return ["Tell me more", "Show me your work", "What else have you done?"];
  };

  const KEYWORDS = [
    {
      keys: [
        "join my team",
        "join our team",
        "join the team",
        "why would you be a good",
        "why should we hire",
        "why should i hire",
        "good candidate",
        "good condidate",
        "looking for a product designer",
        "looking for a designer",
        "hiring a designer",
        "hiring a product designer",
        "hire you",
        "want to hire",
        "recruiting",
        "open role",
        "open position",
        "full-time designer",
        "why you for this role",
      ],
      project: null,
      response:
        "If you are hiring a product designer, here is how I would be useful on your team: I have shipped complex products end-to-end—notably the Adidas wholesale mobile app across 15+ markets and two design systems built from scratch (Galatea at Banco Sabadell, Click at Adidas). I am comfortable owning research through handoff, aligning with PM and engineering, and arguing from metrics as much as from craft—think outcomes like faster design-to-dev, conversion lifts, and adoption of systems at scale. I am Madrid-based and open to remote or hybrid for the right product. What level are you hiring for, what domain is the product in, and how is the design team structured today?",
      suggestions: [
        "Biggest measurable impact you have driven",
        "How do you hand off to developers?",
        "Are you open to relocation or hybrid?",
      ],
    },
    {
      keys: ["adidas click", "adidas", "wholesale", "b2b", "e-commerce", "ecommerce"],
      project: "adidas",
      response:
        "Adidas Click is the global B2B platform that wholesale buyers use worldwide. I led the wholesale mobile app from research through launch across 15+ markets and co-created the Click design system from scratch. For the app, I spent time on shop floors and designed a scanning-based reordering flow that made day-to-day ordering dramatically faster. The design system side was 50+ components, full documentation, and guardrails so designers and developers could ship consistently without babysitting every screen. The result was roughly 60% faster design-to-dev and about 40% faster reordering in real stores. Are you more curious about the mobile app side, the design system, or the business impact numbers?",
      suggestions: [
        "How did you scale the design system?",
        "What was the mobile app impact?",
        "How did you handle B2B complexity?",
      ],
    },
    {
      keys: ["sabadell", "banking", "bank", "galatea", "finance"],
      project: "sabadell",
      response:
        "Banco Sabadell was a full digital banking transformation where we basically had to drag an old ecosystem into something people actually wanted to use. I built the Galatea design system from zero, turning a messy set of screens into a single, coherent language that worked for both retail and private banking. We ended up with 200+ components and patterns that teams could plug into instead of reinventing buttons for the hundredth time. That foundation helped drive a 35% lift in mobile conversion and a 45% increase in private banking leads, plus about 50% faster design-to-dev cycles. It is one of those projects where design, ops, and business all line up. Are you interested more in the system itself, the metrics, or how we rolled it out to so many teams?",
      suggestions: [
        "How did Galatea help teams?",
        "What drove the conversion lift?",
        "Show the design system work",
      ],
    },
    {
      keys: [
        "beedata",
        "bee data",
        "saas",
        "subscription",
        "analytics",
        "dashboard",
        "insights",
        "onboarding",
      ],
      project: "beedata",
      response:
        "BeeData was all about taking an intimidating, engineering-first analytics tool and turning it into something normal humans could actually use. We reframed it as a kind of business intelligence advisor, with guided flows and language that made sense to sales and ops teams instead of data scientists. I led research, redesigned the IA, and created dashboards that surfaced the right insights without forcing people to wrestle with a hundred filters. That work grew subscriptions by roughly 20–30%, pushed NPS from 32 up to 58, and cut onboarding from three weeks down to three days. Not bad for something that started as a pretty dense product. Are you more interested in the UX changes, the research, or the business results?",
      suggestions: [
        "How did you improve onboarding?",
        "What did you change in the dashboards?",
        "How did you build trust in AI?",
      ],
    },
    {
      keys: ["shell", "ev", "charging", "carwash", "payments"],
      project: "shell",
      response:
        "For Shell, the challenge was to make one app feel coherent while it juggled EV charging, fuel, carwash, payments, and loyalty across different countries. I focused on creating scalable service patterns and payment flows that could flex to local needs without turning the UI into a Frankenstein monster. That meant lots of work on states, edge cases, and the little transitions that make complex journeys feel simple. The result was a global foundation teams could reuse instead of rebuilding flows for every region. It is not the flashy \"Dribbble shot\" type of work, but it is the kind that quietly keeps everything running. Want to hear more about the EV part, the payments side, or how we handled all those variations?",
      suggestions: [
        "What made the global app scalable?",
        "How did you design for EV use cases?",
        "Show the Shell work",
      ],
    },
    {
      keys: ["wivai", "caixabank", "retail", "marketplace", "e-commerce"],
      project: "wivai",
      response:
        "Wivai was CaixaBank's jump into retail e-commerce, which is not exactly the most obvious move for a bank. I helped shape the brand and designed a mobile-first experience that made the whole thing feel trustworthy but still friendly enough for everyday shopping. A lot of the work was about simplifying flows, building trust patterns, and keeping the checkout from turning into a nine-step interrogation. The platform grew to over 233K monthly visits and cut bounce rate by about a third. It is a good example of blending financial UX with consumer e-commerce expectations. Are you more interested in the brand side, the UX flows, or the business impact?",
      suggestions: [
        "How did you define the value prop?",
        "What did mobile-first change?",
        "Show the Wivai case",
      ],
    },
    {
      keys: ["motogp", "racing", "sports", "video", "live"],
      project: "motogp",
      response:
        "MotoGP needed a serious visual refresh and some new product thinking to match how fans actually follow races now. I led the visual direction, created a dark-mode-first design system, and prototyped eight new feature concepts focused on a very mobile-heavy audience. Think live data, video, and race-day flows that had to feel exciting without being a chaotic mess. The work modernised the platform’s look and gave leadership concrete POCs to build into the roadmap. It is one of the more \"fun\" projects visually, but it still had a lot of product strategy underneath. Do you want to hear more about the visual system, the concepts, or how we approached live content?",
      suggestions: [
        "What features did you prototype?",
        "How did you handle live data?",
        "Show the MotoGP work",
      ],
    },
    {
      keys: ["rio tinto", "riotinto", "tinto", "true view", "hr", "safety", "enterprise", "workflow"],
      project: "riotinto",
      response:
        "Rio Tinto was a global HR platform project where the main goal was to make HR tools suck less for both employees and admins. I designed a universal core experience with regional modules so each country could meet its legal and cultural needs without breaking the system. A lot of the work was around workflows, permissions, and making self-service actually usable instead of something people avoid. That structure cut routine HR work by around 30% and sped up feature delivery by roughly 60%. It is very enterprise, but also very satisfying when you see the efficiency numbers move. Are you more into the system architecture part or the UX for employees?",
      suggestions: [
        "How did you drive efficiency?",
        "What was the system architecture?",
        "Show the Rio Tinto case",
      ],
    },
    {
      keys: ["design system", "component library", "design tokens", "system", "components", "tokens"],
      project: "sabadell",
      response:
        "Design systems are one of my main playgrounds. I built Galatea for Banco Sabadell from scratch and co-created the Click system for Adidas, both of which went way beyond \"a Figma file with some buttons\". These systems included tokens, components, documentation, and governance so teams could move faster without slowly drifting into chaos. They helped cut design-to-dev time by 50–60% and made it possible to scale work across multiple squads without sacrificing quality. I like systems because they sit right at the intersection of craft, ops, and business impact. Are you interested in how the systems were structured, how we rolled them out, or how they changed team behaviour?",
      suggestions: [
        "How did Galatea work in practice?",
        "Show the Adidas system impact",
        "What governance did you set?",
      ],
    },
    {
      keys: ["mobile-first", "mobile app", "wholesale app", "one-handed", "phone-first"],
      project: null,
      response:
        "I treat mobile as the default, not a squeezed-down desktop layout. The Adidas wholesale app is the clearest example—staff reordering from the shop floor—but the same thinking shows up in Shell, Wivai, and banking work: fewer steps, thumb-friendly actions, and realistic states for noisy environments and uneven connectivity. Tell me if you want the research side, UI patterns, or metrics from a specific case.",
      suggestions: [
        "How did you design the Adidas wholesale app?",
        "Mobile patterns in the Shell app",
        "Show me mobile-heavy work",
      ],
    },
    {
      keys: [
        "impact",
        "metrics",
        "results",
        "growth",
        "conversion",
        "kpis",
        "outcomes",
        "measure",
        "measurable",
      ],
      project: null,
      response:
        "I anchor work in outcomes, not decoration. Across case studies that shows up as things like ~60% faster design-to-dev on Adidas Click, a 35% mobile conversion lift at Banco Sabadell, 20–30% subscription growth at BeeData, and roughly 30% less routine HR time after Rio Tinto’s platform work. If you say whether you care most about revenue, speed-to-ship, or adoption, I can unpack the right project in more detail.",
      suggestions: [
        "What moved the needle at Adidas?",
        "Banking numbers at Sabadell",
        "Efficiency wins at Rio Tinto",
      ],
    },
    {
      keys: [
        "who are you",
        "tell me about yourself",
        "about yourself",
        "about me",
        "jaime mera",
        "about",
        "background",
        "bio",
        "jaime",
        "who",
      ],
      project: null,
      response:
        profile.summary ||
        "I am a Product Design Lead at AILY Labs in Madrid, with a background across Accenture Song and a bunch of global clients. I have spent the last years building design systems from scratch, leading mobile-first work, and obsessing over how design shows up in business metrics. My sweet spot is complex products that need to become simple and useful without losing power. I am also pretty AI-native: I design AI products and use tools like Claude, ChatGPT, and Midjourney daily to move faster. That does not mean skipping thinking – it just means automating the boring parts. What part of my background are you most curious about – experience, projects, or how I work with teams?",
      suggestions: [
        "What makes you different?",
        "Show your best project",
        "How do you work with AI?",
      ],
    },
    {
      keys: [
        "aily",
        "artificial intelligence",
        "ai",
        "claude",
        "chatgpt",
        "chat gpt",
        "openai",
        "gpt-4",
        "gpt4",
        "midjourney",
        "llm",
        "generative ai",
        "copilot",
      ],
      project: null,
      response:
        "I am fairly AI-native in two directions at once. On one side I lead design at AILY Labs, an AI company in Madrid, which means working on products where AI is not just a buzzword but the core of the experience. On the other side I use tools like Claude, ChatGPT, and Midjourney daily to speed up research synthesis, exploration, and even bits of visual thinking. The trick is knowing when to lean on AI and when to slow down and think like a human, especially for high-stakes decisions. Done right, it lets you move faster without turning everything into generic sludge. Are you thinking about AI in your own product, or just curious how it fits into a design workflow?",
      suggestions: [
        "How do you keep quality high?",
        "What AI features have you designed?",
        "Show a project with AI impact",
      ],
    },
    {
      keys: ["different", "unique", "why you", "differentiator"],
      project: null,
      response:
        "A few things make me a bit different from the average \"I love Figma\" designer. I build systems, not just screens – I have created two design systems from scratch, not just inherited someone else\u2019s library. I also start from business metrics and constraints, so conversations are about things like 60% faster teams or 35% conversion lifts, not just color palettes. On top of that, I work in an AI company and use AI tools daily, which means I can move fast without cutting corners on thinking. And I have worked across banking, fashion, B2B SaaS, and heavy industry, so I tend to bring patterns from one world into another. Which part of that mix is most relevant to what you are looking for?",
      suggestions: [
        "Show the Galatea system",
        "What impact stands out most?",
        "How do you start projects?",
      ],
    },
  ];

  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const BRAND_KEYS = new Set([
    "adidas",
    "sabadell",
    "beedata",
    "shell",
    "wivai",
    "motogp",
    "galatea",
    "caixabank",
    "aily",
    "claude",
    "chatgpt",
    "midjourney",
    "tinto",
    "jaime",
    "ai",
  ]);

  const WEAK_KEYS = new Set([
    "mobile",
    "wholesale",
    "banking",
    "bank",
    "finance",
    "saas",
    "subscription",
    "analytics",
    "ev",
    "charging",
    "carwash",
    "payments",
    "retail",
    "marketplace",
    "sports",
    "racing",
    "video",
    "live",
    "enterprise",
    "workflow",
    "hr",
    "safety",
    "components",
    "tokens",
    "impact",
    "metrics",
    "results",
    "growth",
    "conversion",
    "about",
    "background",
    "bio",
    "different",
    "unique",
    "design",
    "system",
    "app",
    "who",
    "ecommerce",
  ]);

  const KEYWORD_MATCH_MIN = 12;

  const scoreKeywordEntry = (normalizedFull, entry) => {
    const scores = [];
    for (const key of entry.keys) {
      const nk = normalize(key).trim();
      if (!nk) continue;
      let pts = 0;
      if (nk.includes(" ")) {
        if (normalizedFull.includes(nk)) pts = 26;
      } else {
        const re = new RegExp(`\\b${escapeRe(nk)}\\b`, "i");
        if (!re.test(normalizedFull)) continue;
        if (BRAND_KEYS.has(nk)) pts = 20;
        else if (WEAK_KEYS.has(nk)) pts = 6;
        else pts = 11;
      }
      scores.push(pts);
    }
    if (!scores.length) return 0;
    scores.sort((a, b) => b - a);
    let total = scores[0];
    for (let i = 1; i < scores.length && i < 4; i += 1) {
      total += Math.min(scores[i], 7);
    }
    return total;
  };

  const pickBestKeywordEntry = (normalizedFull) => {
    let bestEntry = null;
    let bestScore = 0;
    for (const entry of KEYWORDS) {
      const score = scoreKeywordEntry(normalizedFull, entry);
      if (score > bestScore) {
        bestScore = score;
        bestEntry = entry;
      }
    }
    return bestEntry && bestScore >= KEYWORD_MATCH_MIN
      ? { entry: bestEntry, score: bestScore }
      : null;
  };

  const followUpKeys = [
    "more",
    "tell",
    "details",
    "impact",
    "metrics",
    "results",
    "outcomes",
    "challenge",
    "problem",
    "solution",
    "role",
    "what did",
    "how did",
    "system",
    "features",
    "why",
  ];

  const SUGGESTED_RESPONSES = {
    "Tell me about your work":
      "I'm a Product Design Lead at AILY Labs, but most of my portfolio is from Accenture Song working with Adidas, Banco Sabadell, and BeeData. My sweet spot is making complex systems simple—built two design systems from scratch and led a mobile app to 15+ markets. What kind of projects are you interested in?",

    "What makes you different?":
      "Three things: I speak business language (60% faster, 35% conversion lift), I've built design systems from scratch twice, and I'm AI-native—use Claude and ChatGPT daily to work 10x faster. Most designers can't do all three. Want to see how that plays out?",

    "What's your biggest achievement?":
      "Building the Click design system at Adidas—100% adoption by the B2B team and 60% faster development. Close second is leading the Adidas mobile app from research to launch in 15+ markets. What kind of impact matters most to you?",
  };

  const SUGGESTED_RESPONSE_KEYS = Object.keys(SUGGESTED_RESPONSES).reduce(
    (acc, key) => {
      acc[normalize(key)] = key;
      return acc;
    },
    {}
  );

  const getProjectDetail = (projectKey, query) => {
    const details = profile.projects ? profile.projects[projectKey] : null;
    if (!details) return null;
    const normalized = normalize(query);
    if (
      normalized.includes("impact") ||
      normalized.includes("metric") ||
      normalized.includes("result") ||
      normalized.includes("outcome")
    ) {
      return `${details.name} impact: ${details.impact}`;
    }
    if (normalized.includes("challenge") || normalized.includes("problem")) {
      return `${details.name} challenge: ${details.challenge}`;
    }
    if (normalized.includes("role") || normalized.includes("what did")) {
      return `${details.name} role: ${details.role}. ${details.whatIDid}`;
    }
    if (normalized.includes("features") || normalized.includes("solution")) {
      return `${details.name} approach: ${details.whatIDid}`;
    }
    return `${details.overview} Impact: ${details.impact}`;
  };

  const getChatResponse = (query, context = {}) => {
    const {
      turnCount = 1,
      wantsProjects = false,
      explicitProjectsRequest = false,
    } = context;
    const normalized = normalize(query);
    const workAdjacent =
      /(work|project|projects|portfolio|case study|case studies|achievement|different|impact|metrics|results|design system|system|components|adidas|sabadell|beedata|shell|wivai|motogp|rio tinto|riotinto)/.test(
        normalized
      );
    const pickContextProjects = () => {
      const active = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (active && projects[active]) return [projects[active]].filter(Boolean);

      const ORDERED_PROJECT_KEYS = [
        "adidas",
        "sabadell",
        "beedata",
        "shell",
        "wivai",
        "motogp",
        "riotinto",
      ];
      const all = ORDERED_PROJECT_KEYS.map((key) => ({
        key,
        project: projects[key],
      })).filter((entry) => entry.project);

      const STOP = new Set([
        "the",
        "and",
        "for",
        "with",
        "this",
        "that",
        "what",
        "how",
        "why",
        "who",
        "where",
        "when",
        "are",
        "is",
        "do",
        "does",
        "can",
        "could",
        "should",
        "would",
        "your",
        "you",
        "me",
        "my",
        "i",
        "im",
        "its",
        "about",
        "show",
        "see",
        "view",
        "work",
        "projects",
        "project",
        "case",
        "study",
        "cards",
        "card",
      ]);

      const tokens = normalized
        .split(/\s+/)
        .map((t) => t.replace(/[^a-z0-9%+.-]/g, ""))
        .filter((t) => t.length > 2 && !STOP.has(t));

      const shown = getShownCardUrls();
      const allowShown = !!explicitProjectsRequest;

      const boosts = [
        { re: /(design system|system|components|tokens|governance)/, keys: ["sabadell", "adidas"] },
        { re: /(bank|banking|finance|private banking)/, keys: ["sabadell"] },
        { re: /(saas|subscription|analytics|dashboard|insights)/, keys: ["beedata"] },
        { re: /(energy|ev|charging|carwash|payments|loyalty)/, keys: ["shell"] },
        { re: /(e-?commerce|retail|marketplace|checkout)/, keys: ["wivai", "adidas"] },
        { re: /(sports|racing|video|live|fans)/, keys: ["motogp"] },
        { re: /(enterprise|workflow|hr|compliance|safety)/, keys: ["riotinto"] },
        { re: /(b2b|wholesale)/, keys: ["adidas", "beedata"] },
        { re: /(mobile|app)/, keys: ["adidas", "shell", "wivai"] },
      ];

      const scoreProject = (entry) => {
        const p = entry.project;
        const hay = normalize(
          `${p.title || ""} ${p.tag || ""} ${p.description || ""} ${p.metric || ""}`
        );
        let score = 0;
        tokens.forEach((token) => {
          if (hay.includes(token)) score += 2;
        });
        boosts.forEach((b) => {
          if (!b.re.test(normalized)) return;
          if (b.keys.includes(entry.key)) score += 8;
        });
        // If the query explicitly mentions the project name, give it a strong bump.
        if (hay.includes(entry.key)) score += 6;
        return score;
      };

      const ranked = all
        .map((entry, idx) => ({
          entry,
          idx,
          score: scoreProject(entry),
          shown: !!(entry.project?.url && shown.has(entry.project.url)),
        }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          // Prefer not-yet-shown cards unless user explicitly asks for cards.
          if (!allowShown && a.shown !== b.shown) return a.shown ? 1 : -1;
          return a.idx - b.idx;
        })
        .map((r) => r.entry.project)
        .filter(Boolean);

      // If nothing matches strongly, rotate through projects without repeating.
      const top = ranked.slice(0, 2);
      if (top.length) return top;
      return all
        .map((e) => e.project)
        .filter(Boolean)
        .filter((p) => (allowShown ? true : !(p.url && shown.has(p.url))))
        .slice(0, 2);
    };
    const showProjectsNow = explicitProjectsRequest
      ? turnCount >= 2
      : wantsProjects && turnCount >= 3;

    const suggestedKey = SUGGESTED_RESPONSE_KEYS[normalized];
    if (suggestedKey) {
      return {
        text: SUGGESTED_RESPONSES[suggestedKey],
        allowShort: true,
        plainText: true,
        projects: showProjectsNow
          ? pickContextProjects().slice(0, 2)
          : [],
        suggestions: [
          "Tell me about Adidas Click",
          "Show me B2B work",
          "What business impact stands out?",
        ],
      };
    }

    const keywordHit = pickBestKeywordEntry(normalized);
    const match = keywordHit ? keywordHit.entry : null;

    if (match) {
      if (match.project) {
        localStorage.setItem(PROJECT_STORAGE_KEY, match.project);
      }
      // If we're talking about a specific project, start surfacing the card after a couple turns.
      const shouldShowCards = !!match.project
        ? explicitProjectsRequest
          ? turnCount >= 2
          : turnCount >= 3
        : false;
      return {
        text: match.response,
        plainText: true,
        projects: shouldShowCards ? [projects[match.project]] : [],
        suggestions: match.suggestions,
      };
    }

    const activeProject = localStorage.getItem(PROJECT_STORAGE_KEY);
    const isFollowUp = followUpKeys.some((key) =>
      normalized.includes(normalize(key))
    );
    if (activeProject && isFollowUp) {
      const detail = getProjectDetail(activeProject, query);
      if (detail) {
        const shouldShowCards =
          !!projects[activeProject] && (showProjectsNow || turnCount >= 3);
        return {
          text: detail,
          plainText: true,
          projects: shouldShowCards
            ? [projects[activeProject]].filter(Boolean)
            : [],
          suggestions: [
            "What was the impact?",
            "What was the challenge?",
            "What did you do?",
          ],
        };
      }
    }

    // First turn: act as a warm welcome and ask what they are here for
    if (turnCount === 1) {
      return {
        text:
          "Hey — welcome. What brings you here: hiring, design inspiration, or checking out the work? If you tell me what you care about (B2B, consumer, design systems, mobile), I’ll point you to the right thing.",
        plainText: true,
        projects: [],
        suggestions: [
          "Tell me about your work",
          "What makes you different?",
          "What's your biggest achievement?",
        ],
      };
    }

    // Work intent: talk first, then show cards after 2–3 turns (unless explicit)
    if (wantsProjects && !showProjectsNow) {
      return {
        text:
          "Cool — before I throw project links at you like confetti, what kind of work do you actually want to see? Design systems, mobile apps, B2B enterprise, consumer e‑commerce… pick a lane and I’ll point you to the right case study. If you don’t care, I’ll pull two strong ones based on what you’re asking (Adidas, Sabadell, BeeData, Shell, Wivai, MotoGP, Rio Tinto — all fair game).",
        plainText: true,
        projects: [],
        suggestions: [
          "Design systems",
          "Mobile apps",
          "B2B enterprise",
        ],
      };
    }

    if (showProjectsNow && wantsProjects) {
      const picks = pickContextProjects().slice(0, 2);
      return {
        text:
          "Alright, you’ve earned the visuals. Here are two good starting points based on what you’ve been asking — craft + real numbers, no fluff. If you tell me what you care about (systems vs product flows vs pure impact), I can narrow it down even more.",
        plainText: true,
        projects: picks,
        suggestions: [
          "Tell me more about Adidas",
          "Tell me more about Banco Sabadell",
          "Show me B2B SaaS work",
        ],
      };
    }

    // Try to answer from the Q&A knowledge base (keep it conversational, not copy-pastey)
    if (qaPairs.length) {
      const STOPWORDS = new Set([
        "the",
        "and",
        "for",
        "with",
        "this",
        "that",
        "what",
        "how",
        "why",
        "who",
        "where",
        "when",
        "are",
        "is",
        "do",
        "does",
        "can",
        "could",
        "should",
        "would",
        "your",
        "you",
        "me",
        "my",
        "i",
        "im",
        "its",
        "about",
      ]);

      const tokens = normalized
        .split(/\s+/)
        .map((t) => t.replace(/[^a-z0-9%+.-]/g, ""))
        .map((t) => (t === "jaime" ? "you" : t))
        .filter((t) => t.length > 2 && !STOPWORDS.has(t));

      const detectMode = () => {
        if (
          /(salary|compensation|notice|start|visa|sponsor|sponsorship|benefits|equity|authorization)/.test(
            normalized
          )
        )
          return "recruiter";
        if (
          /(hire|hiring|recruit|recruiting|candidate|condidate|join (my|our|the) team|open role|open position|job opening|looking for (a |an )?(product )?designer|why (would|should) (i|we) hire|why would you be (a )?good)/.test(
            normalized
          )
        )
          return "recruiter";
        if (
          /(figma|sketch|xd|after effects|prototype|prototyp|tokens|components?|dev mode|html|css|javascript|wcag|accessibility|typography|design system)/.test(
            normalized
          )
        )
          return "designer";
        if (/(ceo|roi|revenue|kpi|metrics|conversion|retention|growth|strategy)/.test(normalized))
          return "exec";
        return "general";
      };

      const scoreItem = (item) => {
        const nq = item.normalizedQuestion;
        let score = 0;
        if (normalized.length >= 10 && nq.length >= 8) {
          if (normalized.includes(nq) || nq.includes(normalized)) score += 45;
        }
        tokens.forEach((token) => {
          if (token.length < 3) return;
          if (nq.includes(token)) score += 6;
        });
        return score;
      };

      const scored = qaPairs
        .map((item) => ({ item, score: scoreItem(item) }))
        .filter((entry) => entry.score >= 10)
        .sort((a, b) => b.score - a.score);

      if (scored.length) {
        const top = scored[0];
        const second = scored[1];
        const ambiguousWeak =
          second &&
          second.score >= top.score * 0.9 &&
          top.score < 22;

        if (!ambiguousWeak) {
        const mode = detectMode();

        const trimAnswer = (text, maxSents = 7) => {
          const parts = String(text)
            .replace(/\s+/g, " ")
            .trim()
            .match(/[^.!?]+[.!?]+|[^.!?]+$/g);
          const sents = (parts || []).map((s) => s.trim()).filter(Boolean);
          if (sents.length <= maxSents) return String(text).trim();
          return sents.slice(0, maxSents).join(" ").trim();
        };

        const intros = {
          recruiter: [
            "Sure — practical answer, no HR theatre.",
            "Alright — here’s the straight answer.",
            "Let’s keep it concrete.",
            "No fluff — here’s what matters.",
            "If I’m being direct: ",
          ],
          designer: [
            "Yep. Here’s the real version, not the Dribbble one.",
            "Design-nerd mode on for a sec.",
            "Ok, here’s what actually matters.",
            "Let’s talk craft and trade-offs for a second.",
            "The short version (with the important bits):",
          ],
          exec: [
            "If we care about outcomes, here’s how I’d frame it.",
            "Here’s the business version.",
            "Bluntly: this is what moves the needle.",
            "If we zoom out: outcomes first, then tactics.",
            "Bottom line:",
          ],
          general: [
            "Alright — here’s the honest answer.",
            "Honestly?",
            "Quick but real:",
            "Here’s the thing:",
            "Let me put it this way:",
          ],
        };
        const outros = {
          recruiter:
            "If you share level, location, and product domain, I can tailor examples to what your team cares about.",
          designer:
            "What kind of product are you working on — mobile-first, B2B, consumer — so I can tailor the details?",
          exec:
            "What metric are you actually trying to move — conversion, retention, efficiency — so we optimize the right thing?",
          general:
            "Say if you want to go deeper on a specific project, process, or metric.",
        };

        const suggestionsByMode = {
          recruiter: [
            "What are your salary expectations?",
            "How soon can you start?",
            "Do you need visa sponsorship?",
          ],
          designer: [
            "What’s your design system experience?",
            "How do you hand off to developers?",
            "What tools do you use daily?",
          ],
          exec: [
            "What impact have you driven?",
            "How do you prioritize work?",
            "Show me a project with metrics",
          ],
          general: [
            "Can you give me a specific example?",
            "How does that show up in your work?",
            "Show me a project that proves this.",
          ],
        };

        const body = trimAnswer(top.item.answer, 7);
        const strongMatch = top.score >= 38;
        const introPool = (intros[mode] || intros.general || []).filter(Boolean);
        const options = introPool.filter((item) => item !== lastIntroUsed);
        const pickFrom = options.length ? options : introPool;
        const intro = strongMatch
          ? ""
          : pickFrom[Math.floor(Math.random() * pickFrom.length)] || pickFrom[0] || "";
        if (!strongMatch) lastIntroUsed = intro || lastIntroUsed;
        const outro = strongMatch ? "" : outros[mode];
        const text = [intro, body, outro].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

        return {
          text,
          plainText: true,
          projects:
            turnCount >= 3 && (wantsProjects || workAdjacent)
              ? pickContextProjects().slice(0, 2)
              : [],
          suggestions: suggestionsByMode[mode] || suggestionsByMode.general,
        };
        }
      }
    }

    return {
      text:
        "I’m wired to answer from Jaime’s portfolio and FAQ—not a general-purpose model like ChatGPT—so that was too fuzzy for me to answer safely. Try naming a project (Adidas Click, Sabadell, BeeData, Shell, Wivai, MotoGP, Rio Tinto), a topic (design systems, mobile, metrics), or open the Work page for full case studies.",
      allowShort: true,
      plainText: true,
      projects: [],
      suggestions: [
        "Tell me about Adidas Click",
        "Design systems experience",
        "Show me your work",
      ],
    };
  };

  const addMessage = (role, text, opts = {}) => {
    const row = document.createElement("div");
    row.className = `chat-row ${role}`;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    const bubbleText = document.createElement("div");
    bubbleText.className = "chat-bubble-text";
    bubble.appendChild(bubbleText);
    row.appendChild(bubble);

    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const renderRichText = (raw, { partial = false } = {}) => {
      const lines = String(raw || "")
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((l) => l.trimEnd());

      const out = [];
      let list = [];

      const flushList = () => {
        if (!list.length) return;
        out.push(`<ul>${list.join("")}</ul>`);
        list = [];
      };

      const formatInline = (line) => {
        // Escape first, then allow **bold** markup.
        const escaped = escapeHtml(line);
        const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        return partial ? withBold.replace(/\*\*/g, "") : withBold;
      };

      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (/^-\s+/.test(trimmed)) {
          const item = trimmed.replace(/^-\s+/, "");
          list.push(`<li>${formatInline(item)}</li>`);
          return;
        }
        if (/^[*•]\s+/.test(trimmed)) {
          const item = trimmed.replace(/^[*•]\s+/, "");
          list.push(`<li>${formatInline(item)}</li>`);
          return;
        }
        flushList();
        out.push(`<p>${formatInline(trimmed)}</p>`);
      });

      flushList();
      return out.join("");
    };

    const typeText = (fullText) => {
      const maxChars = 2000;
      const content = fullText.length > maxChars ? fullText.slice(0, maxChars) : fullText;
      if (role !== "assistant") {
        bubbleText.textContent = content;
        bubble.dataset.typingComplete = "true";
        return;
      }
      if (opts.instant) {
        const raw = String(fullText || "").trim();
        bubbleText.innerHTML = renderRichText(raw);
        bubble.dataset.typingComplete = "true";
        requestAnimationFrame(() => {
          bubble.dispatchEvent(
            new CustomEvent("typing-complete", { bubbles: true })
          );
        });
        return;
      }
      // Human-ish typing indicator + small "thinking" pause.
      bubbleText.innerHTML = `
        <div class="typing-indicator" aria-hidden="true">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      `;
      let index = 0;
      const words = content.trim() ? content.trim().split(/\s+/).length : 0;
      const thinkDelay = 120 + Math.min(words * 6, 360);
      const baseDelay = 16;
      const startTyping = () => {
        bubbleText.textContent = "";
        index = 0;
        step();
      };
      const step = () => {
        if (index <= content.length) {
          bubbleText.innerHTML = renderRichText(content.slice(0, index), { partial: true });
          index += 2; // slightly faster than 1-by-1
          // Keep view pinned to the latest message while typing
          const scroller = document.scrollingElement || document.documentElement;
          window.scrollTo({
            top: scroller.scrollHeight,
            behavior: "smooth",
          });
          setTimeout(step, baseDelay);
        } else {
          // Render structured/bold formatting after typing completes.
          bubbleText.innerHTML = renderRichText(content);
          bubble.dataset.typingComplete = "true";
          bubble.dispatchEvent(
            new CustomEvent("typing-complete", { bubbles: true })
          );
        }
      };
      setTimeout(startTyping, thinkDelay);
    };

    typeText(text);

    thread.appendChild(row);
    requestAnimationFrame(() => {
      row.classList.add("is-visible");
    });
    return bubble;
  };

  const addProjectCards = (parent, cards = []) => {
    if (!cards.length) return null;
    const grid = document.createElement("div");
    grid.className = "chat-cards";
    cards.forEach((card) => {
      if (!card) return;
      const cardEl = document.createElement("a");
      cardEl.className = "chat-card";
      cardEl.href = card.url;
      cardEl.innerHTML = `
        <div class="chat-card-image">
          <img src="${card.image}" alt="${card.title}" onerror="this.parentElement.classList.add('is-missing');this.remove();" />
          <div class="chat-card-fallback">${card.title}</div>
        </div>
        <div class="chat-card-body">
          <div class="chat-card-tags">
            <span>${card.tag}</span>
            <span class="metric">${card.metric}</span>
          </div>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
        </div>
      `;
      grid.appendChild(cardEl);
    });
    parent.appendChild(grid);
    markCardsShown(cards);
    return grid;
  };

  const addProjectCardsSequenced = (parent, cards = []) => {
    if (!cards.length) return;
    const slot = document.createElement("div");
    slot.className = "chat-cards is-pending";
    parent.appendChild(slot);

    const reveal = () => {
      // Fill and reveal after typing is done.
      slot.innerHTML = "";
      slot.classList.remove("is-pending");
      cards.forEach((card) => {
        if (!card) return;
        const cardEl = document.createElement("a");
        cardEl.className = "chat-card";
        cardEl.href = card.url;
        cardEl.innerHTML = `
          <div class="chat-card-image">
            <img src="${card.image}" alt="${card.title}" onerror="this.parentElement.classList.add('is-missing');this.remove();" />
            <div class="chat-card-fallback">${card.title}</div>
          </div>
          <div class="chat-card-body">
            <div class="chat-card-tags">
              <span>${card.tag}</span>
              <span class="metric">${card.metric}</span>
            </div>
            <h3>${card.title}</h3>
            <p>${card.description}</p>
          </div>
        `;
        slot.appendChild(cardEl);
      });
      markCardsShown(cards);

      // Scroll after cards are in DOM (reduces "broken" scroll feeling).
      requestAnimationFrame(() => {
        const scroller = document.scrollingElement || document.documentElement;
        window.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      });

      parent.removeEventListener("typing-complete", reveal);
    };

    parent.addEventListener("typing-complete", reveal);
    if (parent.dataset.typingComplete === "true") {
      reveal();
    }
  };

  const getClickedSuggestions = () => {
    const stored = localStorage.getItem(CLICKED_SUGGESTIONS_KEY);
    if (!stored) return new Set();
    try {
      return new Set(JSON.parse(stored));
    } catch (error) {
      return new Set();
    }
  };

  const persistClickedSuggestions = (set) => {
    localStorage.setItem(CLICKED_SUGGESTIONS_KEY, JSON.stringify([...set]));
  };

  const markSuggestionClicked = (label) => {
    const clicked = getClickedSuggestions();
    clicked.add(label.toLowerCase());
    persistClickedSuggestions(clicked);
  };

  const addSuggestions = (parent, suggestions = []) => {
    if (!suggestions.length) return;
    const clicked = getClickedSuggestions();
    const filtered = suggestions.filter(
      (item) => !clicked.has(item.toLowerCase())
    );
    if (!filtered.length) return;
    const wrap = document.createElement("div");
    wrap.className = "chat-suggestions is-pending";
    filtered.slice(0, 3).forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "chat-suggestion";
      button.textContent = item;
      button.addEventListener("click", () => {
        markSuggestionClicked(item);
        void handleQuery(item);
      });
      wrap.appendChild(button);
    });

    const reveal = () => {
      wrap.classList.remove("is-pending");
      parent.removeEventListener("typing-complete", reveal);
    };

    parent.addEventListener("typing-complete", reveal);
    // If typing already finished before we attached the listener, reveal immediately.
    if (parent.dataset.typingComplete === "true") {
      reveal();
    }

    parent.appendChild(wrap);
  };

  const persistHistory = () => {
    const state = thread.innerHTML;
    localStorage.setItem("jaime-chat-history", state);
    localStorage.setItem("jaime-chat-started", "true");
    localStorage.setItem("jaime-chat-version", STORAGE_VERSION);
  };

  const clearHistory = () => {
    localStorage.removeItem("jaime-chat-history");
    localStorage.removeItem("jaime-chat-started");
    localStorage.removeItem("jaime-chat-version");
    localStorage.removeItem(PROJECT_STORAGE_KEY);
    localStorage.removeItem(CLICKED_SUGGESTIONS_KEY);
    localStorage.removeItem(PENDING_CARDS_KEY);
    localStorage.removeItem(SHOWN_CARDS_KEY);
    llmMessages = [];
  };

  const restoreHistory = () => {
    const state = localStorage.getItem("jaime-chat-history");
    const started = localStorage.getItem("jaime-chat-started") === "true";
    const version = localStorage.getItem("jaime-chat-version");
    if (state && started && version === STORAGE_VERSION) {
      llmMessages = [];
      thread.innerHTML = state;
      body.classList.add("chat-started");
      thread.querySelectorAll(".chat-suggestion").forEach((button) => {
        button.addEventListener("click", () => {
          void handleQuery(button.textContent || "");
        });
      });
      rehydrateShownCardsFromDOM();
    } else if (version && version !== STORAGE_VERSION) {
      clearHistory();
    }
  };

  const splitSentencesGlobal = (text) => {
    const parts = String(text)
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    return (parts || []).map((s) => s.trim()).filter(Boolean);
  };

  const emphasizeImportant = (text) => {
    let t = String(text || "");
    // Bold key numeric patterns.
    t = t.replace(
      /\b(\d+(?:\.\d+)?%|\d+(?:\.\d+)?M\+|\d+\+)\b/g,
      "**$1**"
    );
    // Bold metric-ish numbers when followed by common KPI units/words (e.g., "8 POCs", "15 markets").
    t = t.replace(
      /\b(\d+(?:\.\d+)?)(?=\s*(users?|transactions?|markets?|modules?|teams?|components?|patterns?|pocs?|visits?|sessions?|bookings?|days?|weeks?|months?|countries?|languages?|rating|nps|kwh|lift|growth|conversion|revenue|efficiency|adoption)\b)/gi,
      "**$1**"
    );
    // Bold known project/system names (light-touch).
    const highlights = [
      "Adidas Click",
      "Banco Sabadell",
      "BeeData",
      "Shell",
      "Wivai",
      "MotoGP",
      "Rio Tinto",
      "Galatea",
      "Click design system",
      "design system",
      "mobile app",
    ];
    highlights.forEach((phrase) => {
      const re = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      t = t.replace(re, (m) => `**${m}**`);
    });
    return t;
  };

  const autoStructure = (text) => {
    const raw = String(text || "").trim();
    if (!raw) return raw;
    if (raw.includes("\n- ")) return raw;
    const sentences = splitSentencesGlobal(raw);
    if (sentences.length <= 3) return raw;
    const lead = sentences[0];
    const hook =
      [...sentences].reverse().find((s) => /\?\s*$/.test(s)) ||
      sentences[sentences.length - 1];
    const mid = sentences.slice(1, Math.min(3, sentences.length - 1));
    if (!mid.length) return raw;
    const bullets = mid.map((s) => `- ${s}`).join("\n");
    return `${lead}\n${bullets}\n${hook}`.trim();
  };

  const capBullets = (text, maxBullets = 3) => {
    const lines = String(text || "").split("\n");
    const head = [];
    const bullets = [];
    const tail = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (/^-\s+/.test(trimmed)) {
        bullets.push(trimmed);
      } else if (!head.length) {
        head.push(trimmed);
      } else {
        tail.push(trimmed);
      }
    });

    const usedBullets = bullets.slice(0, maxBullets);
    const usedTail = tail.length ? [tail[tail.length - 1]] : [];
    return [...head, ...usedBullets, ...usedTail].join("\n").trim();
  };

  const clampToSentences = (text, maxSentences = 5) => {
    const sentences = splitSentencesGlobal(text);
    if (sentences.length <= maxSentences) return String(text || "").trim();
    const clamped = sentences.slice(0, maxSentences);
    const lastHasQuestion = /\?\s*$/.test(clamped[clamped.length - 1] || "");
    if (!lastHasQuestion) {
      const hook = [...sentences].reverse().find((s) => /\?\s*$/.test(s));
      if (hook) clamped[clamped.length - 1] = hook;
    }
    return clamped.join(" ").trim();
  };

  const varyOpening = (text) => {
    const trimmed = String(text || "").trim();
    if (!trimmed) return trimmed;
    const firstWord = (trimmed.split(/\s+/)[0] || "").toLowerCase();
    const OPENERS = [
      "Quick one —",
      "Alright —",
      "Honestly —",
      "Here’s the thing —",
      "Real talk —",
      "Short version —",
    ];
    const startsWithOpener = OPENERS.some((o) =>
      trimmed.toLowerCase().startsWith(o.toLowerCase().replace(/\s+—$/, ""))
    );
    if (startsWithOpener) {
      lastAssistantFirstWord = firstWord || lastAssistantFirstWord;
      return trimmed;
    }
    if (firstWord && firstWord === lastAssistantFirstWord) {
      const pool = OPENERS.filter((o) => o !== lastOpenerUsed);
      const pickFrom = pool.length ? pool : OPENERS;
      const opener = pickFrom[Math.floor(Math.random() * pickFrom.length)];
      lastOpenerUsed = opener;
      lastAssistantFirstWord = (opener.split(/\s+/)[0] || "").toLowerCase();
      return `${opener} ${trimmed}`;
    }
    lastAssistantFirstWord = firstWord || lastAssistantFirstWord;
    return trimmed;
  };

  const normalizeResponseLength = (text, allowShort = false, options = {}) => {
    const base = String(text || "").trim();
    if (options.plain === true) return base;
    const structured = allowShort ? base : autoStructure(base);
    const capped = allowShort
      ? structured
      : structured.includes("\n- ")
        ? capBullets(structured, 3)
        : clampToSentences(structured, 5);
    return emphasizeImportant(varyOpening(capped));
  };

  const handleQuery = async (query) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    chatTurnCount += 1;
    const normalized = normalize(cleaned);
    const isHomepageSuggested =
      normalized === normalize("Tell me about your work") ||
      normalized === normalize("What makes you different?") ||
      normalized === normalize("What's your biggest achievement?");
    const explicitProjectsRequest =
      normalized.includes("show me your work") ||
      normalized.includes("show your work") ||
      normalized.includes("show me work") ||
      normalized.includes("show projects") ||
      normalized.includes("show me projects") ||
      normalized.includes("see your work") ||
      normalized.includes("see projects") ||
      normalized.includes("project cards") ||
      normalized.includes("case study") ||
      normalized.includes("case studies") ||
      /(show|see|view|open|pull up).*(project|case|card|work|adidas|sabadell|beedata|shell|wivai|motogp|rio|tinto)/.test(
        normalized
      );
    const wantsProjects =
      explicitProjectsRequest ||
      normalized.includes("show me your best work") ||
      normalized.includes("tell me about your work") ||
      normalized.includes("about your work") ||
      isHomepageSuggested ||
      normalized.includes("best work") ||
      normalized.includes("portfolio");
    body.classList.add("chat-started");
    addMessage("user", cleaned);

    const chatApiUrl = getChatApiUrl();
    if (chatApiUrl) {
      llmMessages.push({ role: "user", content: cleaned });
      const pendingRow = document.createElement("div");
      pendingRow.className = "chat-row assistant chat-row-pending";
      pendingRow.innerHTML = `
        <div class="chat-bubble assistant">
          <div class="chat-bubble-text" aria-live="polite">
            <div class="typing-indicator" aria-hidden="true">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>`;
      thread.appendChild(pendingRow);
      requestAnimationFrame(() => {
        pendingRow.classList.add("is-visible");
      });
      const scroller = document.scrollingElement || document.documentElement;
      window.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      try {
        const res = await fetch(chatApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: llmMessages }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || res.statusText || "Chat request failed");
        }
        if (!data.text || typeof data.text !== "string") {
          throw new Error("Invalid response from chat API");
        }
        pendingRow.remove();
        llmMessages.push({ role: "assistant", content: data.text });
        if (llmMessages.length > 24) {
          llmMessages.splice(0, llmMessages.length - 24);
        }
        const assistantText = normalizeResponseLength(data.text, true, { plain: true });
        const message = addMessage("assistant", assistantText, { instant: true });
        addProjectCardsSequenced(message, []);
        addSuggestions(message, getLlmFollowUpChips(cleaned));
        lastAssistantMessage = assistantText;
        persistHistory();
        thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
        return;
      } catch {
        pendingRow.remove();
        llmMessages.pop();
      }
    }

    const response = getChatResponse(cleaned, {
      turnCount: chatTurnCount,
      wantsProjects,
      explicitProjectsRequest,
    });

    const offeredCards = Array.isArray(response.projects) ? response.projects.filter(Boolean) : [];
    const assistantText = normalizeResponseLength(response.text, response.allowShort, {
      plain: response.plainText === true,
    });
    const shown = getShownCardUrls();
    const assistantCardsRaw = offeredCards.slice(0, 2);
    const assistantCards = explicitProjectsRequest
      ? assistantCardsRaw
      : assistantCardsRaw.filter((c) => c && c.url && !shown.has(c.url));

    const message = addMessage("assistant", assistantText);
    addProjectCardsSequenced(message, assistantCards);
    const sug = (response.suggestions && response.suggestions.length)
      ? response.suggestions
      : getContextualSuggestions(assistantText);
    addSuggestions(message, sug);
    lastAssistantMessage = assistantText;
    persistHistory();
    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  };

  const submitQuery = async (inputEl) => {
    const query = inputEl.value.trim();
    if (!query) return;
    inputs.forEach((field) => {
      field.value = "";
    });
    searchBars.forEach((bar) => {
      bar.classList.remove("has-text");
    });
    await handleQuery(query);
  };

  const fitQuickChips = () => {
    if (!quickRow) return;
    const styles = getComputedStyle(quickRow);
    // If the row is allowed to wrap (e.g., homepage), don't hide chips.
    if (styles.flexWrap && styles.flexWrap !== "nowrap") {
      Array.from(quickRow.children).forEach((chip) => {
        chip.style.display = "";
      });
      return;
    }
    const chips = Array.from(quickRow.children);
    chips.forEach((chip) => {
      chip.style.display = "";
    });
    const gapValue = parseFloat(styles.gap || "0");
    let used = 0;
    const max = quickRow.clientWidth;
    chips.forEach((chip) => {
      const width = chip.getBoundingClientRect().width;
      used += width + gapValue;
      if (used > max) {
        chip.style.display = "none";
      }
    });
  };

  inputs.forEach((inputEl) => {
    const bar = inputEl.closest(".search-bar");
    if (!bar) return;
    inputEl.addEventListener("input", () => {
      if (inputEl.value.trim()) {
        bar.classList.add("has-text");
      } else {
        bar.classList.remove("has-text");
      }
    });

    inputEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void submitQuery(inputEl);
      }
    });
  });

  sendButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bar = button.closest(".search-bar");
      const inputEl = bar ? bar.querySelector("input") : null;
      if (inputEl) {
        void submitQuery(inputEl);
      }
    });
  });

  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.textContent || "";
      markSuggestionClicked(label);
      void handleQuery(label);
    });
  });

  logoLinks.forEach((link) => {
    link.addEventListener("click", () => {
      clearHistory();
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("reset") === "1") {
    clearHistory();
    urlParams.delete("reset");
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", newUrl);
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      clearHistory();
      body.classList.remove("chat-started");
      thread.innerHTML = "";
    });
  }

  restoreHistory();

  fitQuickChips();
  window.addEventListener("resize", fitQuickChips);

  // Homepage landing sequence: type + reveal in order.
  const runLandingSequence = async () => {
    try {
      if (!body.classList.contains("home")) return;
      if (body.classList.contains("chat-started")) return;
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;

      const hi = document.querySelector(".hero-hi");
      const headline = document.querySelector(".headline");
      const inputShell = document.querySelector(".chat-input-shell");
      const pillsWrap = document.querySelector(".chat-landing");
      const pills = Array.from(document.querySelectorAll(".chat-quick .quick-chip"));
      if (!hi || !headline || !inputShell || !pillsWrap) return;

      const headlineText = headline.textContent ? headline.textContent.trim() : "";
      const hiText = hi.textContent ? hi.textContent.trim() : "Welcome";

      // Prep: hide input + pills, keep layout stable for headline.
      inputShell.classList.add("landing-hidden");
      pillsWrap.classList.add("landing-hidden");
      pills.forEach((p) => p.classList.add("landing-hidden"));

      const headlineHeight = headline.getBoundingClientRect().height;
      headline.style.minHeight = `${Math.max(56, Math.round(headlineHeight))}px`;

      // Clear text before typing.
      hi.textContent = "";
      headline.textContent = "";

      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const typeInto = async (el, text, { delay = 32, step = 1 } = {}) => {
        let i = 0;
        while (i <= text.length) {
          el.textContent = text.slice(0, i);
          i += step;
          await sleep(delay);
        }
      };

      // 1) Welcome
      await typeInto(hi, hiText, { delay: 38, step: 1 });
      await sleep(180);

      // 2) Headline
      await typeInto(headline, headlineText, { delay: 18, step: 1 });
      headline.style.minHeight = "";
      await sleep(220);

      // 3) Input
      inputShell.classList.remove("landing-hidden");
      await sleep(240);

      // 4) Pills
      pillsWrap.classList.remove("landing-hidden");
      pills.forEach((p, idx) => {
        setTimeout(() => p.classList.remove("landing-hidden"), 70 * idx);
      });
    } catch (e) {
      // If anything fails, keep homepage usable.
    }
  };

  runLandingSequence();
})();
