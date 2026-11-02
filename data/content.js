/* =========================================================
   SCRIED CONTENT
   Schools, opportunities, sessions and testimonials.
   Edit this file to change what the site shows.
   Opportunities added from the staff pages are saved on top of these.
   ========================================================= */
export const SCRIED_CONFIG = {
  email: "hello@scried.com",
  whatsapp: "2340000000000" // country code, no + or spaces
};
export const SCRIED_LEVELS = [
  ["100", "100 level"],
  ["200", "200 level"],
  ["300", "300 level"],
  ["400", "400 level"],
  ["500", "500 level"],
  ["600", "600 level"],
  ["ND", "ND"],
  ["HND", "HND"],
  ["NCE", "NCE"],
  ["GRAD", "Graduate"],
  ["PG", "Postgraduate"]
];
export const SCRIED_AGES = [
  ["u18", "Under 18"],
  ["18-21", "18–21"],
  ["22-25", "22–25"],
  ["26-30", "26–30"],
  ["31+", "31 and above"]
];
export const SCRIED_TYPES = [
  ["free_tool", "Free tool"],
  ["scholarship", "Scholarship"],
  ["internship", "Internship"],
  ["fellowship", "Fellowship"],
  ["competition", "Competition"],
  ["training", "Training"],
  ["grant", "Grant"],
  ["job", "Job"]
];
export const SCRIED_OUTCOMES = [
  ["finished", "I finished it / I'm using it"],
  ["selected", "I was selected / accepted"],
  ["not_selected", "I applied but wasn't selected"],
  ["dropped", "I started but didn't finish"]
];
// id, name, short name, state, partner (we've worked with them)
export const SCRIED_SCHOOLS = [
  ["tu", "Tansian University", "TU", "Anambra", true],
  ["coou", "Chukwuemeka Odumegwu Ojukwu University", "COOU", "Anambra", true],
  ["oou", "Olabisi Onabanjo University", "OOU", "Ogun", true],
  ["unizik", "Nnamdi Azikiwe University", "UNIZIK", "Anambra", false],
  ["uniport", "University of Port Harcourt", "UNIPORT", "Rivers", false],
  ["rsu", "Rivers State University", "RSU", "Rivers", false],
  ["unilag", "University of Lagos", "UNILAG", "Lagos", false],
  ["lasu", "Lagos State University", "LASU", "Lagos", false],
  ["ui", "University of Ibadan", "UI", "Oyo", false],
  ["unn", "University of Nigeria, Nsukka", "UNN", "Enugu", false],
  ["oau", "Obafemi Awolowo University", "OAU", "Osun", false],
  ["abu", "Ahmadu Bello University", "ABU", "Kaduna", false],
  ["uniben", "University of Benin", "UNIBEN", "Edo", false],
  ["futo", "Federal University of Technology, Owerri", "FUTO", "Imo", false],
  ["futa", "Federal University of Technology, Akure", "FUTA", "Ondo", false],
  ["cu", "Covenant University", "CU", "Ogun", false],
  ["yabatech", "Yaba College of Technology", "YABATECH", "Lagos", false],
  ["nekede", "Federal Polytechnic Nekede", "NEKEDE", "Imo", false],
  ["auchi", "Auchi Polytechnic", "AUCHIPOLY", "Edo", false],
  ["fcetumunze", "Federal College of Education (Technical), Umunze", "FCET UMUNZE", "Anambra", false]
].map(([id, name, short, state, partner]) => ({ id, name, short, state, partner }));
export const SCRIED_OPPORTUNITIES = [
  {
    id: "google-ai-plus",
    title: "12 months of Google AI Plus, free for students",
    org: "Google",
    type: "free_tool",
    summary: "Gemini with higher limits, Deep Research, practice quizzes and 400GB of storage, free for a year. Worth ₦92,400.",
    description: [
      "Google is giving students at accredited Nigerian universities, polytechnics and colleges of education 12 months of Google AI Plus at no cost. The offer is worth ₦92,400.",
      "You get roughly double the usage limits in the Gemini app, Deep Research for term papers and projects, Gemini Live for real-time voice conversations, custom practice quizzes, unlimited file uploads and 400GB of Google cloud storage.",
      "Students who claimed the offer last academic year can renew for another 12 months after verifying their student status again. Google says student and classroom data from this program won't be used to train its AI models.",
      "After the free year, the plan can renew as a paid subscription unless you cancel. Check the terms when you sign up and set a reminder before your year ends."
    ],
    eligibility: "Students aged 18 and above, currently enrolled at an accredited Nigerian university, polytechnic or college of education",
    location: "Nigeria",
    deadline: null,
    link: "https://gemini.google.com/students",
    steps: [
      "Sign in with a personal Gmail you'll keep after school.",
      "Verify that you're a student. Google uses SheerID: enter your school and your name exactly as they appear on your school records.",
      "If asked, upload a clear document showing you're currently enrolled.",
      "Activate the plan to start your free 12 months.",
      "Come back to Scried and mark it complete with a screenshot showing the plan is active."
    ],
    verified: true,
    certificate: false,
    partner: "Google for Education, Nigeria"
  }
];
/* Sample opportunities, only added when demo data is loaded. Delete before launch. */
export const SCRIED_SAMPLE_OPPORTUNITIES = [
  {
    id: "sample-solar-bootcamp",
    sample: true,
    title: "Sample: Solar installation bootcamp",
    org: "Sample training partner",
    type: "training",
    summary: "Sample listing to show how trainings appear. Delete before launch.",
    description: ["This is a sample opportunity created for the prototype demo.", "Delete it from the staff pages before launch."],
    eligibility: "Engineering students",
    location: "Ogun State",
    deadlineInDays: 6,
    link: "https://example.com",
    steps: ["Fill the official form.", "Attend the orientation."],
    verified: false,
    certificate: true,
    partner: ""
  },
  {
    id: "sample-data-internship",
    sample: true,
    title: "Sample: Data analysis internship",
    org: "Sample company",
    type: "internship",
    summary: "Sample listing to show how internships appear. Delete before launch.",
    description: ["This is a sample opportunity created for the prototype demo.", "Delete it from the staff pages before launch."],
    eligibility: "300 level and above, any numerate course",
    location: "Port Harcourt / Hybrid",
    deadlineInDays: 24,
    link: "https://example.com",
    steps: ["Apply on the company site."],
    verified: false,
    certificate: true,
    partner: ""
  }
];
/* Programs Scried has delivered.
   photos: put files in an "images" folder and list them, e.g. ["images/coou-1.jpg"]
   Empty fields are hidden. */
export const SCRIED_SESSIONS = [
  {
    id: "tansian-ai",
    school: "tu",
    unit: "Centre for Entrepreneurship",
    title: "Designing and implementing AI",
    field: "Artificial intelligence",
    date: "",
    duration: "",
    participants: null,
    photos: [],
    highlights: [],
    summary:
      "Working with the Centre for Entrepreneurship, we designed and delivered a practical course on artificial intelligence, focused on how students can use AI to learn, build and start businesses."
  },
  {
    id: "coou-ai",
    school: "coou",
    unit: "Centre for Entrepreneurship",
    title: "Designing and implementing AI",
    field: "Artificial intelligence",
    date: "",
    duration: "",
    participants: null,
    photos: [],
    highlights: [],
    summary:
      "With the Centre for Entrepreneurship, we designed and delivered a practical AI course that gave students hands-on experience with the tools shaping the future of work."
  },
  {
    id: "oou-renewable-energy",
    school: "oou",
    unit: "Department of Mechanical Engineering",
    title: "Renewable energy training",
    field: "Renewable energy",
    date: "",
    duration: "",
    participants: null,
    photos: [],
    highlights: [],
    summary:
      "Alongside the Department of Mechanical Engineering, we ran hands-on renewable energy training to prepare engineering students for one of the fastest-growing industries in Africa."
  }
];
/* What participants said. kind: video | x | linkedin | quote
   video: paste a YouTube link in url, or a path to an MP4 in video
   x / linkedin: paste the post link in url and the words in quote
   featured: also show on the home page.
   The three below are SAMPLES: replace with real participants. */
export const SCRIED_TESTIMONIALS = [
  {
    session: "coou-ai",
    kind: "quote",
    sample: true,
    featured: true,
    name: "Sample participant",
    role: "Replace with a real participant, course and school",
    quote: "Replace this with a real quote from a participant's X or LinkedIn post. Add the post link so visitors can see the original.",
    url: ""
  },
  {
    session: "tansian-ai",
    kind: "video",
    sample: true,
    featured: true,
    name: "Sample video",
    role: "Paste a YouTube link or add an MP4 in data.js",
    quote: "Video testimonials appear here with the participant's name and course.",
    url: ""
  },
  {
    session: "oou-renewable-energy",
    kind: "linkedin",
    sample: true,
    featured: true,
    name: "Sample LinkedIn post",
    role: "Replace with a real participant",
    quote: "LinkedIn and X posts show the participant's words with a link to the original post.",
    url: "https://www.linkedin.com/"
  }
];
