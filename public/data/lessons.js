// Teaching content. Seeded into MongoDB collection "lessons".
// domain 0 = exam overview; 1-7 = exam domains.

module.exports = [
  {
    domain: 0,
    title: "About the CCAO-F Exam",
    weight: null,
    summary:
      "Claude Certified Associate – Foundations (CCAO-F) is Anthropic's entry-level credential for business users of Claude: people in operations, marketing, project management, HR, education, communications and consulting. You need no coding or API knowledge. It tests whether you can use Claude well and responsibly in real work.",
    sections: [
      {
        heading: "Exam format",
        points: [
          "60 questions in 120 minutes, about 2 minutes per question.",
          "The question types are multiple choice (one answer) and multiple response (the question tells you how many to pick).",
          "Almost every question is a workplace scenario, not a definition. You'll read a situation and pick the best action.",
          "You need a scaled score of 720 on a 100–1000 scale. The score is scaled, so 720 does not mean 72%.",
          "Results come right away: pass/fail, your scaled score, and % correct for each domain.",
          "You can take it online with a proctor or at a Pearson VUE test center. Fee is about US$99.",
          "The credential is valid for 12 months. If you renew on time, renewal is a free, unproctored assessment."
        ]
      },
      {
        heading: "Who it's for and prerequisites",
        points: [
          "There are no required courses or prerequisites.",
          "The recommended background is regular hands-on use of Claude at work.",
          "Technical implementation (API, SDK, agents) belongs to other credentials: Developer (CCDV-F) and Architect (CCAR-F / CCAR-P)."
        ]
      },
      {
        heading: "The 7 domains",
        points: [
          "1. Prompting & Task Execution: 14%",
          "2. Output Evaluation & Validation: 21% (largest)",
          "3. Product & Model Selection: 12%",
          "4. Workflow Integration & Solution Design: 16%",
          "5. Configuration & Knowledge Management: 12%",
          "6. Governance, Risk & Responsible Use: 15%",
          "7. Troubleshooting & Optimization: 10%"
        ]
      },
      {
        heading: "How to think on exam day",
        points: [
          "Domains 2, 4 and 6 make up about half the exam, and they test judgment more than technique.",
          "Many questions have one option that sounds diligent but doesn't actually control the risk. One example is asking Claude \"are you sure?\" instead of checking the primary source. Pick the option that really reduces the risk.",
          "Prefer answers that keep a human accountable, verify against authoritative sources, protect sensitive data, and follow your organization's policy.",
          "Prefer the simplest product or model that does the job well, not always the most powerful one."
        ]
      },
      {
        heading: "Study plan (suggested)",
        points: [
          "Read each domain lesson in this app (Learn tab).",
          "Take a practice quiz for each domain, then read the explanation for every question you miss.",
          "Use the 'Retry my mistakes' mode until you get them right.",
          "Take the full mock exam (60 questions, 120 min timer) and aim for an estimated 80% or higher.",
          "Practice in Claude itself: set up a Project, try Research, compare Haiku, Sonnet and Opus, and build an Artifact."
        ]
      }
    ],
    traps: [],
    sources: [
      "Exam facts come from third-party prep guides citing Anthropic's exam guide v1.0, such as claudecertificationguide.com and findskill.ai. Check the official guide at anthropic.skilljar.com/page/partner-certifications before your exam."
    ]
  },
  {
    domain: 1,
    title: "Prompting & Task Execution",
    weight: 14,
    summary:
      "This domain covers writing prompts that get the job done the first time, splitting big jobs into steps, and iterating well when the first output misses.",
    sections: [
      {
        heading: "Anatomy of a strong prompt",
        points: [
          "Goal: what you want and why. The 'why' helps Claude make good choices.",
          "Context: background, the source material, and who the output is for.",
          "Audience & tone: for example, 'for busy executives, plain language'.",
          "Format: length, structure, bullet vs prose, table, headings.",
          "Constraints: what to include or avoid, the deadline, the reading level.",
          "Examples: one or more samples of the output you want. These are the best way to get a consistent style."
        ]
      },
      {
        heading: "Techniques",
        points: [
          "Be explicit. Claude does what you ask, so ask for exactly what you want.",
          "Say what TO do rather than only what NOT to do. 'Write in flowing paragraphs' works better than 'don't use bullets'.",
          "Use delimiters or XML-style tags such as <document> and </document> to keep pasted material separate from your instructions.",
          "Give Claude a role when expertise matters, for example 'You are an experienced HR policy advisor…'.",
          "For complex reasoning, ask Claude to think step by step, or use extended thinking.",
          "Allow uncertainty: 'If the document doesn't say, tell me you don't know.' This reduces made-up answers.",
          "Break large tasks into a chain: outline → draft section 1 → review → next. Each step gets full attention."
        ]
      },
      {
        heading: "Task types",
        points: [
          "Analysis: provide the data and the criteria, and ask for the reasoning behind conclusions.",
          "Research: define the scope, ask for sources, and verify them.",
          "Drafting: give the audience, purpose, tone and an example.",
          "Brainstorming: ask for many diverse options, hold back judgment at first, then narrow down."
        ]
      },
      {
        heading: "Iterating",
        points: [
          "When the output misses, give specific feedback ('shorten to 150 words, make the CTA clearer'). Re-running the same prompt usually won't fix it.",
          "Build on the good parts and keep the conversation focused."
        ]
      }
    ],
    traps: [
      "'Make it better' is not useful feedback. Be specific.",
      "A longer prompt is not automatically a better one. What matters is clarity and relevant context.",
      "Re-running the same vague prompt and hoping for luck is not iteration."
    ],
    sources: []
  },
  {
    domain: 2,
    title: "Output Evaluation & Validation",
    weight: 21,
    summary:
      "This is the biggest domain. It covers judging whether Claude's output is accurate, complete, unbiased and fit for purpose, and deciding when a human must review it.",
    sections: [
      {
        heading: "What can go wrong",
        points: [
          "Hallucination: confident but wrong facts, made-up citations, statistics, quotes, URLs or legal clauses.",
          "Incompleteness: missing requirements or ignoring part of the request.",
          "Bias: skewed framing, stereotypes, or one-sided analysis.",
          "Outdated information: the model has a training cutoff unless it uses web search or research.",
          "Wrong arithmetic in long calculations done 'in its head'."
        ]
      },
      {
        heading: "Verification techniques",
        points: [
          "Check facts, figures, citations and regulations against the PRIMARY / authoritative source.",
          "For document Q&A, ask Claude to quote the exact passages it relied on, then confirm those passages exist.",
          "Check the output against your original requirements like a checklist.",
          "Use a tool (spreadsheet, calculator, code-based analysis) for important numbers.",
          "Asking Claude to self-critique helps you find weak spots, but it does NOT replace verification.",
          "A confident tone, or the same answer twice in a row, is NOT evidence that it's correct."
        ]
      },
      {
        heading: "When human review is required",
        points: [
          "High-stakes domains: legal, medical, financial, compliance, safety.",
          "External-facing or published content, such as customer communications or press.",
          "Decisions that affect people, such as hiring, performance or eligibility.",
          "Anything you will sign, submit or be accountable for. Remember that YOU own the output."
        ]
      },
      {
        heading: "Fit for audience & format",
        points: [
          "Edit for the intended reader: executives want the bottom line first, specialists want detail.",
          "Choose the format: inline text for quick answers, an Artifact for standalone documents, code or visuals you'll iterate on, and structured data (tables, CSV, JSON) for content going into another tool."
        ]
      }
    ],
    traps: [
      "'Ask Claude if it's sure' sounds diligent but doesn't verify anything.",
      "'Regenerate and compare' doesn't verify facts either, because both runs can be wrong.",
      "Don't skip review just because the output looks polished."
    ],
    sources: []
  },
  {
    domain: 3,
    title: "Product & Model Selection",
    weight: 12,
    summary:
      "This domain covers choosing the right Claude feature and model tier for the task, balancing quality, speed and cost, and managing context limits.",
    sections: [
      {
        heading: "Model tiers",
        points: [
          "Haiku is the fastest and cheapest. Use it for high-volume, simple, low-stakes tasks such as classification, short replies and quick extraction.",
          "Sonnet is balanced and fits most everyday work: drafting, analysis and summarizing.",
          "Opus is the most capable. Use it for complex reasoning, nuanced multi-step analysis, hard problems and long-horizon tasks.",
          "Rule: match the model to the task. Don't pay for Opus where Haiku is enough, and don't use Haiku for a complex strategic analysis."
        ]
      },
      {
        heading: "Product features",
        points: [
          "Chat: one-off questions and tasks.",
          "Projects: a workspace with shared knowledge files and custom instructions that apply to every chat in the project. Use it for recurring work on the same material.",
          "Artifacts: standalone outputs (documents, code, diagrams, small apps) shown beside the chat that you can iterate on, reuse and share.",
          "Web search / Research: current information with citations. Research runs a deeper, multi-source investigation.",
          "File uploads & analysis: PDFs, spreadsheets and images. Claude can run code to analyze data.",
          "Connectors: link tools such as Google Drive, Gmail, Calendar and other apps so Claude can work with your real data.",
          "Extended thinking: more reasoning time for hard problems.",
          "Memory & Styles: memory carries useful context across chats, and Styles keep a consistent writing voice."
        ]
      },
      {
        heading: "Context management",
        points: [
          "Every conversation has a context window limit. Very long chats can lose focus on early details.",
          "When a chat gets very long or drifts, ask for a summary and start a fresh chat with it.",
          "Put material you use repeatedly into Project knowledge instead of pasting it into every chat."
        ]
      }
    ],
    traps: [
      "'Always use the most powerful model' is wrong. Cost and speed matter.",
      "Don't rely on training knowledge for recent events. Use web search or Research."
    ],
    sources: []
  },
  {
    domain: 4,
    title: "Workflow Integration & Solution Design",
    weight: 16,
    summary:
      "This domain covers fitting Claude into real business processes: analyzing requirements, redesigning workflows with a human in the loop, and setting honest expectations with stakeholders.",
    sections: [
      {
        heading: "Designing a solution",
        points: [
          "Start with the problem and success criteria (time saved, quality, error rate), not with the tool.",
          "Map the current workflow and find the text-heavy, repetitive, or first-draft steps where Claude adds value.",
          "Keep humans at the decision and approval points (human-in-the-loop).",
          "Pilot with a small group, measure against a baseline, then scale.",
          "Use connectors or Projects to bring in source data instead of manual copy-paste."
        ]
      },
      {
        heading: "Good vs poor fit",
        points: [
          "Good fit: drafting, summarizing, reformatting, brainstorming, research synthesis, first-pass analysis, template generation.",
          "Poor fit: being the final authority on high-stakes decisions, tasks needing guaranteed real-time accuracy without verification, or processing data your policy forbids."
        ]
      },
      {
        heading: "Communicating with stakeholders",
        points: [
          "Be honest about both value and limitations, including the need for review.",
          "Frame Claude as augmenting people, not replacing their judgment.",
          "Report measured results, not hype."
        ]
      },
      {
        heading: "Research & planning",
        points: [
          "Claude is good at producing plans, outlines, risk lists and options. Validate them with the people who own the work."
        ]
      }
    ],
    traps: [
      "Rolling out to the whole company with no pilot or metrics.",
      "Removing human review to 'save time' on high-stakes outputs."
    ],
    sources: []
  },
  {
    domain: 5,
    title: "Configuration & Knowledge Management",
    weight: 12,
    summary:
      "This domain covers setting up Claude Projects well (instructions, knowledge files, connectors) and keeping them accurate over time.",
    sections: [
      {
        heading: "Project instructions",
        points: [
          "Instructions apply to every chat in the project. Use them for role, audience, tone, format and rules.",
          "Include what to do when Claude is unsure, for example: 'say so and point to the relevant doc'.",
          "Keep them concise, specific and up to date. Revise them when outputs drift."
        ]
      },
      {
        heading: "Project knowledge",
        points: [
          "Upload only the relevant, authoritative and current documents. More files is not always better.",
          "Remove or replace outdated or superseded versions. Old files cause wrong answers.",
          "Use clear file names and versions so conflicts are obvious.",
          "When a project gives wrong answers, check the knowledge files first."
        ]
      },
      {
        heading: "Connectors & sharing",
        points: [
          "Connect only the sources you need (least privilege), and follow your admin's approved list.",
          "Shared projects (Team/Enterprise) let colleagues reuse the same setup. Check that the shared files are appropriate for everyone with access.",
          "Memory can carry context across chats. Review it and manage it, and use incognito or temporary chats when appropriate."
        ]
      }
    ],
    traps: [
      "Dumping every file you have into a Project.",
      "Forgetting to update the knowledge files after a policy changes."
    ],
    sources: []
  },
  {
    domain: 6,
    title: "Governance, Risk & Responsible Use",
    weight: 15,
    summary:
      "This domain covers using AI safely, legally and ethically at work: protecting data, following your organization's AI policy, keeping humans accountable, and being transparent.",
    sections: [
      {
        heading: "Data sensitivity & privacy",
        points: [
          "Before you upload, ask: is this data allowed in this tool under our policy?",
          "Anonymize or remove personal data (PII) and confidential details when the task doesn't need them.",
          "Use the organization-approved account (for example Team or Enterprise), not a personal consumer account, for work data.",
          "Know your plan's data-handling settings (retention, training use)."
        ]
      },
      {
        heading: "Policy & accountability",
        points: [
          "Follow your organization's AI use policy. When it's unclear, ask the policy owner. Don't guess.",
          "The human user stays accountable for the outputs they use.",
          "AI should support decisions that affect people (hiring, lending, discipline), not make them alone.",
          "Disclose AI assistance where your policy, client contract or context requires it."
        ]
      },
      {
        heading: "Risks to recognize",
        points: [
          "Prompt injection: documents, emails or web pages can contain hidden instructions. Treat content as data, and be careful when connectors give access to your tools.",
          "Bias and fairness issues in outputs about people.",
          "IP and copyright: don't present output as verified original work without checks, and respect licensing.",
          "Over-reliance: professional advice (legal, medical, financial) needs qualified review."
        ]
      }
    ],
    traps: [
      "'It's faster to just upload the full customer file' is the wrong answer. Anonymize first or use approved data.",
      "'Claude said it's compliant, so it is' is also wrong. A human must verify."
    ],
    sources: []
  },
  {
    domain: 7,
    title: "Troubleshooting & Optimization",
    weight: 10,
    summary:
      "This domain covers working out why results are poor and fixing them systematically, then making workflows faster and more repeatable.",
    sections: [
      {
        heading: "Diagnosing poor output",
        points: [
          "Ignored format: make the format explicit and show an example.",
          "Inconsistent results: add examples, a template and specific criteria.",
          "Too generic: add context, the audience and concrete details.",
          "Too long or short: state the length precisely (words, bullets, sections).",
          "Wrong facts from a Project: check the knowledge files for outdated or conflicting docs.",
          "Quality drops in a long chat: summarize and start a new chat.",
          "Refusing a benign request: add the legitimate context and purpose."
        ]
      },
      {
        heading: "Systematic fixes",
        points: [
          "Change one thing at a time so you know what helped.",
          "Use feedback: tell Claude exactly what was wrong and what good looks like.",
          "Keep the prompts that work. Save them as Project instructions, templates or Styles."
        ]
      },
      {
        heading: "Optimizing workflows",
        points: [
          "Reuse: put recurring setups in Projects and saved prompts.",
          "Right-size the model: a lighter model for simple, high-volume steps.",
          "Batch similar work and use connectors to cut copy-paste."
        ]
      }
    ],
    traps: ["Rewriting everything at once makes it impossible to know what fixed the issue."],
    sources: []
  }
];
