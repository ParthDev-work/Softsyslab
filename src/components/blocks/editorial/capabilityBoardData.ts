export const capabilityBoardAccents = [
  "var(--color-brand)",
  "var(--color-accent)",
  "var(--color-info)",
  "var(--color-anchor)",
  "var(--color-brand-hover)",
  "var(--color-accent-hover)",
] as const;

export const capabilityBoardCopy: Record<
  string,
  { copy: string; tags: string[] }
> = {
  "Web Applications": {
    copy: "Operational tools, customer portals and platforms designed around real tasks.",
    tags: ["Portals", "Dashboards", "Internal tools"],
  },
  "Mobile Products": {
    copy: "Focused mobile experiences shaped around context, connectivity and device behaviour.",
    tags: ["iOS", "Android", "Cross-platform"],
  },
  "SaaS Platforms": {
    copy: "Subscription products with deliberate onboarding, permissions and operations.",
    tags: ["Tenancy", "Billing", "Administration"],
  },
  "AI and Automation": {
    copy: "Evaluated assistance and reliable workflows with visible controls and fallbacks.",
    tags: ["Integration", "Workflows", "Evaluation"],
  },
  "Cloud and DevOps": {
    copy: "Infrastructure and release systems your team can understand and operate.",
    tags: ["Cloud", "CI/CD", "Observability"],
  },
  "Product Design": {
    copy: "Turn user needs and business constraints into a useful, buildable product plan.",
    tags: ["Discovery", "UX/UI", "Prototyping"],
  },
};

/** One-line beats for the cumulative flow on the capability board. */
export const capabilityFlowBeat: Record<string, string> = {
  "Web Applications": "Browser experiences where customers and teams do real work.",
  "Mobile Products": "Context-aware apps that follow people between places and devices.",
  "SaaS Platforms": "The core product layer — accounts, permissions and operations.",
  "AI and Automation": "Assistance and workflows wired in with clear human control.",
  "Cloud and DevOps": "Infrastructure and releases your team can run day to day.",
  "Product Design": "Discovery and design that set direction before build cost lands.",
};
