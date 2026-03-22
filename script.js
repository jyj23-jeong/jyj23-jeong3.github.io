"use strict";

// ── AI Products Data ──────────────────────────────────────────────────────────
// Each entry represents a new AI product or service launched this week.
const products = [
  {
    name: "Gemini 2.5 Pro",
    maker: "Google DeepMind",
    icon: "✨",
    category: "LLM / Foundation Model",
    description:
      "Google's most capable multimodal model yet, featuring a 1M-token context window, state-of-the-art reasoning, and native code execution. Optimised for complex agentic tasks.",
    highlights: [
      "1 million token context window",
      "Top scores on MMLU, HumanEval, and GPQA",
      "Built-in code interpreter and tool use",
    ],
    pricing: "API preview – pay-per-token",
    url: "https://deepmind.google/technologies/gemini/",
  },
  {
    name: "Claude 3.7 Sonnet",
    maker: "Anthropic",
    icon: "🧠",
    category: "LLM / Foundation Model",
    description:
      "Anthropic's smartest and most responsive model. Introduces hybrid reasoning mode that can switch between instant responses and extended chain-of-thought thinking on demand.",
    highlights: [
      "Hybrid fast + deep reasoning modes",
      "Best-in-class instruction following",
      "200K token context, vision support",
    ],
    pricing: "From $3 / 1M input tokens",
    url: "https://www.anthropic.com/claude",
  },
  {
    name: "Sora Turbo",
    maker: "OpenAI",
    icon: "🎬",
    category: "Generative Video",
    description:
      "A faster and more accessible version of OpenAI's video generation model. Produce cinematic clips up to 2 minutes from a text prompt, with improved motion coherence and style control.",
    highlights: [
      "Up to 2-minute 1080p video generation",
      "Style presets and storyboard editor",
      "3× faster than the original Sora",
    ],
    pricing: "ChatGPT Plus ($20/mo) and above",
    url: "https://openai.com/sora",
  },
  {
    name: "Runway Gen-4",
    maker: "Runway",
    icon: "🎥",
    category: "Generative Video",
    description:
      "Fourth-generation video AI from Runway with consistent character identity across scenes, precise camera control, and real-time collaboration tools for creative teams.",
    highlights: [
      "Consistent characters across shots",
      "Director-mode camera controls",
      "Team workspace with version history",
    ],
    pricing: "Free tier available; Pro from $15/mo",
    url: "https://runwayml.com",
  },
  {
    name: "Lovable 2.0",
    maker: "Lovable",
    icon: "💜",
    category: "AI Development Tool",
    description:
      "Full-stack AI software engineer that ships production-ready web apps from a natural-language brief. Version 2 adds backend generation, database wiring, and one-click deployment.",
    highlights: [
      "Frontend + backend generation from prompts",
      "Supabase and Postgres integration",
      "Deploy to custom domains in one click",
    ],
    pricing: "Free hobby plan; Pro from $25/mo",
    url: "https://lovable.dev",
  },
  {
    name: "Cursor 1.0",
    maker: "Anysphere",
    icon: "⚡",
    category: "AI Development Tool",
    description:
      "The AI-first code editor hits v1.0 with Background Agents—autonomous coding workers that run in the cloud while you sleep, tackling multi-file refactors and bug fixes.",
    highlights: [
      "Background Agents for async coding tasks",
      "Multi-file context awareness",
      "Inline AI chat with repo-wide search",
    ],
    pricing: "Free tier; Pro $20/mo",
    url: "https://www.cursor.com",
  },
  {
    name: "ElevenLabs Studio",
    maker: "ElevenLabs",
    icon: "🎙️",
    category: "Voice & Audio AI",
    description:
      "End-to-end AI audio production suite. Clone your voice in 30 seconds, generate multilingual dubbing for videos, and produce podcast-quality narration with emotion controls.",
    highlights: [
      "30-second voice cloning",
      "One-click multilingual video dubbing",
      "Emotion, pacing, and style controls",
    ],
    pricing: "Starter from $5/mo; Creator $22/mo",
    url: "https://elevenlabs.io",
  },
  {
    name: "Hume EVI 2",
    maker: "Hume AI",
    icon: "🗣️",
    category: "Voice & Audio AI",
    description:
      "Empathic Voice Interface 2 reads vocal cues to detect emotions in real time and adjusts its responses for more natural, emotionally intelligent conversations.",
    highlights: [
      "Real-time emotion detection from voice",
      "Context-aware empathic responses",
      "Sub-500ms voice-to-voice latency",
    ],
    pricing: "API – usage-based pricing",
    url: "https://www.hume.ai",
  },
  {
    name: "Perplexity Assistant",
    maker: "Perplexity AI",
    icon: "🔍",
    category: "AI Agent / Assistant",
    description:
      "A proactive personal AI that goes beyond search—books restaurants, manages calendar events, orders groceries, and sends emails on your behalf with real-time web access.",
    highlights: [
      "Agentic web browsing and actions",
      "Calendar, email, and shopping integrations",
      "Always-on background monitoring",
    ],
    pricing: "Perplexity Pro ($20/mo)",
    url: "https://www.perplexity.ai",
  },
  {
    name: "Manus",
    maker: "Monica",
    icon: "🤝",
    category: "AI Agent / Assistant",
    description:
      "China's viral general-purpose AI agent that autonomously executes multi-step tasks: researching topics, writing reports, building spreadsheets, and browsing the web—hands-free.",
    highlights: [
      "Fully autonomous multi-step task execution",
      "Built-in browser, code runner, and file tools",
      "Parallel sub-agent coordination",
    ],
    pricing: "Early access – invite only",
    url: "https://manus.im",
  },
  {
    name: "Ideogram 3.0",
    maker: "Ideogram",
    icon: "🖼️",
    category: "Image Generation",
    description:
      "Ideogram's most photorealistic model adds Magic Fill for context-aware object insertion, improved prompt adherence, and legible text rendering inside generated images.",
    highlights: [
      "Best-in-class text rendering in images",
      "Magic Fill for seamless inpainting",
      "Style references and batch generation",
    ],
    pricing: "Free 10 images/day; Plus from $8/mo",
    url: "https://ideogram.ai",
  },
  {
    name: "Recraft V3",
    maker: "Recraft",
    icon: "🎨",
    category: "Image Generation",
    description:
      "Vector-first AI design tool that generates scalable SVG illustrations, brand-consistent icons, and UI assets. V3 adds brand kit locking so outputs always match your visual identity.",
    highlights: [
      "Native SVG / vector output",
      "Brand kit locking for consistency",
      "Batch icon and illustration generation",
    ],
    pricing: "Free plan; Pro $12/mo",
    url: "https://www.recraft.ai",
  },
  {
    name: "NotebookLM Plus",
    maker: "Google",
    icon: "📓",
    category: "Productivity",
    description:
      "The upgraded NotebookLM tier unlocks unlimited notebooks, collaborative editing, audio overviews, and direct Google Drive sync—turning any document set into a private AI research assistant.",
    highlights: [
      "Unlimited notebooks & sources",
      "Audio Overview podcast generation",
      "Team collaboration with shared notebooks",
    ],
    pricing: "Google One AI Premium ($19.99/mo)",
    url: "https://notebooklm.google.com",
  },
  {
    name: "Granola v2",
    maker: "Granola",
    icon: "📝",
    category: "Productivity",
    description:
      "AI notepad that listens to your meetings and enriches your rough notes with context, action items, and summaries—without requiring a bot in the call.",
    highlights: [
      "No meeting bot required",
      "Merges your notes with AI transcription",
      "CRM and Notion push integration",
    ],
    pricing: "Free 25 meetings; Pro $18/mo",
    url: "https://www.granola.ai",
  },
  {
    name: "Harvey AI",
    maker: "Harvey",
    icon: "⚖️",
    category: "Vertical AI",
    description:
      "Purpose-built legal AI now covering contract drafting, due-diligence review, litigation research, and regulatory monitoring—trained on jurisdiction-specific legal corpora.",
    highlights: [
      "Jurisdiction-specific legal training data",
      "Full contract lifecycle management",
      "Source citations with case law links",
    ],
    pricing: "Enterprise – contact sales",
    url: "https://www.harvey.ai",
  },
  {
    name: "Evo 2",
    maker: "Arc Institute × NVIDIA",
    icon: "🧬",
    category: "Vertical AI",
    description:
      "A 40-billion-parameter genomics foundation model that designs novel DNA sequences, predicts gene function, and accelerates drug discovery at unprecedented scale.",
    highlights: [
      "40B parameters trained on 9.3T DNA tokens",
      "De novo DNA and protein sequence design",
      "Open-weights for academic research",
    ],
    pricing: "Open-weights (Apache 2.0)",
    url: "https://arcinstitute.org/tools/evo",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `Week of ${fmt(monday)} – ${fmt(sunday)}`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function externalLinkIcon() {
  return `<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M10.604 1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 3.927 8.354 8.604a.75.75 0 1 1-1.06-1.06l4.676-4.677L9.927 1.427A.25.25 0 0 1 10.104 1z"/>
    <path d="M1 5.75C1 4.784 1.784 4 2.75 4h5a.75.75 0 0 1 0 1.5h-5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-5a.75.75 0 0 1 1.5 0v5A1.75 1.75 0 0 1 10.25 15h-7.5A1.75 1.75 0 0 1 1 13.25z"/>
  </svg>`;
}

function buildCard(product, index) {
  const highlights = product.highlights
    .map((h) => `<li>${escapeHtml(h)}</li>`)
    .join("");

  return `
    <article class="product-card" data-category="${escapeHtml(product.category)}"
             style="animation-delay:${index * 0.04}s">
      <div class="card-header">
        <div class="card-icon" aria-hidden="true">${product.icon}</div>
        <div class="card-title-group">
          <div class="card-name">${escapeHtml(product.name)}</div>
          <div class="card-maker">${escapeHtml(product.maker)}</div>
        </div>
      </div>
      <span class="card-badge">${escapeHtml(product.category)}</span>
      <p class="card-description">${escapeHtml(product.description)}</p>
      <ul class="card-highlights">${highlights}</ul>
      <div class="card-pricing">
        <span class="price-tag">${escapeHtml(product.pricing)}</span>
      </div>
      <a class="card-link" href="${escapeHtml(product.url)}" target="_blank" rel="noopener noreferrer">
        Visit product ${externalLinkIcon()}
      </a>
    </article>`;
}

// ── Category Filter ───────────────────────────────────────────────────────────

function buildFilterButtons() {
  const categories = [...new Set(products.map((p) => p.category))];
  const container = document.getElementById("filterButtons");

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = cat;
    btn.textContent = cat;
    container.appendChild(btn);
  });

  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterCards(btn.dataset.category);
  });
}

function filterCards(category) {
  const cards = document.querySelectorAll(".product-card");
  let visible = 0;
  cards.forEach((card) => {
    const match = category === "all" || card.dataset.category === category;
    card.classList.toggle("hidden", !match);
    if (match) visible++;
  });
  document.getElementById("noResults").classList.toggle("hidden", visible > 0);
}

// ── Initialise ────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  // Set week label
  document.getElementById("weekLabel").textContent = getWeekRange();

  // Render cards
  const grid = document.getElementById("productGrid");
  grid.innerHTML = products.map((p, i) => buildCard(p, i)).join("");

  // Build filter buttons
  buildFilterButtons();
});
