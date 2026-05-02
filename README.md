# Pulse

**A voice-first capture layer that rescues CRM adoption without replacing the CRM.**

> "If it could just listen to my calls and fill itself out, I'd use it every day. The problem isn't the tool — it's the data entry."
> — Senior AE, the user we built this for

---

## TL;DR

A $2M internal CRM was stalled at 18% adoption. The CEO was one all-hands away from buying Gong. The CTO wouldn't allow replacement. **Pulse is the layer that goes on top** — voice-first call capture with auto-filled CRM fields, designed to collapse 4.5 minutes of typing into 30 seconds of talking.

This repo contains the working prototype, the prompt that produced it, and the validation framework that decides whether the hypothesis lives or dies.

🔗 **Live prototype:** _https://preview--call-whisper-82.lovable.app/?__lovable_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidklNMTIwR0xydVo3c2dkTmhtNnN1dkplSm83MyIsInByb2plY3RfaWQiOiI4NTEyNGYyMC02NDNlLTQ5MjMtOTk0Yi01Y2ZiNDBlMzlkNzMiLCJhY2Nlc3NfdHlwZSI6InByb2plY3QiLCJpc3MiOiJsb3ZhYmxlLWFwaSIsInN1YiI6Ijg1MTI0ZjIwLTY0M2UtNDkyMy05OTRiLTVjZmI0MGUzOWQ3MyIsImF1ZCI6WyJsb3ZhYmxlLWFwcCJdLCJleHAiOjE3NzgzNTM0ODgsIm5iZiI6MTc3Nzc0ODY4OCwiaWF0IjoxNzc3NzQ4Njg4fQ.Wm2PB1qezv-lBXAovhuAt4ZyYV6i05O40Pa8gRq8MkFfzGGtpFVTsmF0VhI18Xr5iydG1N7rvuAuljU3FNDuLbMAPbIjMCA1VsOAmQNZY5gzC6F98r-vYRPGgbv172PZoyzp8tEB9FRcCdkULHUaH5S9iO8CJjFRhBOO72CbKUg83z4MLAhVsJw1bOelGIbPKsrgoJ0-EVnUVMaYT9uQQaobWwo5Bouk_AAqpscr8CAl4Yi3usigV9cLstkbnesu5U3uG4-zbnG3k-83W0xqFC224Khgb2Avp-ZFpheGiYZQUNf4sMdtw3pAiLHpnon9vl8RNwX_-yjgYNbnPzbjJG38vY7ntEipqIAWeq0-lTyTgLLpPRQosWFcLjjgzz6cxXL73FPs2m2uOffqX_9rfzeLojgSLLYZveE6k9JERU7EOTg9s9roVQ5ehcdtMD2zUbP-B_BanVo13Us1FiwMgsMlW5f4rAG-q95eqC4l01sbIYi4NuUy3ofZjWXIiKIXWQMukS0F6RFshYe4BRsGJP1D7L68lazYAlwg32GH79thSSMLL1wfUvpQ538GAP2GGVtskcEnHfvdB5kEOrl4U6hCSNr1K2c70rzd96pfEr45fQlUxuesdeJw7xS7NSldg0aZSQyGHu5Qa_XelmccwdDAMaSKlGq94bK2y4ml-sw_

---

## The Problem

| Metric | Reality |
|---|---|
| CRM adoption rate | **18%** weekly active users (target: 50%) |
| Daily active reps | 11 of 200 |
| Avg time to log a call | 4.5 minutes |
| Calls logged per rep per day | 0.8 (most go unlogged) |
| Fields completed per entry | 3.2 of 9 required |
| Annual rep turnover | 34% (institutional knowledge walks out the door) |
| Bulk-update behavior | 67% of logging happens the night before quarterly reviews |

Reps prefer Google Docs and text-messaging themselves notes. Three rounds of training had near-zero attendance. The data confirms the diagnosis: **friction, not motivation, is the blocker.**

---

## The Hypothesis

> **If** we reduce call logging to a one-tap voice-note capture that auto-fills CRM fields,
> **then** daily logged calls per rep increase from **0.8 → 3+**,
> **because** the 18% who already adopt prove that value isn't the blocker — the 4.5-minute, 9-field cost per call is.

| | |
|---|---|
| **Risk Type** | Usability |
| **Fidelity** | Clickable flow (not a dashboard) |
| **Validated If** | A rep completes a call log in under 30 seconds **AND** the captured data renders as forecast-grade in Pipeline Review Mode |

---

## The Kill Switch

The single assumption that, if wrong, kills the entire concept:

> **Reps' voice notes don't produce forecast-grade data.**
> If captured calls turn out to be too thin or unstructured to drive a pipeline review, faster entry is irrelevant — the CEO's Gong instinct wins, and a layer can't save the existing CRM.

To test this directly, the prototype includes a **Pipeline Review Mode** toggle that re-renders any logged call as a sales manager would see it during a forecast meeting. If that view looks empty, the hypothesis dies fast.

---

## What We Built

A clickable flow where a sales rep can:

1. **View pre-call context** — company, contact, talking points, prior conversations
2. **Hold to record** a voice note (mocked transcription)
3. **Watch 7 of 9 CRM fields auto-fill** in real time — outcome, next step, decision maker, budget signal, timeline, objections, sentiment
4. **Confirm and save in under 30 seconds** with a "Saved to HubSpot" confirmation
5. **Toggle Pipeline Review Mode** to verify the captured data is actually forecast-grade

### Screenshots

> Add screenshots to a `/docs/screenshots/` folder and reference them here.

```
/docs/screenshots/
  ├── 01-capture-card.png      ← The hero: Hold to record + hypothesis quote
  ├── 02-auto-fill-panel.png   ← 7/9 fields populating from voice
  ├── 03-pre-call-brief.png    ← Account context tab
  └── 04-pipeline-review.png   ← The kill switch test
```

---

## The Prompt

The full prompt used to generate this prototype in [Lovable](https://lovable.dev). Reusable as a template for any "internal tool with low adoption" scenario — swap the metrics, quotes, and constraints for your own.

````markdown
CONTEXT:

You're a Senior PM at a mid-market SaaS company. $45M ARR, Series C, 
200-person sales team across 3 offices + remote. The internal CRM 
note-taking tool has stalled at 18% adoption — reps prefer Google 
Docs and text messages. With 34% annual turnover, institutional 
knowledge walks out the door every quarter. The CEO is one all-hands 
away from buying Gong. The CTO won't allow CRM replacement; any 
solution must LAYER ON TOP of the existing system. The sales team 
will not attend training.

Real user quotes (use verbatim in the UI where indicated below):

★ HERO QUOTE — feature prominently inside the Capture card:
"If it could just listen to my calls and fill itself out, I'd use 
it every day. The problem isn't the tool — it's the data entry." 
— Senior AE

SUPPORTING QUOTES — rotate in onboarding/empty states:
- "By the time I open the CRM, find the right contact, click through 
  three screens, and type my notes, I've forgotten half of what was 
  said." — Senior AE
- "I just text myself after calls and paste it into a Google Doc." 
  — SDR
- "I used it for a week when I started. Then I realized nobody else 
  on the team uses it either, so why bother?" — New hire
- "We spent $180K building this tool. 18% adoption. I need to either 
  fix it or justify buying Gong to the board." — VP Sales

Quantitative reality (display verbatim in the top-right stat card):
- Team adoption: 18% (goal: 50%)
- Avg log time: 4.5 min (you: live tracker)
- Calls logged today: [user count] vs team avg 0.8
- Fields auto-filled: [count] / 9 per entry (manual baseline: 3.2)

REFERENCE:
Match this aesthetic: dark theme (near-black #0F1018 background), 
coral/orange accent (#FF6B47) for primary actions and key numbers, 
soft 1px borders, generous spacing. "Hold to record" is the hero. 
Outcome chips are secondary fallback.

CONSTRAINTS:

HYPOTHESIS: Reducing call logging to a one-tap voice capture with 
auto-filled CRM fields will increase daily logged calls per rep from 
0.8 to 3+.

RATIONALE: The 18% who adopt prove value isn't the blocker — friction 
is. 4.5 minutes and 9 fields per call is the real cost. Collapse the 
cost, behavior follows.

KILL SWITCH: Hypothesis fails if captured voice notes don't produce 
forecast-grade data. To test this directly, build a "Pipeline Review 
Mode" toggle that re-renders the same logged call as a manager would 
see it in a forecast meeting. If that view looks thin, the hypothesis 
dies and the CEO's Gong instinct wins.

RISK TYPE: Usability
FIDELITY: Clickable flow (not a dashboard, not an analytics view)
VALIDATED IF: A rep completes a call log in under 30 seconds AND the 
captured data renders as forecast-grade in Pipeline Review Mode.

REQUIRED UI ELEMENTS:
1. Hero header: "Log a call in 30 seconds." Voice in. Structured CRM 
   out. Reps stop typing — managers stop guessing.
2. Stat header (top right): 4-metric card with the verbatim numbers 
   above
3. Pipeline Review Mode toggle in the top nav
4. Active call card with contact details
5. Voice Capture as PRIMARY: large "Hold to record" button with 
   mocked waveform + live counter on press
6. Hypothesis quote card inside Capture, featuring the hero AE quote
7. Manual fallback BELOW voice: 4 outcome chips (Connected, Voicemail, 
   Booked, No Answer) — visually de-emphasized
8. Auto-fill panel post-recording: animate 7 of 9 CRM fields filling 
   from a mocked transcription (Outcome, Next step, Decision maker, 
   Budget signal, Timeline, Objections, Sentiment)
9. "Saved to HubSpot in [n]s" confirmation toast
10. Recent log sidebar: 5-7 past calls showing auto-fill count + 
    time-to-log per entry
11. Pre-call brief tab: Company / Contact / Why we fit cards
12. Conversation history tab: prior call transcripts

DO NOT BUILD:
- Login, signup, or auth screens
- Settings, profile, admin, or billing pages
- A generic CRM dashboard with bar charts
- A standalone analytics view
- Onboarding tutorials or training flows (reps won't attend training)
- Anything that replaces HubSpot/Salesforce — we LAYER on top

OUTPUT:
A clickable web app where a sales rep can:
1. View pre-call context for an active call
2. Hold to record a voice note (mocked transcription is fine)
3. Watch CRM fields auto-fill in real time
4. Confirm and save in under 30 seconds
5. Toggle Pipeline Review Mode to verify the captured data is 
   forecast-grade

This prototype tests whether voice-first capture with auto-fill 
increases logged calls per rep from 0.8 to 3+, and whether the 
resulting data is usable in a sales forecast meeting.
````

---

## How to Run Locally

This project was built with [Lovable](https://lovable.dev) and exported to GitHub.

```bash
# Clone
git clone <this-repo-url>
cd <repo-name>

# Install
npm install

# Run dev server
npm run dev
```

Or open the project directly in Lovable to continue iterating with prompts.

---

## Built With

- **[Lovable](https://lovable.dev)** — AI-native prototyping
- **React + Vite** — Generated stack
- **Tailwind CSS** — Styling
- **TypeScript** — Type safety

---

## About This Project

Built as the Module 2 deliverable for **[Product School's Vibe Coding Certification](https://productschool.com)**. The course is structured around a "Confidence Line" — the idea that prototypes should be used to systematically kill ambiguity and replace it with evidence, rather than to ship polished features.

This prototype is designed to be a **tool, not a toy**: every UI element exists to test a specific assumption in the hypothesis above, and the kill switch is built into the product itself via Pipeline Review Mode.

---

## License

Prototype — not licensed for production use. The framework, prompt, and validation approach are free to adapt.
