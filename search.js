(() => {
  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const searchData = window.PORTFOLIO_INDEX || [];
  const projects = window.PORTFOLIO_PROJECTS || {};
  const profile = window.JAIME_PROFILE || {};
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

  if (!inputs.length || !thread) return;

  const KEYWORDS = [
    {
      keys: ["adidas", "click", "wholesale", "b2b", "e-commerce", "ecommerce"],
      project: "adidas",
      response:
        "Adidas Click was a global B2B platform. I led the wholesale mobile app from research to launch across 15+ markets and co-created the Click design system. The impact was real: 60% faster design-to-dev and 40% faster reordering through scanning.",
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
        "Banco Sabadell was a full digital banking transformation. I built the Galatea system from scratch and it drove a 35% mobile conversion lift and 45% growth in private banking leads.",
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
        "BeeData was about making AI-driven analytics usable for non-technical teams. We grew subscriptions by 20-30%, improved NPS from 32 to 58, and cut onboarding from 3 weeks to 3 days.",
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
        "For Shell, I designed a global app experience that unified EV charging, carwash, fuel, payments, and loyalty. The focus was on scalable patterns that worked across regions.",
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
        "Wivai was CaixaBank's entry into retail e-commerce. I built the brand and mobile-first experience, and it reached 233.4K monthly visits with a 33.6% bounce rate reduction.",
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
        "MotoGP needed a visual refresh and new feature concepts. I led the visual direction, created a dark-mode-first system, and designed 8 feature POCs for a 60% mobile audience.",
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
        "Rio Tinto was a global HR platform where I designed a universal core with regional modules. It cut routine HR work by 30% and sped up feature delivery by 60%.",
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
        "Design systems are a core strength. I built Galatea for Sabadell and co-created Click for Adidas. Both reduced build time and scaled teams without losing consistency.",
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
        "Mobile-first is non-negotiable for me. I led the Adidas wholesale app and applied the same approach to banking and e-commerce so users can move faster on mobile.",
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
        "I focus on measurable outcomes: 35% mobile conversion lift at Sabadell, 20-30% subscription growth at BeeData, and 30% efficiency gains at Rio Tinto.",
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
        "I am a Product Design Lead at AILY Labs in Madrid. I build design systems, lead mobile-first work, and focus on business outcomes for global brands.",
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
        "I am AI-native in two ways: I design AI products at AILY Labs and I use AI tools like Claude, ChatGPT, and Midjourney daily to move faster without losing craft.",
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
        "I build systems, not just screens. I have built two design systems from scratch, I am mobile-first by default, and I lead with measurable business impact like 60% faster teams and 35% conversion lifts.",
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

  const getChatResponse = (query) => {
    const normalized = normalize(query);
    const match = KEYWORDS.find((entry) =>
      entry.keys.some((key) => normalized.includes(normalize(key)))
    );

    if (match) {
      if (match.project) {
        localStorage.setItem(PROJECT_STORAGE_KEY, match.project);
      }
      return {
        text: match.response,
        projects: match.project ? [projects[match.project]] : [],
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
        return {
          text: detail,
          projects: [projects[activeProject]].filter(Boolean),
          suggestions: [
            "What was the impact?",
            "What was the challenge?",
            "What did you do?",
          ],
        };
      }
    }

    const fallback = searchData[0];
    return {
      text:
        "I can help you explore projects, impact, or design systems. Try Adidas, Sabadell, BeeData, Wivai, MotoGP, Rio Tinto, or Shell.",
      projects: fallback ? [projects.adidas, projects.sabadell].filter(Boolean) : [],
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

    const avatar = document.createElement("div");
    avatar.className = `chat-avatar ${role}`;
    avatar.textContent = role === "user" ? "You" : "JM";

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role}`;
    bubble.textContent = text;

    if (role === "user") {
      row.appendChild(bubble);
      row.appendChild(avatar);
    } else {
      row.appendChild(avatar);
      row.appendChild(bubble);
    }

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
    wrap.className = "chat-suggestions";
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

  const normalizeResponseLength = (text) => {
    const minLength = 140;
    if (text.length >= minLength) return text;
    return `${text} Want more detail on impact or decisions? Ask me to go deeper.`;
  };

  const handleQuery = (query) => {
    const cleaned = query.trim();
    if (!cleaned) return;
    body.classList.add("chat-started");
    addMessage("user", cleaned);
    const response = getChatResponse(cleaned);
    const message = addMessage("assistant", normalizeResponseLength(response.text));
    addProjectCards(message, response.projects);
    addSuggestions(message, response.suggestions);
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
    const chips = Array.from(quickRow.children);
    chips.forEach((chip) => {
      chip.style.display = "";
    });
    const gapValue = parseFloat(getComputedStyle(quickRow).gap || "0");
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
