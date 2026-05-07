# LLM Council Skill

The LLM Council is a decision-making framework that routes questions through five independent AI advisors with distinct thinking styles. Each advisor analyzes the question independently, peers review all responses anonymously, and a chairman synthesizes findings into a final verdict.

## Trigger Phrases

**Mandatory triggers:** "council this," "run the council," "war room this," "pressure-test this," "stress-test this," "debate this"

**Strong triggers** (when combined with genuine tradeoffs): "should I X or Y," "which option," "what would you do," "is this the right move," "validate this," "get multiple perspectives," "I can't decide," "I'm torn between"

**Do NOT trigger** on simple factual lookups, yes/no questions, or casual requests without meaningful stakes.

## The Five Advisors

1. **The Contrarian** — Actively searches for fatal flaws, missing elements, and failure points. Provides critical perspective without pessimism.

2. **The First Principles Thinker** — Questions underlying assumptions and rebuilds problems from fundamentals. Often identifies that the wrong question is being asked.

3. **The Expansionist** — Identifies overlooked upside potential, bigger possibilities, and undervalued opportunities without focusing on risk.

4. **The Outsider** — Brings zero domain expertise and catches blind spots experts miss through fresh perspective and plain-language analysis.

5. **The Executor** — Focuses exclusively on implementation feasibility and concrete first steps, ignoring theory and strategy.

## Session Workflow

### Step 1: Frame the Question
- Scan workspace for relevant context files (CLAUDE.md, memory/ folders, referenced documents)
- Consolidate the user's question with discovered context
- Create a framing that includes core decision, relevant context, and stakes
- Save the framed question for the transcript

### Step 2: Convene the Council
Spawn all five advisors simultaneously. Each receives:
- Their advisor identity and thinking style
- The framed question with full context
- Instructions to respond independently without hedging (150-300 words each)

### Step 3: Peer Review
Anonymize responses as A through E (randomized assignment). Spawn five reviewer sub-agents. Each reviews all five responses and answers:
1. Which response is strongest and why?
2. Which has the biggest blind spot?
3. What did ALL responses collectively miss?

### Step 4: Chairman Synthesis
The chairman receives all advisor responses (de-anonymized), peer reviews, and the original question. Produces final verdict with five sections:

- **Where the Council Agrees** — High-confidence convergent points
- **Where the Council Clashes** — Genuine disagreements explained
- **Blind Spots the Council Caught** — Insights from peer review round
- **The Recommendation** — Clear, actionable answer (not hedged)
- **The One Thing to Do First** — Single concrete next step

### Step 5: Present Verdict
Display the complete verdict in chat using markdown formatting (no HTML reports or files). Keep output scannable with bullet points.

### Step 6: Save Transcript
Optional. Save to `council-transcript-[timestamp].md` only if significant for future reference.

## When to Use the Council

**Good council questions** involve genuine uncertainty with high costs for wrong decisions:
- Pricing and business structure choices
- Positioning decisions
- Major pivots or direction changes
- Content/copy quality assessment
- Hiring versus building tradeoffs

**Not appropriate** for factual lookups, creative generation tasks, summarization, or questions with single correct answers.

## Key Principles

- Spawn all advisors in parallel to avoid sequential influence
- Anonymize peer review responses to prevent deference to certain styles
- Chairman can override majority if reasoning is strongest
- Avoid counciling trivial questions
- Present clear recommendations without hedging or false balance
