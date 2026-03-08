/**
 * Centralised user-facing strings.
 * All UI text that might need translation or consistent updating lives here.
 * To add i18n support in the future, replace this module with a locale-aware
 * string lookup (e.g., react-i18next, FormatJS).
 */

// ─── Navigation ───────────────────────────────────────────────────────────────
export const NAV = {
  HOME: 'HOME',
  BUILDER: 'BUILDER',
  COMPONENTS: 'COMPONENTS',
  GLOSSARY: 'GLOSSARY',
  TOOLS: 'TOOLS',
  NAVIGATION: 'NAVIGATION',
} as const

// ─── Settings panel ───────────────────────────────────────────────────────────
export const SETTINGS = {
  SETTINGS: 'SETTINGS',
  LEARN_MODE: 'LEARN MODE',
  LEARN_MODE_DESCRIPTION: 'Hides pricing and vendor links',
  SHOW_PRICING: 'SHOW PRICING',
  SHOW_VENDORS: 'SHOW VENDORS',
  THEME: 'THEME',
  CURRENCY: 'CURRENCY',
} as const

// ─── Builder / Cost Estimator ─────────────────────────────────────────────────
export const BUILDER = {
  BUILD_ESTIMATE: 'BUILD_ESTIMATE',
  BUILD_SUMMARY: 'BUILD_SUMMARY',
  TOTAL_COST: 'TOTAL_COST',
  COMPLEXITY: 'COMPLEXITY',
  BUILD_TIME: 'BUILD_TIME',
  BREAKDOWN: '[BREAKDOWN]',
  SELECTIONS: '[SELECTIONS]',
  EXPORT_PLAN: 'EXPORT_PLAN',
  ASSEMBLY_GUIDE: 'ASSEMBLY_GUIDE',
  RESET_CHOICES: 'RESET_CHOICES',
  RESET_CONFIRM: 'RESET_ALL?',
  CANCEL: 'CANCEL',
  YES_RESET: 'YES_RESET',
  BEGINNER: '[BEGINNER]',
  INTERMEDIATE: '[INTERMEDIATE]',
  ADVANCED: '[ADVANCED]',
  QUICK: '[QUICK]',
  WEEKEND: '[WEEKEND]',
  MULTI_WEEK: '[MULTI_WEEK]',
  INCOMPATIBLE: 'INCOMPATIBLE',
  CHOOSE_THIS: 'CHOOSE_THIS',
  HIDE_DETAILS: 'HIDE_DETAILS',
  VIEW_DETAILS: 'VIEW_DETAILS',
} as const

// ─── Decision tree ────────────────────────────────────────────────────────────
export const DECISION_TREE = {
  WHAT_THIS_MEANS: 'WHAT_THIS_MEANS',
} as const

// ─── Assembly guide ───────────────────────────────────────────────────────────
export const ASSEMBLY = {
  WARNINGS: '[WARNINGS]',
  PRO_TIPS: '[PRO_TIPS]',
  EXTERNAL_RESOURCES: '[EXTERNAL_RESOURCES]',
} as const

// ─── Compatibility ────────────────────────────────────────────────────────────
export const COMPAT = {
  ISSUE_SINGULAR: 'ISSUE',
  ISSUE_PLURAL: 'ISSUES',
} as const

// ─── Home page ────────────────────────────────────────────────────────────────
export const HOME = {
  HEADLINE: 'BUILD YOUR SPLIT KEYBOARD_',
  VERSION_BADGE: 'INTERACTIVE BUILD SYSTEM v1.0',
  CTA_START: 'Start Building',
  CTA_BROWSE: 'Browse Components',
  WHY_BUILD: 'WHY_BUILD_SPLIT?',
} as const

// ─── Glossary page ────────────────────────────────────────────────────────────
export const GLOSSARY = {
  TITLE: 'GLOSSARY',
  DESCRIPTION: 'Key terms and concepts for split keyboard building.',
  SEARCH_PLACEHOLDER: 'Search terms...',
  NO_RESULTS: 'No terms match your search.',
} as const

// ─── Tools checklist ──────────────────────────────────────────────────────────
export const TOOLS_PAGE = {
  TITLE: 'TOOLS_CHECKLIST',
  DESCRIPTION: 'Everything you need before starting your split keyboard build.',
  STARTER_BUDGET: 'STARTER_BUDGET',
  REQUIRED: 'REQUIRED',
  RECOMMENDED: 'RECOMMENDED',
} as const

// ─── Export ───────────────────────────────────────────────────────────────────
export const EXPORT = {
  JSON_LABEL: 'JSON',
  JSON_DESCRIPTION: 'Machine-readable',
  TEXT_LABEL: 'TEXT',
  TEXT_DESCRIPTION: 'Human-readable',
} as const
