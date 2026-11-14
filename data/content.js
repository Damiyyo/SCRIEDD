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
    link: "https://gemini.google/students/?utm_source=Uber&utm_medium=paid_media&utm_campaign=students_shortlink_social-uk",
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
  },
  {
    id: "idice-skills-to-job-south-east",
    title: "iDICE Skills to Job — South East Program",
    org: "African Development Bank and Bank of Industry",
    type: "training",
    summary: "Skills training and potential part-time or full-time job opportunities for participants in the South East.",
    description: [
      "The iDICE Skills to Job — South East Program is sponsored by the African Development Bank and Bank of Industry.",
      "Program benefits include well-equipped student training hubs, potential part-time or full-time job opportunities, and international linkage with global technology companies. Stipends may apply; terms and conditions apply.",
      "The listed registration deadline was 5 November 2026. This date has passed, so check the official page for any extension or updated registration details."
    ],
    eligibility: "Students interested in skills training and job opportunities in Nigeria’s South East region",
    location: "South East, Nigeria",
    deadline: "2026-11-05",
    link: "https://www.activityinfo.org/c/cif8rkemseissxrud/946930",
    steps: ["Open the official registration page and check whether registration is still available."],
    verified: false,
    certificate: false,
    partner: "Sponsored by the African Development Bank and Bank of Industry"
  },
  {
    id: "coalition-remote-office-assistant",
    title: "Remote Office Assistants",
    org: "Coalition Technologies (listing via Dixcover Hub)",
    type: "job",
    summary: "Remote, full-time roles with flexible hours. The listing reports pay of $15–$25 per hour.",
    description: [
      "This external job listing was supplied to Scried and has not been independently verified. It describes multiple remote, full-time office assistant openings paying $15–$25 per hour.",
      "The application page is hosted on jobs.smartyacad.com (Dixcover Hub), not Coalition Technologies’ official careers domain. Confirm the opening directly with the employer before sharing personal or financial information. Never pay an application or recruitment fee."
    ],
    eligibility: "Not confirmed by Scried. Review the external listing and confirm requirements with the employer.",
    location: "Remote; the listing says worldwide",
    deadline: null,
    link: "https://jobs.smartyacad.com/remote-office-assistants-needed-at-coalition-tech/",
    steps: ["Verify the opening on Coalition Technologies’ official careers site before applying.", "Do not pay a fee or provide banking details to apply."],
    verified: false,
    externalUnverified: true,
    certificate: false
  },
  {
    id: "coalition-remote-ui-ux-designer",
    title: "UI/UX Designers",
    org: "Coalition Technologies (listing via Dixcover Hub)",
    type: "job",
    summary: "Remote, full-time roles worldwide. The listing reports pay of $15–$35 per hour.",
    description: [
      "This external job listing was supplied to Scried and has not been independently verified. The attached listing calls these UI/UX Designer roles; the linked page describes remote web designer openings paying $15–$35 per hour.",
      "The application page is hosted on jobs.smartyacad.com (Dixcover Hub), not Coalition Technologies’ official careers domain. Confirm the opening directly with the employer before sharing personal or financial information. Never pay an application or recruitment fee."
    ],
    eligibility: "Not confirmed by Scried. Review the external listing and confirm requirements with the employer.",
    location: "Remote worldwide",
    deadline: null,
    link: "https://jobs.smartyacad.com/remote-web-designers-needed-at-coalition-tech/",
    steps: ["Verify the opening on Coalition Technologies’ official careers site before applying.", "Do not pay a fee or provide banking details to apply."],
    verified: false,
    externalUnverified: true,
    certificate: false
  },
  {
    id: "coalition-remote-frontend-developer",
    title: "Frontend Developers",
    org: "Coalition Technologies (listing via Dixcover Hub)",
    type: "job",
    summary: "Remote, full-time roles with flexible hours. The listing reports pay of $45,000 per year.",
    description: [
      "This external job listing was supplied to Scried and has not been independently verified. It describes remote, full-time Frontend Developer roles paying $45,000 per year.",
      "The application page is hosted on jobs.smartyacad.com (Dixcover Hub), not Coalition Technologies’ official careers domain. Confirm the opening directly with the employer before sharing personal or financial information. Never pay an application or recruitment fee."
    ],
    eligibility: "Not confirmed by Scried. Review the external listing and confirm requirements with the employer.",
    location: "Remote; the listing says worldwide",
    deadline: null,
    link: "https://jobs.smartyacad.com/remote-frontend-developers-needed-at-coalition-tech/",
    steps: ["Verify the opening on Coalition Technologies’ official careers site before applying.", "Do not pay a fee or provide banking details to apply."],
    verified: false,
    externalUnverified: true,
    certificate: false
  },
  {
    id: "coalition-remote-social-media-manager",
    title: "Social Media Manager",
    org: "Coalition Technologies (listing via Dixcover Hub)",
    type: "job",
    summary: "Remote, full-time role with flexible hours. The listing reports pay of $17–$35 per hour.",
    description: [
      "This external job listing was supplied to Scried and has not been independently verified. It describes a remote, full-time Social Media Manager role paying $17–$35 per hour.",
      "The application page is hosted on jobs.smartyacad.com (Dixcover Hub), not Coalition Technologies’ official careers domain. Confirm the opening directly with the employer before sharing personal or financial information. Never pay an application or recruitment fee."
    ],
    eligibility: "Not confirmed by Scried. Review the external listing and confirm requirements with the employer.",
    location: "Remote; the listing says worldwide",
    deadline: null,
    link: "https://jobs.smartyacad.com/remote-social-media-manager-needed-at-coalition-tech/",
    steps: ["Verify the opening on Coalition Technologies’ official careers site before applying.", "Do not pay a fee or provide banking details to apply."],
    verified: false,
    externalUnverified: true,
    certificate: false
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
