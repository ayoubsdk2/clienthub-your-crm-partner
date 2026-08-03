export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type PipelineStage = "lead_in" | "discovery" | "proposal" | "negotiation" | "closed_won";

export interface Rep {
  id: string;
  name: string;
  role: string;
  email: string;
  initials: string;
  quota: number;
  attained: number;
  deals: number;
}

export interface Customer {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  status: "active" | "churn_risk" | "prospect";
  plan: "Starter" | "Growth" | "Enterprise";
  arr: number;
  health: number;
  ownerId: string;
  since: string;
  website: string;
  notes: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  value: number;
  score: number;
  ownerId: string;
  createdAt: string;
  notes: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: PipelineStage;
  probability: number;
  ownerId: string;
  closeDate: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  lastTouch: string;
  channel: "Email" | "Call" | "Meeting";
  history: { id: string; type: "Email" | "Call" | "Meeting" | "Note"; date: string; summary: string }[];
}

export interface Task {
  id: string;
  title: string;
  related: string;
  assigneeId: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: "Meeting" | "Call" | "Follow-up";
  date: string;
  time: string;
  duration: string;
  withWhom: string;
}

export const reps: Rep[] = [
  { id: "r1", name: "Amara Osei", role: "Account Executive", email: "amara@clienthub.io", initials: "AO", quota: 320000, attained: 287400, deals: 18 },
  { id: "r2", name: "Daniel Reyes", role: "Senior AE", email: "daniel@clienthub.io", initials: "DR", quota: 400000, attained: 412600, deals: 24 },
  { id: "r3", name: "Priya Nandakumar", role: "SDR Lead", email: "priya@clienthub.io", initials: "PN", quota: 180000, attained: 141200, deals: 31 },
  { id: "r4", name: "Tomas Lindqvist", role: "Account Executive", email: "tomas@clienthub.io", initials: "TL", quota: 300000, attained: 224900, deals: 15 },
  { id: "r5", name: "Grace Whitfield", role: "Customer Success", email: "grace@clienthub.io", initials: "GW", quota: 250000, attained: 268300, deals: 21 },
];

export const repById = (id: string) => reps.find((r) => r.id === id);

export const customers: Customer[] = [
  { id: "c1", company: "Northwind Logistics", contactName: "Elena Marsh", email: "elena@northwind.co", phone: "+1 (415) 220-8841", industry: "Logistics", location: "San Francisco, CA", status: "active", plan: "Enterprise", arr: 184000, health: 92, ownerId: "r2", since: "2022-03-14", website: "northwind.co", notes: "Expanding to EU fleet ops in Q3. Champion: Elena." },
  { id: "c2", company: "Beacon Health Group", contactName: "Marcus Lee", email: "m.lee@beaconhg.com", phone: "+1 (312) 774-1290", industry: "Healthcare", location: "Chicago, IL", status: "active", plan: "Enterprise", arr: 226500, health: 88, ownerId: "r5", since: "2021-11-02", website: "beaconhg.com", notes: "Compliance review scheduled with security team." },
  { id: "c3", company: "Volt Manufacturing", contactName: "Sofia Alvarez", email: "sofia@voltmfg.com", phone: "+1 (214) 903-4412", industry: "Manufacturing", location: "Dallas, TX", status: "churn_risk", plan: "Growth", arr: 68000, health: 41, ownerId: "r4", since: "2023-01-25", website: "voltmfg.com", notes: "Low seat adoption. Executive business review needed." },
  { id: "c4", company: "Lumen Financial", contactName: "Peter Kwon", email: "pkwon@lumenfin.com", phone: "+1 (646) 118-7734", industry: "Financial Services", location: "New York, NY", status: "active", plan: "Enterprise", arr: 310000, health: 95, ownerId: "r2", since: "2020-08-19", website: "lumenfin.com", notes: "Reference customer. Case study approved." },
  { id: "c5", company: "Harborview Realty", contactName: "Jade Whitmore", email: "jade@harborview.com", phone: "+1 (206) 445-2210", industry: "Real Estate", location: "Seattle, WA", status: "prospect", plan: "Starter", arr: 14400, health: 63, ownerId: "r1", since: "2024-06-11", website: "harborview.com", notes: "Trialing pipeline automation." },
  { id: "c6", company: "Kestrel Robotics", contactName: "Ivan Petrov", email: "ivan@kestrelrobotics.ai", phone: "+44 20 7946 0322", industry: "Technology", location: "London, UK", status: "active", plan: "Growth", arr: 96000, health: 79, ownerId: "r1", since: "2023-09-05", website: "kestrelrobotics.ai", notes: "Interested in API access add-on." },
  { id: "c7", company: "Sable & Co Retail", contactName: "Nina Okafor", email: "nina@sableco.com", phone: "+1 (305) 662-9018", industry: "Retail", location: "Miami, FL", status: "active", plan: "Growth", arr: 74500, health: 84, ownerId: "r4", since: "2022-12-01", website: "sableco.com", notes: "Peak season support plan agreed." },
  { id: "c8", company: "Terra Renewables", contactName: "Lukas Brenner", email: "lukas@terraren.de", phone: "+49 30 5557 2210", industry: "Energy", location: "Berlin, DE", status: "churn_risk", plan: "Growth", arr: 52000, health: 48, ownerId: "r5", since: "2023-04-17", website: "terraren.de", notes: "Budget freeze until fiscal reset." },
  { id: "c9", company: "Atlas Education", contactName: "Hannah Cole", email: "hannah@atlasedu.org", phone: "+1 (617) 331-0092", industry: "Education", location: "Boston, MA", status: "active", plan: "Starter", arr: 21600, health: 87, ownerId: "r3", since: "2024-02-08", website: "atlasedu.org", notes: "Upsell to Growth likely next renewal." },
  { id: "c10", company: "Pinnacle Legal", contactName: "Robert Vance", email: "rvance@pinnaclelegal.com", phone: "+1 (312) 908-5540", industry: "Legal", location: "Chicago, IL", status: "active", plan: "Growth", arr: 88000, health: 90, ownerId: "r2", since: "2022-07-22", website: "pinnaclelegal.com", notes: "Requested SSO rollout documentation." },
];

export const leads: Lead[] = [
  { id: "l1", name: "Clara Devon", company: "Meridian Foods", email: "clara@meridianfoods.com", phone: "+1 (503) 221-8890", source: "Webinar", status: "qualified", value: 42000, score: 87, ownerId: "r1", createdAt: "2026-07-14", notes: "Attended pipeline automation webinar, asked about migration." },
  { id: "l2", name: "Owen Barlow", company: "Halcyon Media", email: "owen@halcyonmedia.tv", phone: "+1 (323) 550-1122", source: "Inbound", status: "new", value: 18500, score: 64, ownerId: "r3", createdAt: "2026-07-28", notes: "Downloaded ROI calculator." },
  { id: "l3", name: "Mei Tanaka", company: "Orbital Systems", email: "mei@orbitalsys.jp", phone: "+81 3 6811 2200", source: "Referral", status: "proposal", value: 128000, score: 93, ownerId: "r2", createdAt: "2026-06-02", notes: "Proposal sent for 120 seats, legal reviewing." },
  { id: "l4", name: "Felix Moreau", company: "Cobalt Interiors", email: "felix@cobaltinteriors.fr", phone: "+33 1 4488 2200", source: "Outbound", status: "contacted", value: 26000, score: 58, ownerId: "r4", createdAt: "2026-07-19", notes: "Two calls, wants pricing in EUR." },
  { id: "l5", name: "Adaeze Nwosu", company: "Brightpath Clinics", email: "adaeze@brightpath.health", phone: "+1 (404) 771-3390", source: "Event", status: "qualified", value: 61000, score: 81, ownerId: "r5", createdAt: "2026-07-06", notes: "Met at HealthTech Summit, needs HIPAA docs." },
  { id: "l6", name: "Jonas Kim", company: "Vertex Freight", email: "jonas@vertexfreight.com", phone: "+1 (713) 442-9910", source: "Inbound", status: "won", value: 74000, score: 96, ownerId: "r2", createdAt: "2026-05-21", notes: "Closed — onboarding kicked off." },
  { id: "l7", name: "Ruth Sandoval", company: "Ember Coffee Co", email: "ruth@embercoffee.com", phone: "+1 (971) 220-4402", source: "Outbound", status: "lost", value: 12000, score: 34, ownerId: "r3", createdAt: "2026-04-30", notes: "Chose a cheaper point solution." },
  { id: "l8", name: "Samir Haddad", company: "Delta Grid Energy", email: "samir@deltagrid.ae", phone: "+971 4 220 8890", source: "Partner", status: "contacted", value: 88000, score: 72, ownerId: "r1", createdAt: "2026-07-24", notes: "Partner-sourced, procurement window opens in September." },
  { id: "l9", name: "Isabelle Fournier", company: "Nova Biotech", email: "isabelle@novabio.ca", phone: "+1 (514) 883-0021", source: "Referral", status: "new", value: 54000, score: 69, ownerId: "r4", createdAt: "2026-08-01", notes: "Referred by Lumen Financial." },
  { id: "l10", name: "Andre Cruz", company: "Summit Outdoor", email: "andre@summitoutdoor.com", phone: "+1 (720) 118-3345", source: "Webinar", status: "qualified", value: 33500, score: 76, ownerId: "r5", createdAt: "2026-07-11", notes: "Evaluating against Pipedrive." },
];

export const opportunities: Opportunity[] = [
  { id: "o1", title: "Orbital Systems — 120 seats", company: "Orbital Systems", value: 128000, stage: "negotiation", probability: 75, ownerId: "r2", closeDate: "2026-08-29" },
  { id: "o2", title: "Delta Grid — Platform rollout", company: "Delta Grid Energy", value: 88000, stage: "discovery", probability: 40, ownerId: "r1", closeDate: "2026-09-30" },
  { id: "o3", title: "Brightpath — Clinic network", company: "Brightpath Clinics", value: 61000, stage: "proposal", probability: 55, ownerId: "r5", closeDate: "2026-09-12" },
  { id: "o4", title: "Meridian Foods — Sales suite", company: "Meridian Foods", value: 42000, stage: "discovery", probability: 35, ownerId: "r1", closeDate: "2026-10-02" },
  { id: "o5", title: "Vertex Freight — Expansion", company: "Vertex Freight", value: 74000, stage: "closed_won", probability: 100, ownerId: "r2", closeDate: "2026-07-18" },
  { id: "o6", title: "Nova Biotech — Pilot", company: "Nova Biotech", value: 54000, stage: "lead_in", probability: 15, ownerId: "r4", closeDate: "2026-11-14" },
  { id: "o7", title: "Cobalt Interiors — Growth plan", company: "Cobalt Interiors", value: 26000, stage: "lead_in", probability: 20, ownerId: "r4", closeDate: "2026-10-21" },
  { id: "o8", title: "Summit Outdoor — Team plan", company: "Summit Outdoor", value: 33500, stage: "proposal", probability: 50, ownerId: "r5", closeDate: "2026-09-05" },
  { id: "o9", title: "Kestrel Robotics — API add-on", company: "Kestrel Robotics", value: 36000, stage: "negotiation", probability: 70, ownerId: "r1", closeDate: "2026-08-22" },
  { id: "o10", title: "Pinnacle Legal — SSO upgrade", company: "Pinnacle Legal", value: 24000, stage: "closed_won", probability: 100, ownerId: "r2", closeDate: "2026-07-09" },
  { id: "o11", title: "Halcyon Media — Starter", company: "Halcyon Media", value: 18500, stage: "lead_in", probability: 10, ownerId: "r3", closeDate: "2026-11-01" },
  { id: "o12", title: "Atlas Education — Growth upgrade", company: "Atlas Education", value: 31000, stage: "discovery", probability: 45, ownerId: "r3", closeDate: "2026-09-26" },
];

export const stageMeta: { id: PipelineStage; label: string }[] = [
  { id: "lead_in", label: "Lead In" },
  { id: "discovery", label: "Discovery" },
  { id: "proposal", label: "Proposal" },
  { id: "negotiation", label: "Negotiation" },
  { id: "closed_won", label: "Closed Won" },
];

export const contacts: Contact[] = [
  {
    id: "ct1", name: "Elena Marsh", title: "VP Operations", company: "Northwind Logistics", email: "elena@northwind.co", phone: "+1 (415) 220-8841", lastTouch: "2026-08-01", channel: "Meeting",
    history: [
      { id: "h1", type: "Meeting", date: "2026-08-01", summary: "QBR — reviewed fleet dashboard adoption, 92% weekly active." },
      { id: "h2", type: "Email", date: "2026-07-22", summary: "Sent EU expansion pricing sheet." },
      { id: "h3", type: "Call", date: "2026-07-08", summary: "Discussed API rate limits with their platform team." },
    ],
  },
  {
    id: "ct2", name: "Marcus Lee", title: "Chief Information Officer", company: "Beacon Health Group", email: "m.lee@beaconhg.com", phone: "+1 (312) 774-1290", lastTouch: "2026-07-30", channel: "Call",
    history: [
      { id: "h4", type: "Call", date: "2026-07-30", summary: "Security questionnaire walkthrough." },
      { id: "h5", type: "Note", date: "2026-07-15", summary: "Procurement cycle closes end of September." },
    ],
  },
  {
    id: "ct3", name: "Sofia Alvarez", title: "Director of Sales", company: "Volt Manufacturing", email: "sofia@voltmfg.com", phone: "+1 (214) 903-4412", lastTouch: "2026-07-12", channel: "Email",
    history: [
      { id: "h6", type: "Email", date: "2026-07-12", summary: "Shared adoption report — seats underused." },
      { id: "h7", type: "Meeting", date: "2026-06-18", summary: "Enablement session with 9 reps." },
    ],
  },
  {
    id: "ct4", name: "Peter Kwon", title: "Head of Revenue Ops", company: "Lumen Financial", email: "pkwon@lumenfin.com", phone: "+1 (646) 118-7734", lastTouch: "2026-08-02", channel: "Email",
    history: [
      { id: "h8", type: "Email", date: "2026-08-02", summary: "Approved case study copy." },
      { id: "h9", type: "Meeting", date: "2026-07-19", summary: "Forecast accuracy workshop." },
    ],
  },
  {
    id: "ct5", name: "Ivan Petrov", title: "COO", company: "Kestrel Robotics", email: "ivan@kestrelrobotics.ai", phone: "+44 20 7946 0322", lastTouch: "2026-07-27", channel: "Meeting",
    history: [
      { id: "h10", type: "Meeting", date: "2026-07-27", summary: "Scoped API add-on for warehouse telemetry." },
      { id: "h11", type: "Call", date: "2026-07-03", summary: "Renewal timing confirmed for October." },
    ],
  },
  {
    id: "ct6", name: "Nina Okafor", title: "Retail Director", company: "Sable & Co Retail", email: "nina@sableco.com", phone: "+1 (305) 662-9018", lastTouch: "2026-07-21", channel: "Call",
    history: [
      { id: "h12", type: "Call", date: "2026-07-21", summary: "Holiday season staffing and support SLAs." },
      { id: "h13", type: "Note", date: "2026-06-29", summary: "Wants POS integration on roadmap." },
    ],
  },
];

export const tasks: Task[] = [
  { id: "t1", title: "Send Orbital Systems revised MSA", related: "Orbital Systems", assigneeId: "r2", dueDate: "2026-08-05", status: "in_progress", priority: "high" },
  { id: "t2", title: "Prep EBR deck for Volt Manufacturing", related: "Volt Manufacturing", assigneeId: "r4", dueDate: "2026-08-07", status: "todo", priority: "high" },
  { id: "t3", title: "Follow up with Halcyon Media", related: "Halcyon Media", assigneeId: "r3", dueDate: "2026-08-04", status: "todo", priority: "medium" },
  { id: "t4", title: "Share HIPAA documentation pack", related: "Brightpath Clinics", assigneeId: "r5", dueDate: "2026-08-06", status: "in_progress", priority: "high" },
  { id: "t5", title: "Log Q3 forecast in pipeline review", related: "Internal", assigneeId: "r1", dueDate: "2026-08-08", status: "todo", priority: "medium" },
  { id: "t6", title: "Onboarding kickoff — Vertex Freight", related: "Vertex Freight", assigneeId: "r2", dueDate: "2026-07-30", status: "done", priority: "medium" },
  { id: "t7", title: "Refresh outbound sequence copy", related: "Internal", assigneeId: "r3", dueDate: "2026-08-12", status: "todo", priority: "low" },
  { id: "t8", title: "Renewal call with Kestrel Robotics", related: "Kestrel Robotics", assigneeId: "r1", dueDate: "2026-08-11", status: "todo", priority: "medium" },
  { id: "t9", title: "Close out Terra Renewables save plan", related: "Terra Renewables", assigneeId: "r5", dueDate: "2026-08-09", status: "in_progress", priority: "high" },
];

export const events: CalendarEvent[] = [
  { id: "e1", title: "Discovery call — Nova Biotech", type: "Call", date: "2026-08-03", time: "09:30", duration: "30m", withWhom: "Isabelle Fournier" },
  { id: "e2", title: "Contract negotiation — Orbital", type: "Meeting", date: "2026-08-04", time: "14:00", duration: "1h", withWhom: "Mei Tanaka" },
  { id: "e3", title: "Follow-up — Cobalt Interiors", type: "Follow-up", date: "2026-08-05", time: "11:15", duration: "20m", withWhom: "Felix Moreau" },
  { id: "e4", title: "QBR — Beacon Health Group", type: "Meeting", date: "2026-08-06", time: "10:00", duration: "1h 30m", withWhom: "Marcus Lee" },
  { id: "e5", title: "Check-in — Summit Outdoor", type: "Call", date: "2026-08-07", time: "16:00", duration: "30m", withWhom: "Andre Cruz" },
  { id: "e6", title: "Save plan review — Terra Renewables", type: "Meeting", date: "2026-08-10", time: "13:00", duration: "45m", withWhom: "Lukas Brenner" },
  { id: "e7", title: "Follow-up — Delta Grid procurement", type: "Follow-up", date: "2026-08-12", time: "08:45", duration: "25m", withWhom: "Samir Haddad" },
  { id: "e8", title: "Renewal — Kestrel Robotics", type: "Call", date: "2026-08-14", time: "15:30", duration: "40m", withWhom: "Ivan Petrov" },
];

export const activity = [
  { id: "a1", who: "Daniel Reyes", action: "moved", target: "Orbital Systems — 120 seats", detail: "Proposal → Negotiation", time: "12 minutes ago", kind: "deal" as const },
  { id: "a2", who: "Priya Nandakumar", action: "added", target: "Owen Barlow", detail: "New inbound lead from ROI calculator", time: "48 minutes ago", kind: "lead" as const },
  { id: "a3", who: "Grace Whitfield", action: "logged a call with", target: "Marcus Lee", detail: "Security questionnaire walkthrough", time: "2 hours ago", kind: "call" as const },
  { id: "a4", who: "Amara Osei", action: "sent a proposal to", target: "Delta Grid Energy", detail: "$88,000 · 3-year term", time: "5 hours ago", kind: "email" as const },
  { id: "a5", who: "Tomas Lindqvist", action: "flagged", target: "Volt Manufacturing", detail: "Health score dropped to 41", time: "Yesterday", kind: "alert" as const },
  { id: "a6", who: "Daniel Reyes", action: "closed", target: "Vertex Freight — Expansion", detail: "$74,000 won", time: "Yesterday", kind: "won" as const },
];

export const revenueSeries = [
  { month: "Sep", revenue: 412000, target: 400000, deals: 22 },
  { month: "Oct", revenue: 438000, target: 420000, deals: 25 },
  { month: "Nov", revenue: 401000, target: 430000, deals: 21 },
  { month: "Dec", revenue: 496000, target: 450000, deals: 29 },
  { month: "Jan", revenue: 462000, target: 460000, deals: 26 },
  { month: "Feb", revenue: 508000, target: 470000, deals: 30 },
  { month: "Mar", revenue: 541000, target: 490000, deals: 33 },
  { month: "Apr", revenue: 519000, target: 500000, deals: 31 },
  { month: "May", revenue: 577000, target: 520000, deals: 35 },
  { month: "Jun", revenue: 604000, target: 540000, deals: 37 },
  { month: "Jul", revenue: 638000, target: 560000, deals: 39 },
  { month: "Aug", revenue: 419000, target: 580000, deals: 24 },
];

export const sourceSplit = [
  { name: "Inbound", value: 34 },
  { name: "Outbound", value: 26 },
  { name: "Referral", value: 18 },
  { name: "Events", value: 13 },
  { name: "Partner", value: 9 },
];

export const conversionFunnel = [
  { stage: "Visitors", value: 48200 },
  { stage: "Leads", value: 6140 },
  { stage: "Qualified", value: 2180 },
  { stage: "Opportunities", value: 940 },
  { stage: "Customers", value: 312 },
];

export const emails = {
  inbox: [
    { id: "m1", from: "Mei Tanaka", company: "Orbital Systems", subject: "Re: Revised MSA — legal comments", preview: "Our counsel has two edits on the data processing addendum…", time: "08:42", unread: true, starred: true },
    { id: "m2", from: "Peter Kwon", company: "Lumen Financial", subject: "Case study approved", preview: "Marketing signed off — you're clear to publish the numbers…", time: "07:15", unread: true, starred: false },
    { id: "m3", from: "Samir Haddad", company: "Delta Grid Energy", subject: "Procurement window", preview: "We can start the vendor review the first week of September…", time: "Yesterday", unread: false, starred: true },
    { id: "m4", from: "Hannah Cole", company: "Atlas Education", subject: "Adding 12 more seats", preview: "The pilot went well with the faculty group, we'd like to…", time: "Yesterday", unread: false, starred: false },
    { id: "m5", from: "Lukas Brenner", company: "Terra Renewables", subject: "Budget freeze update", preview: "No movement until the fiscal reset, but I'd like to keep…", time: "Mon", unread: false, starred: false },
    { id: "m6", from: "Nina Okafor", company: "Sable & Co Retail", subject: "POS integration roadmap", preview: "Any update on where this sits for the next two quarters?", time: "Mon", unread: false, starred: false },
  ],
  sent: [
    { id: "s1", to: "Samir Haddad", company: "Delta Grid Energy", subject: "Proposal — Platform rollout", preview: "Attached is the 3-year proposal covering 240 seats…", time: "09:05" },
    { id: "s2", to: "Adaeze Nwosu", company: "Brightpath Clinics", subject: "HIPAA documentation pack", preview: "Here's our BAA template plus the SOC 2 Type II report…", time: "Yesterday" },
    { id: "s3", to: "Felix Moreau", company: "Cobalt Interiors", subject: "EUR pricing", preview: "Converted at today's rate with the annual discount applied…", time: "Mon" },
    { id: "s4", to: "Andre Cruz", company: "Summit Outdoor", subject: "Comparison notes", preview: "A short breakdown of where our automation differs…", time: "Sun" },
  ],
  templates: [
    { id: "tpl1", name: "Discovery follow-up", category: "Sales", opens: 68, replies: 24, uses: 412 },
    { id: "tpl2", name: "Proposal delivery", category: "Sales", opens: 74, replies: 31, uses: 268 },
    { id: "tpl3", name: "Renewal reminder — 60 days", category: "Success", opens: 81, replies: 29, uses: 194 },
    { id: "tpl4", name: "Re-engagement nudge", category: "Outbound", opens: 42, replies: 11, uses: 733 },
    { id: "tpl5", name: "Onboarding kickoff", category: "Success", opens: 89, replies: 44, uses: 156 },
  ],
  campaigns: [
    { id: "cp1", name: "Q3 Product Launch", sent: 12480, openRate: 46.2, clickRate: 12.8, replies: 318, status: "Active" },
    { id: "cp2", name: "Manufacturing Vertical", sent: 5320, openRate: 38.7, clickRate: 9.4, replies: 121, status: "Active" },
    { id: "cp3", name: "Dormant Accounts Winback", sent: 8890, openRate: 27.5, clickRate: 5.1, replies: 76, status: "Paused" },
    { id: "cp4", name: "Webinar — Pipeline Automation", sent: 15210, openRate: 52.1, clickRate: 18.6, replies: 502, status: "Completed" },
  ],
};

export const notifications = [
  { id: "n1", title: "Orbital Systems moved to Negotiation", detail: "Daniel Reyes · 12 minutes ago", unread: true },
  { id: "n2", title: "New inbound lead: Owen Barlow", detail: "Halcyon Media · 48 minutes ago", unread: true },
  { id: "n3", title: "Volt Manufacturing health score dropped", detail: "Now 41 · Yesterday", unread: true },
  { id: "n4", title: "Task due today: Follow up with Halcyon", detail: "Assigned to Priya Nandakumar", unread: false },
  { id: "n5", title: "Vertex Freight expansion closed won", detail: "$74,000 · Yesterday", unread: false },
];

export const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: compact && value >= 1000 ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(value);

export const formatDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const leadStatusLabel: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};
