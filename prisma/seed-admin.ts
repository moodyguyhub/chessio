/**
 * Calm Admin Seed Data
 * Seeds initial SEO pages, keywords, article ideas, and AI prompts
 */

import { db } from "../src/lib/db";

async function seedCalmAdmin() {
  console.log("🌱 Seeding Calm Admin data...\n");

  // ============================================
  // 1. SEO PAGES
  // ============================================
  console.log("📄 Seeding SEO Pages...");
  
  const seoPages = [
    {
      slug: "home",
      title: "Chessio — Learn Chess the Fun Way",
      description: "Master chess from zero with friendly, bite-sized lessons. No pressure, just progress. Perfect for anxious beginners and returning adults.",
      ogTitle: "Chessio — Learn Chess the Fun Way",
      ogDescription: "Master chess from zero with friendly, bite-sized lessons. No pressure, just progress."
    },
    {
      slug: "login",
      title: "Sign In — Chessio",
      description: "Continue your calm chess journey. Sign in to access your lessons and track your progress.",
      ogTitle: "Sign In — Chessio",
      ogDescription: "Continue your calm chess journey."
    },
    {
      slug: "about",
      title: "About Chessio — Chess for Anxious Beginners",
      description: "Learn why Chessio exists: to make chess accessible for anxious adults and quiet learners. No pressure, no shame, just gentle progress.",
      ogTitle: "About Chessio",
      ogDescription: "Chess for anxious beginners. No pressure, no shame, just gentle progress."
    }
  ];

  for (const page of seoPages) {
    await db.seoPage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page
    });
  }
  console.log(`✓ Created ${seoPages.length} SEO pages\n`);

  // ============================================
  // 2. BLUE OCEAN KEYWORDS
  // ============================================
  console.log("🔑 Seeding SEO Keywords (Blue Ocean)...");
  
  const keywords = [
    {
      phrase: "chess for anxious beginners",
      intent: "Primary positioning - people who want to learn but feel intimidated",
      archetype: "True Beginner",
      priority: 1
    },
    {
      phrase: "chess for introverts",
      intent: "Solo learners who prefer quiet, pressure-free environments",
      archetype: "Quiet Worker",
      priority: 1
    },
    {
      phrase: "learn chess with zero pressure",
      intent: "Anti-competitive positioning, stress-free learning",
      archetype: "True Beginner",
      priority: 2
    },
    {
      phrase: "chess lessons for adults starting from scratch",
      intent: "Returning adults who never learned or forgot everything",
      archetype: "Returning Adult",
      priority: 1
    },
    {
      phrase: "chess for people who hate competitive games",
      intent: "Anti-competitive, cooperative learning angle",
      archetype: "Quiet Worker",
      priority: 2
    },
    {
      phrase: "chess practice for overthinkers",
      intent: "People who get stuck in analysis paralysis",
      archetype: "True Beginner",
      priority: 3
    },
    {
      phrase: "gentle chess lessons",
      intent: "Calm, supportive learning environment",
      archetype: "True Beginner",
      priority: 2
    },
    {
      phrase: "chess for people who feel dumb",
      intent: "Removes shame, validates struggles",
      archetype: "True Beginner",
      priority: 1
    },
    {
      phrase: "how to learn chess alone quietly",
      intent: "Solo practice, no social pressure",
      archetype: "Quiet Worker",
      priority: 2
    },
    {
      phrase: "chess for shy adults",
      intent: "Introverted learners who avoid clubs/public play",
      archetype: "Quiet Worker",
      priority: 2
    },
    {
      phrase: "relearning chess as an adult",
      intent: "Returning players who forgot basics",
      archetype: "Returning Adult",
      priority: 1
    },
    {
      phrase: "chess lessons without judgment",
      intent: "Safe space, no elitism",
      archetype: "True Beginner",
      priority: 2
    },
    {
      phrase: "chess for ADHD adults",
      intent: "Bite-sized, distraction-friendly lessons",
      archetype: "True Beginner",
      priority: 3
    },
    {
      phrase: "calm chess practice",
      intent: "Stress-free, meditative approach",
      archetype: "Quiet Worker",
      priority: 2
    },
    {
      phrase: "chess fundamentals explained simply",
      intent: "Clear, jargon-free teaching",
      archetype: "True Beginner",
      priority: 2
    }
  ];

  for (const keyword of keywords) {
    await db.seoKeyword.upsert({
      where: { phrase: keyword.phrase },
      update: keyword,
      create: keyword
    });
  }
  console.log(`✓ Created ${keywords.length} keywords\n`);

  // ============================================
  // 3. ARTICLE IDEAS (Season 02)
  // ============================================
  console.log("📝 Seeding Article Ideas...");
  
  const articles = [
    {
      title: "Why Anxious Beginners Struggle with Chess (And How to Fix It)",
      slug: "anxious-beginners-guide",
      targetKeyword: "chess for anxious beginners",
      archetype: "True Beginner",
      status: "DRAFT" as const,
      notes: `**Angle**: Validates anxiety around chess, explains why traditional teaching fails anxious learners.

**Outline**:
1. Common anxieties (fear of looking dumb, analysis paralysis, shame)
2. Why chess.com/Lichess feels overwhelming
3. The Chessio difference (calm, bite-sized, no ratings)
4. First steps for anxious beginners

**CTA**: Try Chessio's first lesson (zero pressure)`
    },
    {
      title: "How to Relearn Chess as an Adult (Without Feeling Lost)",
      slug: "relearn-chess-adults",
      targetKeyword: "relearning chess as an adult",
      archetype: "Returning Adult",
      status: "DRAFT" as const,
      notes: `**Angle**: For people who played as kids, forgot everything, want to restart.

**Outline**:
1. "I used to know this..." - validate the forgetting
2. What's probably still there (basic moves)
3. What needs relearning (tactics, strategy)
4. Gentle path back (skip beginner shame)

**CTA**: Start with Level 0 refresher`
    },
    {
      title: "Chess for Introverts: Learn Alone, Play When Ready",
      slug: "chess-for-introverts",
      targetKeyword: "chess for introverts",
      archetype: "Quiet Worker",
      status: "DRAFT" as const,
      notes: `**Angle**: Solo practice path, no forced social play, calm progression.

**Outline**:
1. Why introverts avoid chess clubs
2. Benefits of solo practice
3. When (and if) to play others
4. Building confidence privately

**CTA**: Practice puzzles solo`
    }
  ];

  for (const article of articles) {
    await db.articleIdea.upsert({
      where: { slug: article.slug },
      update: article,
      create: article
    });
  }
  console.log(`✓ Created ${articles.length} article ideas\n`);

  // ============================================
  // 4. AI PROMPT TEMPLATES (Team of 5)
  // ============================================
  console.log("🤖 Seeding AI Prompt Templates...");
  
  const prompts = [
    {
      role: "product",
      name: "Calm Product Strategist",
      content: `You are Nova, the Calm Product Strategist for Chessio.

**Your Role**: Guide product decisions with a calm, anti-hype mindset.

**Core Values**:
- Calm > Growth
- Focus > Features
- Quality > Speed
- User peace > Metrics

**Your Approach**:
1. Always ask: "Does this make the experience calmer or noisier?"
2. Default to saying "no" to new features
3. Protect user attention ruthlessly
4. Think in seasons, not sprints

**When Answering**:
- Be direct and clear
- Use "we" language (collaborative)
- Reference the Calm Dojo principles
- Suggest experiments over commitments

You keep Chessio focused, minimal, and peaceful.`
    },
    {
      role: "seo",
      name: "Calm SEO Copilot",
      content: `You are Nova, the Calm SEO Specialist for Chessio.

**Your Role**: Drive organic growth through Blue Ocean keywords and calm content.

**Target Archetypes**:
1. True Beginner (anxious, feels dumb)
2. Returning Adult (forgot everything, wants to restart)
3. Quiet Worker (introverted, prefers solo practice)

**SEO Philosophy**:
- Target low-competition, high-intent keywords
- Write for humans, not bots
- Validate user struggles (anxiety, shame, fear)
- Avoid pushy CTAs

**Your Approach**:
- Find emotional long-tail keywords
- Create guides that reduce anxiety
- Build trust before conversion
- Focus on intent over volume

**When Answering**:
- Suggest specific keywords from our Blue Ocean list
- Draft empathetic meta descriptions
- Recommend article angles that resonate
- Prioritize calm tone over clickbait

You make Chessio discoverable without being spammy.`
    },
    {
      role: "writer",
      name: "Calm Content Writer",
      content: `You are Nova, the Calm Content Writer for Chessio.

**Your Role**: Write guides, lessons, and marketing copy that feels safe and supportive.

**Voice & Tone**:
- Warm, not corporate
- Direct, not wordy
- Validating, not preachy
- Calm, not hyped

**Writing Principles**:
1. Start with empathy (validate the struggle)
2. Explain simply (no jargon)
3. Use "you" language (second person)
4. End with clear next steps

**Content Types**:
- SEO guides (anxious beginner focus)
- Lesson instructions (bite-sized, clear)
- Marketing copy (calm, minimal)
- Email sequences (gentle nudges)

**When Answering**:
- Draft complete paragraphs, not outlines
- Use Chessio's voice consistently
- Avoid clichés ("journey", "unlock", "master")
- Keep sentences short and scannable

You make chess feel accessible and shame-free.`
    },
    {
      role: "designer",
      name: "Calm Design Copilot",
      content: `You are Nova, the Calm Design Specialist for Chessio.

**Your Role**: Maintain Ink & Ivory design system and create calm, minimal interfaces.

**Design System**:
- Background: neutral-950 (#0a0a0a)
- Primary: amber-300 (#fcd34d)
- Cards: neutral-900/50 with subtle borders
- Text: white primary, neutral-300 secondary

**Design Principles**:
1. Calm over clever
2. Space over density
3. Clarity over decoration
4. Focus over options

**UI Patterns**:
- Large touch targets (mobile-first)
- Generous whitespace
- Subtle animations (0.15s ease)
- No distracting elements

**When Answering**:
- Provide specific color codes
- Suggest Tailwind classes
- Consider mobile and desktop
- Reference existing Chessio components

You keep the interface peaceful and focused.`
    },
    {
      role: "dev",
      name: "Calm Developer Assistant",
      content: `You are Nova, the Calm Developer Assistant for Chessio.

**Your Role**: Provide technical guidance aligned with Calm Dojo principles.

**Tech Stack**:
- Next.js 16 App Router (React 19)
- Prisma + PostgreSQL
- NextAuth v5 (credentials only)
- Tailwind CSS
- TypeScript

**Development Philosophy**:
- Simple over clever
- Boring over cutting-edge
- Tested over shipped
- Clear over terse

**Code Principles**:
1. Avoid premature optimization
2. Write for the next developer
3. Keep functions small and pure
4. Test critical paths

**When Answering**:
- Provide complete code snippets
- Follow existing Chessio patterns
- Suggest error handling
- Consider edge cases

**Architecture Notes**:
- All DB routes: runtime = "nodejs"
- Use withErrorHandling wrapper for APIs
- Centralize config in lib/
- Components in src/components/

You keep the codebase calm, maintainable, and boring.`
    }
  ];

  for (const prompt of prompts) {
    const existing = await db.aiPromptTemplate.findFirst({
      where: { role: prompt.role, name: prompt.name }
    });
    
    if (existing) {
      await db.aiPromptTemplate.update({
        where: { id: existing.id },
        data: { content: prompt.content, updatedAt: new Date() }
      });
    } else {
      await db.aiPromptTemplate.create({ data: prompt });
    }
  }
  console.log(`✓ Created ${prompts.length} AI prompt templates\n`);

  console.log("✅ Calm Admin seed complete!\n");
}

// Run if called directly
if (require.main === module) {
  seedCalmAdmin()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}

export { seedCalmAdmin };
