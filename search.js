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
  const STORAGE_VERSION = "3";
  const PROJECT_STORAGE_KEY = "jaime-chat-project";
  const CLICKED_SUGGESTIONS_KEY = "jaime-chat-clicked-suggestions";
  const PENDING_CARDS_KEY = "jaime-chat-pending-cards";

  // Lightweight conversational state (not persisted across sessions)
  let chatTurnCount = 0;
  let lastIntroUsed = "";
  let lastAssistantMessage = "";

  if (!inputs.length || !thread) return;

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
      keys: ["adidas", "click", "wholesale", "b2b", "e-commerce", "ecommerce"],
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
      keys: ["beedata", "saas", "subscription", "data", "analytics", "ai"],
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
      keys: ["rio", "tinto", "hr", "safety", "enterprise", "workflow"],
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
      keys: ["design system", "system", "components", "tokens"],
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
      keys: ["mobile", "mobile-first", "app"],
      project: "adidas",
      response:
        "Mobile-first is pretty much non-negotiable for me at this point. I led the Adidas wholesale app, where floor staff literally work from their phones while juggling stock and customers. The same mindset carried over into banking and e-commerce work, where I pushed for layouts, interactions, and flows that assume people are on small screens, half-distracted, and probably on the move. That means things like one-handed navigation, progressive disclosure, and trimming any step that does not earn its keep. When you do that well, conversion and task completion almost automatically improve. Are you looking at a mobile-heavy product yourself, or just curious how I approach it?",
      suggestions: [
        "How did you lead the Adidas app?",
        "What mobile-first decisions mattered?",
        "Show mobile results",
      ],
    },
    {
      keys: ["impact", "metrics", "results", "growth", "conversion"],
      project: "beedata",
      response:
        "I tend to start with metrics rather than wireframes, because pretty UI without results is just decoration. On recent projects that has meant things like a 35% lift in mobile conversion at Sabadell, 20–30% subscription growth at BeeData, and around 30% efficiency gains at Rio Tinto. Those numbers came from a mix of better flows, clearer communication, and design systems that removed friction for teams. It is not about chasing vanity KPIs, it is about making sure design work shows up in the business dashboard. That mindset also keeps conversations with stakeholders very grounded. What kind of outcomes matter most in your context – growth, conversion, efficiency, or something else?",
      suggestions: [
        "Show the Sabadell impact",
        "How did BeeData grow?",
        "What improved efficiency at Rio Tinto?",
      ],
    },
    {
      keys: ["about", "background", "bio", "jaime", "who"],
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
      keys: ["ai", "aily", "claude", "chatgpt", "midjourney"],
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
    const queryTokens = normalized.split(/\s+/).filter(Boolean);
    const workAdjacent =
      /(work|project|projects|portfolio|case study|case studies|achievement|different|impact|metrics|results|design system|system|components|adidas|sabadell|beedata|shell|wivai|motogp|rio tinto|riotinto)/.test(
        normalized
      );
    const pickContextProjects = () => {
      const active = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (active && projects[active]) return [projects[active]].filter(Boolean);
      if (/(design system|system|components|tokens)/.test(normalized)) {
        return [projects.sabadell, projects.adidas].filter(Boolean);
      }
      if (/(b2b|saas|enterprise)/.test(normalized)) {
        return [projects.adidas, projects.beedata || projects.riotinto]
          .filter(Boolean)
          .slice(0, 2);
      }
      if (/(mobile|app)/.test(normalized)) {
        return [projects.adidas, projects.shell].filter(Boolean);
      }
      return [projects.adidas, projects.sabadell].filter(Boolean);
    };
    const showProjectsNow = explicitProjectsRequest
      ? turnCount >= 2
      : wantsProjects && turnCount >= 3;

    const suggestedKey = SUGGESTED_RESPONSE_KEYS[normalized];
    if (suggestedKey) {
      return {
        text: SUGGESTED_RESPONSES[suggestedKey],
        allowShort: true,
        projects: showProjectsNow
          ? [projects.adidas, projects.sabadell].filter(Boolean)
          : [],
        suggestions: [
          "Tell me about Adidas Click",
          "Show me B2B work",
          "What business impact stands out?",
        ],
      };
    }

    const match = KEYWORDS.find((entry) =>
      entry.keys.some((key) => queryTokens.includes(normalize(key)))
    );

    if (match) {
      if (match.project) {
        localStorage.setItem(PROJECT_STORAGE_KEY, match.project);
      }
      // If we're talking about a specific project, start surfacing the card after a couple turns.
      const shouldShowCards = !!match.project && (showProjectsNow || turnCount >= 2);
      return {
        text: match.response,
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
          "Cool — before I throw project links at you like confetti, what kind of work do you actually want to see? Design systems, mobile apps, B2B enterprise, consumer e‑commerce… pick a lane and I’ll point you to the right case study. If you don’t care, I’ll default to the two strongest: Adidas Click and Banco Sabadell.",
        projects: [],
        suggestions: [
          "Design systems",
          "Mobile apps",
          "B2B enterprise",
        ],
      };
    }

    if (showProjectsNow && wantsProjects) {
      return {
        text:
          "Alright, you’ve earned the visuals. Here are two strong starting points that show both craft and real numbers — Adidas Click (global B2B + design system) and Banco Sabadell (banking transformation + Galatea). If you tell me what you care about (systems vs product flows vs pure impact), I can narrow it down even more.",
        projects: [projects.adidas, projects.sabadell].filter(Boolean),
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
        let score = 0;
        tokens.forEach((token) => {
          if (item.normalizedQuestion.includes(token)) score += 2;
          if (item.normalizedAnswer.includes(token)) score += 1;
        });
        return score;
      };

      const scored = qaPairs
        .map((item) => ({ item, score: scoreItem(item) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      if (scored.length) {
        const mode = detectMode();
        const selected = [scored[0]];
        // If the query spans multiple topics, blend in close matches.
        const isMultiTopic =
          normalized.includes(" and ") ||
          normalized.includes(" vs ") ||
          normalized.includes(" / ") ||
          normalized.includes(",");
        if (scored[1] && scored[1].score >= scored[0].score * 0.75) selected.push(scored[1]);
        if (
          isMultiTopic &&
          scored[2] &&
          scored[2].score >= scored[0].score * 0.6
        )
          selected.push(scored[2]);

        const splitSentences = (text) => {
          const parts = String(text)
            .replace(/\s+/g, " ")
            .trim()
            .match(/[^.!?]+[.!?]+|[^.!?]+$/g);
          return (parts || []).map((s) => s.trim()).filter(Boolean);
        };

        const keySentences = [];
        selected.forEach(({ item }, idx) => {
          const sentences = splitSentences(item.answer);
          if (!sentences.length) return;
          // Take 1–2 sentences per answer, capped overall.
          keySentences.push(sentences[0]);
          if (idx === 0 && sentences[1] && keySentences.length < 3) keySentences.push(sentences[1]);
        });

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
            "What’s the role scope and location you’re hiring for, so I can answer in the right context?",
          designer:
            "What kind of product are you working on — mobile-first, B2B, consumer — so I can tailor the details?",
          exec:
            "What metric are you actually trying to move — conversion, retention, efficiency — so we optimize the right thing?",
          general:
            "What’s the context here — are you hiring, looking for inspiration, or trying to solve a specific product problem?",
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

        const body = keySentences.join(" ").trim();
        // Keep answers readable and roughly 4–6 sentences, and vary openings.
        const introPool = (intros[mode] || intros.general || []).filter(Boolean);
        const options = introPool.filter((item) => item !== lastIntroUsed);
        const pickFrom = options.length ? options : introPool;
        const intro =
          pickFrom[Math.floor(Math.random() * pickFrom.length)] ||
          pickFrom[0] ||
          "";
        lastIntroUsed = intro || lastIntroUsed;
        const text = `${intro} ${body} ${outros[mode]}`.replace(/\s+/g, " ").trim();

        return {
          text,
          projects:
            turnCount >= 3 && (wantsProjects || workAdjacent)
              ? pickContextProjects().slice(0, 2)
              : [],
          suggestions: suggestionsByMode[mode] || suggestionsByMode.general,
        };
      }
    }

    return {
      text:
        "I can help you explore projects, impact, or how I work – whatever is most useful for you. There’s work for Adidas, Banco Sabadell, BeeData, Wivai, MotoGP, Rio Tinto, and Shell, plus a couple of design systems that tie everything together. Rather than throwing everything at you at once, I’d rather point you to what actually matches your interests. Are you more into B2B, consumer products, design systems, or something completely different?",
      projects:
        turnCount >= 3 && (wantsProjects || workAdjacent)
          ? pickContextProjects().slice(0, 2)
          : [],
      suggestions: [
        "Show the Adidas work",
        "How did you build Galatea?",
        "What business impact stands out?",
      ],
    };
  };

  const addMessage = (role, text) => {
    const row = document.createElement("div");
    row.className = `chat-row ${role}`;

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    const bubbleText = document.createElement("div");
    bubbleText.className = "chat-bubble-text";
    bubble.appendChild(bubbleText);
    row.appendChild(bubble);

    const typeText = (fullText) => {
      const maxChars = 2000;
      const content = fullText.length > maxChars ? fullText.slice(0, maxChars) : fullText;
      if (role !== "assistant") {
        bubbleText.textContent = content;
        bubble.dataset.typingComplete = "true";
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
          bubbleText.textContent = content.slice(0, index);
          index += 2; // slightly faster than 1-by-1
          // Keep view pinned to the latest message while typing
          const scroller = document.scrollingElement || document.documentElement;
          window.scrollTo({
            top: scroller.scrollHeight,
            behavior: "smooth",
          });
          setTimeout(step, baseDelay);
        } else {
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
    if (!cards.length) return;
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
        handleQuery(item);
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
  };

  const restoreHistory = () => {
    const state = localStorage.getItem("jaime-chat-history");
    const started = localStorage.getItem("jaime-chat-started") === "true";
    const version = localStorage.getItem("jaime-chat-version");
    if (state && started && version === STORAGE_VERSION) {
      thread.innerHTML = state;
      body.classList.add("chat-started");
      thread.querySelectorAll(".chat-suggestion").forEach((button) => {
        button.addEventListener("click", () => {
          handleQuery(button.textContent || "");
        });
      });
    } else if (version && version !== STORAGE_VERSION) {
      clearHistory();
    }
  };

  const normalizeResponseLength = (text, allowShort = false) => {
    if (allowShort) return text;
    const minLength = 140;
    if (text.length >= minLength) return text;
    return `${text} Want more detail on impact or decisions? Ask me to go deeper.`;
  };

  const handleQuery = (query) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    chatTurnCount += 1;
    const normalized = normalize(cleaned);

    // If we previously offered cards, interpret a "yes/no" reply in context.
    const pending = getPendingCards();
    if (pending.length) {
      if (isAffirmative(normalized)) {
        clearPendingCards();
        body.classList.add("chat-started");
        addMessage("user", cleaned);
        const msg = addMessage("assistant", "Cool — here you go.");
        addProjectCards(msg, pending);
        addSuggestions(msg, getContextualSuggestions(lastAssistantMessage));
        persistHistory();
        thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
        return;
      }
      if (isNegative(normalized)) {
        clearPendingCards();
      }
    }
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
      normalized.includes("case studies");
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
    const response = getChatResponse(cleaned, {
      turnCount: chatTurnCount,
      wantsProjects,
      explicitProjectsRequest,
    });

    // Always confirm before showing project cards.
    const offeredCards = Array.isArray(response.projects) ? response.projects.filter(Boolean) : [];
    let assistantText = normalizeResponseLength(response.text, response.allowShort);
    let assistantCards = [];
    if (offeredCards.length) {
      setPendingCards(offeredCards.slice(0, 2));
      assistantText = `${assistantText} Want me to pull up the case study card(s)?`;
      assistantCards = [];
    }

    const message = addMessage("assistant", assistantText);
    addProjectCards(message, assistantCards);
    const sug = (response.suggestions && response.suggestions.length)
      ? response.suggestions
      : getContextualSuggestions(assistantText);
    addSuggestions(message, sug);
    lastAssistantMessage = assistantText;
    persistHistory();
    thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
  };

  const submitQuery = (inputEl) => {
    const query = inputEl.value.trim();
    if (!query) return;
    inputs.forEach((field) => {
      field.value = "";
    });
    searchBars.forEach((bar) => {
      bar.classList.remove("has-text");
    });
    handleQuery(query);
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
        submitQuery(inputEl);
      }
    });
  });

  sendButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const bar = button.closest(".search-bar");
      const inputEl = bar ? bar.querySelector("input") : null;
      if (inputEl) {
        submitQuery(inputEl);
      }
    });
  });

  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.textContent || "";
      markSuggestionClicked(label);
      handleQuery(label);
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
})();
