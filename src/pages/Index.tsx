import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Mic, PhoneCall, Voicemail, CalendarCheck2, PhoneOff,
  Sparkles, Building2, User2, Target, Clock, CheckCircle2,
  ArrowUpRight, Activity, ShieldCheck, FileText, History,
  ChevronRight, Quote, Radio, Layers, Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Field = {
  key: string;
  label: string;
  value: string;
  auto: boolean;
  icon: React.ComponentType<{ className?: string }>;
};

const SUPPORTING_QUOTES = [
  { q: "By the time I open the CRM, find the right contact, click through three screens, and type my notes, I've forgotten half of what was said.", a: "Senior AE" },
  { q: "I just text myself after calls and paste it into a Google Doc.", a: "SDR" },
  { q: "I used it for a week when I started. Then I realized nobody else on the team uses it either, so why bother?", a: "New hire" },
  { q: "We spent $180K building this tool. 18% adoption. I need to either fix it or justify buying Gong to the board.", a: "VP Sales" },
];

const RECENT = [
  { name: "Marcus Chen", co: "Northwind Logistics", auto: 8, sec: 22, outcome: "Booked" },
  { name: "Priya Anand", co: "Helix Bio", auto: 7, sec: 28, outcome: "Connected" },
  { name: "Tom Reilly", co: "Cobalt Freight", auto: 6, sec: 31, outcome: "Voicemail" },
  { name: "Dana Whitfield", co: "Ironhold Capital", auto: 9, sec: 19, outcome: "Connected" },
  { name: "Sergio Vasquez", co: "Lumen & Co", auto: 7, sec: 24, outcome: "Booked" },
  { name: "Alia Brennan", co: "Parkway Health", auto: 8, sec: 26, outcome: "Connected" },
];

const HISTORY = [
  { date: "Apr 21", title: "Discovery — pricing & seats", excerpt: "Sarah confirmed budget approved Q2. Asked about SSO + audit logs. Worried about migration from Pipedrive…" },
  { date: "Apr 14", title: "Intro call — referred by Helix", excerpt: "30 reps, scaling to 60 by EOY. Current tool: 'a graveyard.' Procurement runs through CFO Marcus…" },
  { date: "Mar 30", title: "Inbound demo request", excerpt: "Saw the launch on LinkedIn. Wants to see voice capture + HubSpot two-way sync. Decision by June." },
];

const Index = () => {
  // ---------- live "you" stats ----------
  const [liveSeconds, setLiveSeconds] = useState(0); // your live tracker (sec)
  const [callsLogged, setCallsLogged] = useState(2);
  const [autoFilled, setAutoFilled] = useState(7);

  // ---------- recording state ----------
  const [recording, setRecording] = useState(false);
  const [recordMs, setRecordMs] = useState(0);
  const [phase, setPhase] = useState<"idle" | "recording" | "filling" | "done">("idle");
  const [fields, setFields] = useState<Field[]>(() => seedFields());
  const [revealCount, setRevealCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [tab, setTab] = useState<"brief" | "history">("brief");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const recTimer = useRef<number | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setLiveSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = window.setInterval(() => setQuoteIdx((i) => (i + 1) % SUPPORTING_QUOTES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // ---------- recording handlers ----------
  const startRecord = () => {
    if (phase === "filling") return;
    setRecording(true);
    setPhase("recording");
    setRecordMs(0);
    setFields(seedFields());
    setRevealCount(0);
    recTimer.current = window.setInterval(() => setRecordMs((m) => m + 100), 100);
  };
  const stopRecord = () => {
    if (!recording) return;
    setRecording(false);
    if (recTimer.current) clearInterval(recTimer.current);
    if (recordMs < 600) {
      setPhase("idle");
      return;
    }
    runAutoFill();
  };

  const runAutoFill = () => {
    setPhase("filling");
    const filled = mockFilled();
    setFields(filled);
    let i = 0;
    const reveal = window.setInterval(() => {
      i++;
      setRevealCount(i);
      if (i >= 7) {
        clearInterval(reveal);
        setPhase("done");
        const secs = Math.max(18, Math.round(recordMs / 1000) + 6);
        toast.success(`Saved to HubSpot in ${secs}s`, {
          description: "7 of 9 fields auto-filled from voice.",
        });
        setCallsLogged((c) => c + 1);
        setAutoFilled(7);
      }
    }, 220);
  };

  const pickOutcome = (o: string) => {
    const filled = mockFilled().map((f) => (f.key === "outcome" ? { ...f, value: o, auto: false } : f));
    setFields(filled);
    setPhase("done");
    setRevealCount(7);
    toast(`${o} logged`, { description: "Outcome saved manually." });
    setCallsLogged((c) => c + 1);
  };

  const visibleFields = phase === "filling" || phase === "done"
    ? fields.map((f, i) => ({ ...f, shown: i < (phase === "done" ? 9 : revealCount) }))
    : fields.map((f) => ({ ...f, shown: false }));

  return (
    <div className="min-h-screen text-foreground">
      {/* TOP NAV */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary grid place-items-center glow-primary">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">Echo</span>
            <span className="text-xs text-muted-foreground ml-1">for HubSpot</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <span className="px-3 py-1.5 rounded-md text-foreground bg-secondary">Capture</span>
            <span className="px-3 py-1.5 rounded-md hover:text-foreground cursor-default">Pipeline</span>
            <span className="px-3 py-1.5 rounded-md hover:text-foreground cursor-default">Contacts</span>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <ReviewToggle on={reviewMode} setOn={setReviewMode} />
            <div className="w-8 h-8 rounded-full bg-secondary hairline grid place-items-center text-xs font-medium">JR</div>
          </div>
        </div>
      </header>

      {/* HERO + STATS */}
      <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-xs text-primary/90 bg-primary/10 hairline border-primary/20 px-2.5 py-1 rounded-full mb-5">
              <Sparkles className="w-3 h-3" /> Voice-first capture · layered on HubSpot
            </div>
            <h1 className="font-display text-5xl md:text-6xl leading-[1.02] tracking-tight text-balance">
              Log a call in <span className="text-primary italic">30&nbsp;seconds.</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl">
              Voice in. Structured CRM out. Reps stop typing — managers stop guessing.
            </p>
          </div>

          <StatCard liveSeconds={liveSeconds} callsLogged={callsLogged} autoFilled={autoFilled} />
        </div>
      </section>

      {/* MAIN GRID */}
      <main className="mx-auto max-w-[1400px] px-6 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT — call context */}
        <section className="lg:col-span-4 space-y-6">
          <ActiveCallCard />
          <BriefHistoryTabs tab={tab} setTab={setTab} />
        </section>

        {/* CENTER — capture */}
        <section className="lg:col-span-5 space-y-6">
          <CaptureCard
            phase={phase}
            recording={recording}
            recordMs={recordMs}
            onDown={startRecord}
            onUp={stopRecord}
            quoteIdx={quoteIdx}
          />
          <AutoFillPanel fields={visibleFields} phase={phase} reviewMode={reviewMode} />
          <ManualFallback onPick={pickOutcome} disabled={phase === "recording" || phase === "filling"} />
        </section>

        {/* RIGHT — recent log */}
        <aside className="lg:col-span-3">
          <RecentLog />
        </aside>
      </main>

      <footer className="mx-auto max-w-[1400px] px-6 pb-10 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> Two-way sync · HubSpot writeback every 12s</div>
        <div>Hypothesis test · Cohort: Mid-market AE · Build v0.4</div>
      </footer>
    </div>
  );
};

// ============== Sub-components ==============

function ReviewToggle({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  return (
    <button
      onClick={() => setOn(!on)}
      className={cn(
        "group flex items-center gap-2.5 h-9 pl-3 pr-1.5 rounded-full hairline transition-all",
        on ? "bg-primary/10 border-primary/30" : "bg-secondary"
      )}
    >
      <Layers className={cn("w-3.5 h-3.5", on ? "text-primary" : "text-muted-foreground")} />
      <span className="text-xs font-medium">Pipeline Review Mode</span>
      <span className={cn("ml-1 w-9 h-6 rounded-full relative transition-colors", on ? "bg-primary" : "bg-muted")}>
        <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform", on && "translate-x-3")} />
      </span>
    </button>
  );
}

function StatCard({ liveSeconds, callsLogged, autoFilled }: { liveSeconds: number; callsLogged: number; autoFilled: number }) {
  const live = formatMMSS(liveSeconds);
  return (
    <div className="lg:col-span-4 surface hairline rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Today · Your floor</span>
        <span className="text-[10px] text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> LIVE</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <Stat label="Team adoption" value="18%" sub="goal: 50%" warn />
        <Stat label="Avg log time" value={live} sub="you · live tracker" mono />
        <Stat label="Calls logged today" value={String(callsLogged)} sub="team avg 0.8" up />
        <Stat label="Fields auto-filled" value={`${autoFilled}/9`} sub="manual baseline 3.2" up />
      </div>
    </div>
  );
}

function Stat({ label, value, sub, up, warn, mono }: { label: string; value: string; sub: string; up?: boolean; warn?: boolean; mono?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-3xl font-semibold num leading-none", up && "text-primary", warn && "text-warning", mono && "font-mono")}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
        {up && <ArrowUpRight className="w-3 h-3 text-primary" />} {sub}
      </div>
    </div>
  );
}

function ActiveCallCard() {
  return (
    <div className="surface hairline rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-glow opacity-60" />
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Active call · 04:12</span>
        <span>Inbound · HubSpot deal #4821</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 hairline grid place-items-center font-semibold">SK</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg leading-tight">Sarah Kowalski</div>
          <div className="text-sm text-muted-foreground">VP Revenue Ops · Northwind Logistics</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag>Series B · 220 FTE</Tag>
            <Tag>$48k ACV target</Tag>
            <Tag>Stage: Eval</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary hairline text-muted-foreground">{children}</span>;
}

function BriefHistoryTabs({ tab, setTab }: { tab: "brief" | "history"; setTab: (t: "brief" | "history") => void }) {
  return (
    <div className="surface hairline rounded-2xl p-5">
      <div className="flex items-center gap-1 mb-4 p-1 bg-muted/50 rounded-lg w-fit">
        <TabBtn active={tab === "brief"} onClick={() => setTab("brief")} icon={FileText}>Pre-call brief</TabBtn>
        <TabBtn active={tab === "history"} onClick={() => setTab("history")} icon={History}>Conversation history</TabBtn>
      </div>

      {tab === "brief" ? (
        <div className="space-y-3 animate-fade-in">
          <BriefCard icon={Building2} title="Company" body="Northwind Logistics — mid-market 3PL. Just raised $40M Series B. Expanding fleet ops to West Coast. Pain: fragmented dispatch tooling." />
          <BriefCard icon={User2} title="Contact" body="Sarah owns the rev ops stack. Former Stripe. Skeptical of new tools — burned by Salesforce rollout in 2023." />
          <BriefCard icon={Target} title="Why we fit" body="Two-way HubSpot sync (their CRM), zero-training adoption, voice capture for field reps. Compete: internal Notion + Gong." />
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {HISTORY.map((h) => (
            <div key={h.date} className="hairline rounded-xl p-3.5 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{h.title}</span>
                <span className="text-muted-foreground">{h.date}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{h.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children, icon: Icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-all", active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
      <Icon className="w-3.5 h-3.5" /> {children}
    </button>
  );
}

function BriefCard({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="hairline rounded-xl p-3.5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3.5 h-3.5 text-primary" /> {title}
      </div>
      <p className="text-sm mt-1.5 leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}

function CaptureCard({
  phase, recording, recordMs, onDown, onUp, quoteIdx,
}: {
  phase: string; recording: boolean; recordMs: number;
  onDown: () => void; onUp: () => void; quoteIdx: number;
}) {
  const seconds = (recordMs / 1000).toFixed(1);

  return (
    <div className="surface hairline rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-x-0 -top-32 h-64 bg-gradient-glow opacity-60 pointer-events-none" />

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
        <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-primary" /> Voice capture · primary</span>
        <span className="font-mono">{recording ? `REC ${seconds}s` : phase === "filling" ? "Transcribing…" : "Ready"}</span>
      </div>

      {/* Hold-to-record button */}
      <div className="flex flex-col items-center justify-center py-4 select-none">
        <div className="relative">
          {recording && <span className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring" />}
          <button
            onMouseDown={onDown}
            onMouseUp={onUp}
            onMouseLeave={() => recording && onUp()}
            onTouchStart={(e) => { e.preventDefault(); onDown(); }}
            onTouchEnd={(e) => { e.preventDefault(); onUp(); }}
            className={cn(
              "relative w-44 h-44 rounded-full grid place-items-center transition-all duration-200",
              "bg-gradient-primary glow-primary",
              recording ? "scale-105" : "hover:scale-[1.02] active:scale-100"
            )}
          >
            <div className="absolute inset-2 rounded-full border border-primary-foreground/20" />
            <Mic className="w-14 h-14 text-primary-foreground" strokeWidth={1.5} />
          </button>
        </div>
        <div className="mt-5 text-center">
          <div className="font-semibold text-lg">Hold to record</div>
          <div className="text-xs text-muted-foreground mt-1">Release to auto-fill 7 of 9 CRM fields</div>
        </div>

        {/* waveform */}
        <div className="mt-6 h-12 w-full flex items-center justify-center gap-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <span
              key={i}
              className={cn("w-1 rounded-full", recording ? "bg-primary animate-wave" : "bg-muted")}
              style={{
                height: `${recording ? 8 + ((i * 13) % 32) : 6}px`,
                animationDelay: `${(i % 10) * 60}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero quote */}
      <div className="mt-4 hairline rounded-xl p-4 bg-primary/5 border-primary/20">
        <Quote className="w-4 h-4 text-primary mb-2" />
        <p className="font-display italic text-lg leading-snug text-balance">
          "If it could just listen to my calls and fill itself out, I'd use it every day. The problem isn't the tool — it's the data entry."
        </p>
        <div className="mt-2 text-xs text-muted-foreground">— Senior AE · hypothesis source</div>
      </div>

      {/* Rotating supporting quote */}
      <div className="mt-3 text-xs text-muted-foreground/80 px-1 min-h-[32px]">
        <span key={quoteIdx} className="animate-fade-in inline-block">
          "{SUPPORTING_QUOTES[quoteIdx].q}" <span className="text-foreground/60">— {SUPPORTING_QUOTES[quoteIdx].a}</span>
        </span>
      </div>
    </div>
  );
}

function ManualFallback({ onPick, disabled }: { onPick: (o: string) => void; disabled: boolean }) {
  const opts = [
    { o: "Connected", icon: PhoneCall },
    { o: "Voicemail", icon: Voicemail },
    { o: "Booked", icon: CalendarCheck2 },
    { o: "No Answer", icon: PhoneOff },
  ];
  return (
    <div className="rounded-2xl p-4 hairline bg-card/40">
      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
        <span className="uppercase tracking-wider">Manual fallback</span>
        <span>Skip voice — log outcome only</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {opts.map(({ o, icon: I }) => (
          <button
            key={o}
            disabled={disabled}
            onClick={() => onPick(o)}
            className="group flex flex-col items-center gap-1.5 py-3 rounded-xl bg-muted/40 hairline text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <I className="w-4 h-4" />
            <span className="text-xs">{o}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AutoFillPanel({ fields, phase, reviewMode }: { fields: (Field & { shown: boolean })[]; phase: string; reviewMode: boolean }) {
  const filledCount = fields.filter((f) => f.shown && f.value).length;
  const autoCount = fields.filter((f) => f.shown && f.auto).length;

  if (reviewMode) return <PipelineReview fields={fields} phase={phase} />;

  return (
    <div className="surface hairline rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Auto-fill · 9 CRM fields
          </div>
          <div className="text-sm mt-1">
            <span className="font-semibold num text-primary">{autoCount}</span>
            <span className="text-muted-foreground"> auto-filled · </span>
            <span className="font-semibold num">{filledCount}/9</span>
            <span className="text-muted-foreground"> ready to sync</span>
          </div>
        </div>
        {phase === "done" && (
          <div className="text-xs text-success flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-full hairline border-success/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Synced to HubSpot
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {fields.map((f, i) => (
          <FieldRow key={f.key} f={f} delay={i * 30} />
        ))}
      </div>

      {phase === "filling" && (
        <div className="mt-4 h-1 rounded-full overflow-hidden bg-muted">
          <div className="h-full w-1/2 animate-shimmer" />
        </div>
      )}
    </div>
  );
}

function FieldRow({ f, delay }: { f: Field & { shown: boolean }; delay: number }) {
  const Icon = f.icon;
  return (
    <div
      className={cn(
        "rounded-xl p-3 hairline transition-all",
        f.shown ? "bg-card animate-fill-in" : "bg-muted/20 border-dashed",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
        <span className="flex items-center gap-1.5"><Icon className="w-3 h-3" /> {f.label}</span>
        {f.shown && f.auto && (
          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full hairline border-primary/20 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> auto
          </span>
        )}
        {f.shown && !f.auto && f.value && (
          <span className="text-[10px] text-muted-foreground">manual</span>
        )}
      </div>
      <div className={cn("mt-1 text-sm font-medium min-h-[20px]", !f.shown && "text-muted-foreground/40 italic")}>
        {f.shown ? (f.value || "—") : "awaiting voice…"}
      </div>
    </div>
  );
}

function PipelineReview({ fields, phase }: { fields: (Field & { shown: boolean })[]; phase: string }) {
  const get = (k: string) => fields.find((f) => f.key === k);
  const ready = phase === "done" || phase === "filling";

  return (
    <div className="surface hairline rounded-2xl p-6 border-primary/20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Pipeline Review Mode
          </div>
          <div className="text-sm text-muted-foreground mt-1">How your manager sees this in Friday's forecast call.</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Forecast confidence</div>
          <div className="text-2xl font-semibold num text-success">{ready ? "78%" : "—"}</div>
        </div>
      </div>

      {!ready ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Record a call to populate the forecast view.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <ReviewCell label="Deal" value="Northwind Logistics · #4821" />
          <ReviewCell label="Stage" value="Evaluation → Proposal" accent />
          <ReviewCell label="Outcome" value={get("outcome")?.value || "—"} />
          <ReviewCell label="Next step" value={get("next")?.value || "—"} accent />
          <ReviewCell label="Decision maker" value={get("dm")?.value || "—"} />
          <ReviewCell label="Budget signal" value={get("budget")?.value || "—"} accent />
          <ReviewCell label="Timeline" value={get("timeline")?.value || "—"} />
          <ReviewCell label="Top objection" value={get("objection")?.value || "—"} />
          <div className="col-span-2">
            <ReviewCell label="Sentiment" value={get("sentiment")?.value || "—"} accent />
          </div>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-success" /> Forecast-grade · auto-derived from voice</span>
        <span className="text-primary flex items-center gap-1">Open in HubSpot <ChevronRight className="w-3.5 h-3.5" /></span>
      </div>
    </div>
  );
}

function ReviewCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-xl p-3.5 hairline", accent ? "bg-primary/5 border-primary/20" : "bg-card")}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium leading-snug">{value}</div>
    </div>
  );
}

function RecentLog() {
  return (
    <div className="surface hairline rounded-2xl p-5 sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Recent log</div>
          <div className="text-sm mt-0.5">Your last <span className="num font-semibold">{RECENT.length}</span> calls</div>
        </div>
        <Activity className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        {RECENT.map((r) => (
          <div key={r.name} className="hairline rounded-xl p-3 hover:border-primary/30 transition-colors group cursor-default">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">{r.co}</div>
              </div>
              <OutcomePill outcome={r.outcome} />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> <span className="num font-medium text-foreground">{r.auto}</span>/9 auto</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> <span className="num font-medium text-foreground">{r.sec}s</span></span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[11px] text-muted-foreground flex items-center justify-between">
        <span>Avg time-to-log</span>
        <span className="num font-semibold text-primary">25.0s</span>
      </div>
    </div>
  );
}

function OutcomePill({ outcome }: { outcome: string }) {
  const map: Record<string, string> = {
    Connected: "text-success bg-success/10 border-success/20",
    Booked: "text-primary bg-primary/10 border-primary/20",
    Voicemail: "text-warning bg-warning/10 border-warning/20",
    "No Answer": "text-muted-foreground bg-muted/40",
  };
  return <span className={cn("text-[10px] px-2 py-0.5 rounded-full hairline whitespace-nowrap", map[outcome])}>{outcome}</span>;
}

// ============== helpers ==============

function seedFields(): Field[] {
  return [
    { key: "outcome",   label: "Outcome",       value: "", auto: false, icon: CheckCircle2 },
    { key: "next",      label: "Next step",     value: "", auto: false, icon: ChevronRight },
    { key: "dm",        label: "Decision maker", value: "", auto: false, icon: User2 },
    { key: "budget",    label: "Budget signal", value: "", auto: false, icon: Hash },
    { key: "timeline",  label: "Timeline",      value: "", auto: false, icon: Clock },
    { key: "objection", label: "Objections",    value: "", auto: false, icon: Target },
    { key: "sentiment", label: "Sentiment",     value: "", auto: false, icon: Activity },
    { key: "company",   label: "Company",       value: "", auto: false, icon: Building2 },
    { key: "contact",   label: "Contact",       value: "", auto: false, icon: User2 },
  ];
}
function mockFilled(): Field[] {
  return [
    { key: "outcome",   label: "Outcome",        value: "Connected · advanced to Proposal", auto: true,  icon: CheckCircle2 },
    { key: "next",      label: "Next step",      value: "Send security pack + book CFO intro Thu", auto: true, icon: ChevronRight },
    { key: "dm",        label: "Decision maker", value: "Marcus Chen, CFO (econ buyer)", auto: true,  icon: User2 },
    { key: "budget",    label: "Budget signal",  value: "$48k ACV approved Q2", auto: true,  icon: Hash },
    { key: "timeline",  label: "Timeline",       value: "Decision by June 15 · onboard July", auto: true,  icon: Clock },
    { key: "objection", label: "Objections",     value: "Migration risk from Pipedrive", auto: true,  icon: Target },
    { key: "sentiment", label: "Sentiment",      value: "Positive · 0.74 · engaged throughout", auto: true,  icon: Activity },
    { key: "company",   label: "Company",        value: "Northwind Logistics", auto: false, icon: Building2 }, // pre-known
    { key: "contact",   label: "Contact",        value: "Sarah Kowalski",      auto: false, icon: User2 },     // pre-known
  ];
}
function formatMMSS(s: number) {
  const m = Math.floor(s / 60).toString().padStart(1, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export default Index;
