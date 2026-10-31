/**
 * Marketing copy. Original text, written for ARCHIARTIX.
 *
 * ⚠ Stats and team roles below are PLACEHOLDERS — replace with
 * real figures, real client quotes (with permission) and real team members
 * before launch.
 */

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "All Projects", href: "/projects", description: "Our complete portfolio" },
      { label: "Residential", href: "/projects/residential", description: "Homes & apartments" },
      { label: "Commercial", href: "/projects/commercial", description: "Offices & retail" },
      { label: "Hospitality", href: "/projects/hospitality", description: "Hotels & restaurants" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Interior Design", href: "/services/interior-design", description: "Spaces that feel like you" },
      { label: "Architectural Design", href: "/services/architectural-design", description: "Climate-smart buildings" },
      { label: "Turnkey Execution", href: "/services/turnkey-execution", description: "Design to handover" },
    ],
  },
  { label: "Shop", href: "/shop" },
  {
    label: "About Us",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about", description: "Who we are" },
      { label: "Meet Our Team", href: "/about/team", description: "The people behind the work" },
      { label: "Mission & Vision", href: "/about/mission-vision", description: "What drives us" },
    ],
  },
  { label: "Contacts", href: "/contact" },
];

export const stats = [
  { value: 200, suffix: "+", label: "Projects delivered" },
  { value: 10, suffix: "+", label: "Years of practice" },
  { value: 64, suffix: "", label: "Districts served nationwide" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

export const processSteps = [
  {
    title: "Discovery call",
    text: "We listen first — your routines, budget, timeline and the spaces that inspire you. You leave with a clear scope and a fixed design fee.",
  },
  {
    title: "Concept & layout",
    text: "Two or three layout options, mood boards and material palettes. We refine together until the direction feels right.",
  },
  {
    title: "3D visualisation",
    text: "Photo-real renders and walkthroughs let you see and change the space before anything is built or bought.",
  },
  {
    title: "Detailed design & BOQ",
    text: "Construction drawings, specifications and a transparent bill of quantities — everything priced and approved up front.",
  },
  {
    title: "Build & handover",
    text: "Our engineers supervise the site daily, with weekly reports and quality checks, until we hand you the keys.",
  },
];

export const faqs = [
  {
    q: "How does a project with ARCHIARTIX start?",
    a: "It starts with a free discovery call. We discuss your goals, space, budget and timeline, then send a written proposal with scope, deliverables and a fixed design fee — usually within three working days.",
  },
  {
    q: "How long does an interior project take?",
    a: "A typical apartment takes 3–4 weeks to design and 8–14 weeks to execute, depending on scope and finishes. Larger homes, offices and hospitality projects follow a milestone schedule we agree on before we begin.",
  },
  {
    q: "Can you work with my budget?",
    a: "Yes. We design to your budget and show you where to invest and where to save. Every proposal includes a bill of quantities, so you see exactly where the money goes before work starts.",
  },
  {
    q: "Do you only work in Dhaka and Chattogram?",
    a: "Our studios are in Dhaka and Chattogram, but we design and deliver projects across Bangladesh. For outstation projects we combine site visits with video reviews, and local site supervision.",
  },
  {
    q: "What does 'turnkey' include?",
    a: "Design, procurement, contractor management, daily site supervision and handover — one team, one contract. You approve the design and budget; we deliver the finished space.",
  },
  {
    q: "Can I see my design before it is built?",
    a: "Always. We produce photo-realistic 3D renders and, on request, 360° / VR walkthroughs, so you can walk through your future space and request changes before construction begins.",
  },
  {
    q: "How do payments work?",
    a: "Design fees are paid in stages (on proposal, on concept approval and on final drawings). Execution is billed against agreed milestones. There are no hidden charges — every payment is tied to a delivered stage.",
  },
  {
    q: "How do I order from the shop?",
    a: "Sign in with Google, add products to your cart and check out. We confirm every order by phone, and pay on delivery is available across Bangladesh.",
  },
];

export const values = [
  { title: "Design with intent", text: "Every line, material and light fitting earns its place. We edit until only what matters remains." },
  { title: "Built for our climate", text: "Shade, airflow and monsoon-proof detailing are part of the concept — never an afterthought." },
  { title: "Radical clarity", text: "Transparent fees, priced drawings and weekly reports. You always know where your project and budget stand." },
  { title: "Craft over shortcuts", text: "We work with skilled artisans and tested suppliers, and we inspect the details others skip." },
];

export const team = [
  { role: "Principal Architect", bio: "Leads design direction and signs off every concept, drawing and detail." },
  { role: "Lead Interior Designer", bio: "Turns briefs into layouts, material palettes and finished interiors." },
  { role: "Project & Site Manager", bio: "Runs schedules, procurement and the daily site, so builds finish on time." },
  { role: "3D Visualisation Lead", bio: "Creates the renders and walkthroughs that let you see it before it is built." },
];

export const mission =
  "To design and build spaces that make everyday life in Bangladesh calmer, brighter and more beautiful — with honest budgets, craft we are proud of and a process our clients can trust.";

export const vision =
  "To be the studio Bangladesh turns to when it wants architecture and interiors that are rooted in place, designed with art and delivered with precision.";

export const story = [
  "ARCHIARTIX began with a simple belief: art and architecture should not be separate conversations. A building is a canvas for light, texture and proportion; an interior is where that art meets daily life.",
  "Today we are a team of architects, interior designers and site engineers working across Bangladesh — from city apartments to resort suites. We stay close to every project, from the first sketch to the last coat of paint.",
  "Alongside our design practice we run a small shop of architecture and design products we use and love, so clients can bring a piece of the studio home.",
];
