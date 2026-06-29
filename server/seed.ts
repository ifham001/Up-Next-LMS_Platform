/**
 * Seed script — inserts a set of published courses (with sections, so the
 * lessons count resolves) so the catalog, course cards, and detail pages have
 * real content. Idempotent: skips courses whose title already exists.
 *
 * Run with: npm run seed   (from the server/ directory)
 */
import { dbDrizzle, db } from "./src/config/pg.db";
import { course, section, video, sectionItem } from "./src/schema/index";
import { and, eq, inArray } from "drizzle-orm";

type Domain =
  | "Information Technology"
  | "Business"
  | "Language"
  | "Marketing"
  | "Management"
  | "Other";

interface SeedCourse {
  title: string;
  tagline: string;
  description: string;
  price: number;
  domain: Domain;
  rating: number;
  total_reviews: number;
  total_enrollments: number;
  course_duration: number; // minutes
  requirements: string[];
  benefits: string[];
  sections: string[]; // section titles → each becomes a lesson in the count
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const thumb = (title: string) =>
  `https://picsum.photos/seed/upnext-${slug(title)}/640/400`;

const COURSES: SeedCourse[] = [
  {
    title: "Python for Data Science",
    tagline: "Go from zero to confident with real datasets",
    description:
      "Learn Python the practical way — pandas, NumPy, and real analysis projects you can put in a portfolio.",
    price: 1499,
    domain: "Information Technology",
    rating: 5,
    total_reviews: 1240,
    total_enrollments: 8420,
    course_duration: 690,
    requirements: ["A laptop with internet", "No prior coding needed"],
    benefits: ["Clean and analyze real data", "Build 3 portfolio projects", "Understand pandas deeply"],
    sections: ["Getting set up", "Python fundamentals", "Working with pandas", "Visualizing data", "Capstone project"],
  },
  {
    title: "Modern Web Development",
    tagline: "Build production apps with Next.js and TypeScript",
    description:
      "A hands-on path through React, Next.js, and TypeScript — shipping a real full-stack app by the end.",
    price: 1799,
    domain: "Information Technology",
    rating: 5,
    total_reviews: 980,
    total_enrollments: 6310,
    course_duration: 840,
    requirements: ["Basic HTML and JavaScript", "Comfort with the command line"],
    benefits: ["Ship a full-stack app", "Master React and Next.js", "Write type-safe code"],
    sections: ["JavaScript refresher", "React essentials", "Next.js routing", "Data and APIs", "Deploying to production"],
  },
  {
    title: "UX Design Foundations",
    tagline: "Design products people actually understand",
    description:
      "Research, wireframing, and usability — the core craft of user experience, taught through real critiques.",
    price: 1299,
    domain: "Marketing",
    rating: 4,
    total_reviews: 640,
    total_enrollments: 4180,
    course_duration: 520,
    requirements: ["Curiosity about people", "Any design tool (Figma recommended)"],
    benefits: ["Run user interviews", "Wireframe with confidence", "Test and iterate designs"],
    sections: ["What UX really is", "User research", "Wireframing", "Usability testing"],
  },
  {
    title: "Public Speaking that Lands",
    tagline: "Speak so people remember what you said",
    description:
      "Structure, delivery, and nerves — a practical system for talks, pitches, and meetings that connect.",
    price: 899,
    domain: "Management",
    rating: 5,
    total_reviews: 410,
    total_enrollments: 3025,
    course_duration: 300,
    requirements: ["Willingness to practice out loud"],
    benefits: ["Structure any talk", "Manage stage nerves", "Hold an audience"],
    sections: ["Finding your message", "Structuring a talk", "Delivery and presence", "Handling Q&A"],
  },
  {
    title: "Advanced Excel for Analysts",
    tagline: "Turn spreadsheets into real decisions",
    description:
      "Pivot tables, Power Query, and dashboards — the spreadsheet skills that make analysts indispensable.",
    price: 1099,
    domain: "Business",
    rating: 4,
    total_reviews: 720,
    total_enrollments: 5140,
    course_duration: 460,
    requirements: ["Excel installed", "Basic familiarity with spreadsheets"],
    benefits: ["Build dynamic dashboards", "Automate with Power Query", "Master pivot tables"],
    sections: ["Formulas that scale", "Pivot tables", "Power Query", "Dashboards"],
  },
  {
    title: "Brand Marketing Strategy",
    tagline: "Build a brand people choose on purpose",
    description:
      "Positioning, messaging, and channels — how strong brands are built and grown, with real case studies.",
    price: 1399,
    domain: "Marketing",
    rating: 4,
    total_reviews: 530,
    total_enrollments: 3680,
    course_duration: 540,
    requirements: ["An interest in brands and growth"],
    benefits: ["Position any product", "Write sharper messaging", "Plan a channel strategy"],
    sections: ["Positioning", "Messaging", "Channels", "Measuring brand"],
  },
  {
    title: "Conversational Spanish",
    tagline: "Hold a real conversation in 8 weeks",
    description:
      "Practical Spanish for travel and work — vocabulary, grammar, and speaking drills you can use immediately.",
    price: 999,
    domain: "Language",
    rating: 5,
    total_reviews: 860,
    total_enrollments: 6920,
    course_duration: 600,
    requirements: ["No prior Spanish needed"],
    benefits: ["Order, ask, and chat", "Build everyday vocabulary", "Sound natural sooner"],
    sections: ["First conversations", "Everyday vocabulary", "Past and future", "Speaking fluently"],
  },
  {
    title: "Product Management Essentials",
    tagline: "Ship the right thing, not just things",
    description:
      "Discovery, prioritization, and roadmaps — how product managers decide what to build and why.",
    price: 1599,
    domain: "Management",
    rating: 5,
    total_reviews: 470,
    total_enrollments: 2890,
    course_duration: 580,
    requirements: ["Some experience on a product team helps"],
    benefits: ["Prioritize with frameworks", "Run discovery", "Build a roadmap"],
    sections: ["The PM role", "Discovery", "Prioritization", "Roadmapping", "Working with engineering"],
  },
  {
    title: "Photography Basics",
    tagline: "Take photos you're proud of with any camera",
    description:
      "Light, composition, and editing — the fundamentals that turn snapshots into photographs.",
    price: 799,
    domain: "Other",
    rating: 4,
    total_reviews: 350,
    total_enrollments: 4470,
    course_duration: 360,
    requirements: ["Any camera, even a phone"],
    benefits: ["Understand light", "Compose strong shots", "Edit with intent"],
    sections: ["Exposure basics", "Composition", "Working with light", "Editing"],
  },
];

const PREVIEW_VIDEO =
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";

/**
 * Real, reliable, CORS-enabled (Access-Control-Allow-Origin: *) sample MP4s.
 * These are verified to return 200 + video/mp4 with CORS headers, so the player
 * can stream them AND generate canvas seek-preview thumbnails without tainting.
 * One is picked at random per lesson.
 */
const VIDEO_POOL: { url: string; duration: number }[] = [
  { url: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4", duration: 596 },
  { url: "https://cdn.jsdelivr.net/gh/mediaelement/mediaelement-files/big_buck_bunny.mp4", duration: 60 },
  { url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", duration: 30 },
  { url: "https://download.samplelib.com/mp4/sample-5s.mp4", duration: 5 },
  { url: "https://download.samplelib.com/mp4/sample-10s.mp4", duration: 10 },
  { url: "https://download.samplelib.com/mp4/sample-15s.mp4", duration: 15 },
  { url: "https://download.samplelib.com/mp4/sample-20s.mp4", duration: 20 },
  { url: "https://download.samplelib.com/mp4/sample-30s.mp4", duration: 30 },
];

const pickVideo = () => VIDEO_POOL[Math.floor(Math.random() * VIDEO_POOL.length)];

/**
 * For a set of sections, create ONE video row + ONE matching section_item row
 * (content_type 'video') per section, so each lesson is playable. The
 * section_item.item_id points at the new video.id, which the player resolves to
 * video.url. Each section gets a randomly chosen sample video.
 */
async function seedVideosForSections(
  sections: { id: string; title: string; section_number: number }[]
) {
  for (const s of sections) {
    const sample = pickVideo();

    const [vid] = await dbDrizzle
      .insert(video)
      .values({
        title: s.title,
        description: `Sample lesson video for "${s.title}".`,
        section_id: s.id,
        url: sample.url,
      })
      .returning({ id: video.id });

    await dbDrizzle.insert(sectionItem).values({
      section_id: s.id,
      item_id: vid.id,
      content_type: "video",
      duration: sample.duration,
      order: s.section_number,
      title: s.title,
    });
  }
}

/**
 * Idempotent back-fill for courses that already exist in the DB (e.g. the 9
 * previously seeded ones). For each course's sections that don't yet have a
 * 'video' section_item, create the video + section_item so the lesson plays.
 * Re-running is a no-op once every section already has a video.
 */
async function backfillVideos(): Promise<number> {
  let coursesTouched = 0;

  const allCourses = await dbDrizzle
    .select({ id: course.id, title: course.title })
    .from(course);

  for (const c of allCourses) {
    const sections = await dbDrizzle
      .select({
        id: section.id,
        title: section.title,
        section_number: section.section_number,
      })
      .from(section)
      .where(eq(section.course_id, c.id));

    if (sections.length === 0) continue;

    const sectionIds = sections.map((s) => s.id);

    // Which of these sections already have a 'video' section_item?
    const existingVideoItems = await dbDrizzle
      .select({ section_id: sectionItem.section_id })
      .from(sectionItem)
      .where(
        and(
          inArray(sectionItem.section_id, sectionIds),
          eq(sectionItem.content_type, "video")
        )
      );

    const haveVideo = new Set(existingVideoItems.map((r) => r.section_id));
    const missing = sections.filter((s) => !haveVideo.has(s.id));

    if (missing.length === 0) continue;

    await seedVideosForSections(missing);
    coursesTouched++;
    console.log(`   ↺ back-filled ${missing.length} video(s) for: ${c.title}`);
  }

  return coursesTouched;
}

async function seed() {
  console.log("🌱 Seeding courses...");
  let inserted = 0;
  let skipped = 0;

  for (const c of COURSES) {
    const existing = await dbDrizzle
      .select({ id: course.id })
      .from(course)
      .where(eq(course.title, c.title));

    if (existing.length > 0) {
      skipped++;
      console.log(`   • skip (exists): ${c.title}`);
      continue;
    }

    const [row] = await dbDrizzle
      .insert(course)
      .values({
        title: c.title,
        tagline: c.tagline,
        description: c.description,
        price: c.price,
        thumbnail: thumb(c.title),
        status: "published",
        domain: c.domain,
        requirements: c.requirements,
        benefits: c.benefits,
        rating: c.rating,
        total_reviews: c.total_reviews,
        total_enrollments: c.total_enrollments,
        course_duration: c.course_duration,
        preview_video: PREVIEW_VIDEO,
        preview_video_duration: 120,
      })
      .returning({ id: course.id });

    const insertedSections = await dbDrizzle
      .insert(section)
      .values(
        c.sections.map((title, i) => ({
          title,
          description: `${title} — part of ${c.title}.`,
          course_id: row.id,
          section_number: i + 1,
          section_status: "completed" as const,
        }))
      )
      .returning({
        id: section.id,
        title: section.title,
        section_number: section.section_number,
      });

    await seedVideosForSections(insertedSections);

    inserted++;
    console.log(`   ✓ ${c.title} (${c.sections.length} sections, +videos)`);
  }

  // Back-fill: any already-seeded (skipped) course that has sections but no
  // 'video' section_items yet gets videos + section_items for its sections.
  const backfilled = await backfillVideos();

  console.log(
    `\n✅ Done. Inserted ${inserted}, skipped ${skipped}, back-filled videos for ${backfilled} course(s).`
  );
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
