export const interestsCatalog = [
  "Hackathons",
  "Design",
  "Startups",
  "AI",
  "Marketing",
  "Photography",
  "Debates",
  "Research",
  "Web Dev",
  "Public Speaking",
  "Gaming",
  "Robotics"
];

export const suggestedPeople = [
  {
    id: "u-ariba",
    name: "Areeba Khan",
    role: "UI/UX Designer",
    university: "IBA Karachi",
    initials: "AK",
    following: false,
    verified: true
  },
  {
    id: "u-hamza",
    name: "Hamza Ali",
    role: "Founder at BuildFast",
    university: "FAST NUCES",
    initials: "HA",
    following: true,
    verified: false
  },
  {
    id: "u-sara",
    name: "Sara Tariq",
    role: "CS Society Lead",
    university: "LUMS",
    initials: "ST",
    following: false,
    verified: true
  }
];

export const startupItems = [
  {
    id: "startup-pitchpilot",
    name: "PitchPilot",
    founder: "Sana Ahmed",
    founderId: "u-sana",
    founderInitials: "SA",
    tagline: "Practice investor pitches with AI feedback and peer review.",
    summary:
      "PitchPilot helps student founders rehearse investor conversations, get actionable AI feedback, and compare progress over time.",
    domains: ["AI", "EdTech"],
    rolesNeeded: ["Frontend Dev", "Growth Lead"],
    stage: "MVP",
    likes: 63,
    liked: false
  },
  {
    id: "startup-campuscart",
    name: "CampusCart",
    founder: "Zain Abbas",
    founderId: "u-zain",
    founderInitials: "ZA",
    tagline: "A campus-first marketplace for student sellers and society merchandise.",
    summary:
      "CampusCart makes it easier for students and societies to run small storefronts, manage limited stock, and coordinate on-campus pickup.",
    domains: ["Commerce", "Operations"],
    rolesNeeded: ["Backend Dev", "Operations Lead"],
    stage: "Pilot",
    likes: 41,
    liked: true
  }
];

export const highlightItems = [
  {
    id: "highlight-expo",
    thumbnail: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
    society: "Tech Council",
    eventId: "event-product-expo",
    eventName: "Spring Product Expo",
    caption: "The spring showcase pulled together product demos, founder feedback, and a packed audience.",
    likes: 89,
    liked: true,
    comments: 11
  }
];

export const events = [
  {
    id: "event-founder-mixer",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
    ],
    society: "Business Society",
    societyId: "soc-business",
    title: "Campus Founder Mixer",
    description:
      "Meet student founders, early operators, and builders for a high-signal evening of networking and short live pitches.",
    fullDescription:
      "The Campus Founder Mixer brings together student founders, designers, builders, and startup-curious students for a structured evening of intros, rapid networking, and short founder spotlights. Expect curated icebreakers, an open collaboration board, and practical conversations about building on campus.",
    tags: ["Networking", "Pitching", "Startup"],
    date: "2026-04-20",
    displayDate: "Apr 20",
    time: "6:00 PM",
    venue: "Innovation Center",
    eventType: "Networking",
    organizer: "Business Society",
    registrationDeadline: "2026-04-19",
    capacityPercent: 76,
    capacity: 120,
    registeredCount: 91,
    likes: 128,
    liked: false,
    comments: 18,
    status: "upcoming",
    registrationState: "default",
    segments: [
      { name: "Founder intros", capacity: 40, lead: "Areeba Khan" },
      { name: "Open networking", capacity: 80, lead: "Hamza Ali" }
    ],
    postEventHighlights: []
  },
  {
    id: "event-hackathon-night",
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80"
    ],
    society: "CS Society",
    societyId: "soc-cs",
    title: "Hackathon Launch Night",
    description: "Kick off the semester's biggest build sprint with team matching and sponsor intros.",
    fullDescription:
      "Hackathon Launch Night is the official kickoff for the semester build sprint. Students can meet possible teammates, hear from sponsors, and get a clear overview of rules, judging, and support resources.",
    tags: ["Hackathon", "Tech"],
    date: "2026-04-19",
    displayDate: "Apr 19",
    time: "7:00 PM",
    venue: "Main Auditorium",
    eventType: "Hackathon",
    organizer: "CS Society",
    registrationDeadline: "2026-04-18",
    capacityPercent: 86,
    capacity: 200,
    registeredCount: 172,
    likes: 145,
    liked: false,
    comments: 22,
    status: "upcoming",
    registrationState: "default",
    segments: [
      { name: "Team matching", capacity: 120, lead: "Sara Tariq" },
      { name: "Sponsor briefing", capacity: 80, lead: "Usman Khalid" }
    ],
    postEventHighlights: []
  },
  {
    id: "event-product-expo",
    coverImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80"
    ],
    society: "Tech Council",
    societyId: "soc-tech",
    title: "Spring Product Expo",
    description: "A showcase of student-built products, live demos, and post-demo networking.",
    fullDescription:
      "The Spring Product Expo is where student product teams share demos, collect feedback, and connect with possible collaborators, founders, and interested attendees from across campus.",
    tags: ["Expo", "Community"],
    date: "2026-04-14",
    displayDate: "Apr 14",
    time: "5:30 PM",
    venue: "Student Center",
    eventType: "Showcase",
    organizer: "Tech Council",
    registrationDeadline: "2026-04-13",
    capacityPercent: 100,
    capacity: 160,
    registeredCount: 160,
    likes: 110,
    liked: true,
    comments: 29,
    status: "past",
    registrationState: "closed",
    segments: [
      { name: "Demos", capacity: 90, lead: "Tech Council" },
      { name: "Feedback roundtables", capacity: 70, lead: "Faculty mentors" }
    ],
    postEventHighlights: [highlightItems[0]]
  },
  {
    id: "event-creator-summit",
    coverImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80"
    ],
    society: "Media Society",
    societyId: "soc-media",
    title: "Creator Summit",
    description: "A campus-wide summit for creators, photographers, editors, and storytellers.",
    fullDescription:
      "Creator Summit connects campus storytellers across photography, video, design, and content strategy. The program includes panels, mini workshops, and volunteer opportunities for students who want hands-on exposure.",
    tags: ["Media", "Workshop"],
    date: "2026-04-25",
    displayDate: "Apr 25",
    time: "4:00 PM",
    venue: "Media Hall",
    eventType: "Summit",
    organizer: "Media Society",
    registrationDeadline: "2026-04-22",
    capacityPercent: 42,
    capacity: 140,
    registeredCount: 59,
    likes: 92,
    liked: false,
    comments: 15,
    status: "upcoming",
    registrationState: "waitlist",
    segments: [
      { name: "Panels", capacity: 80, lead: "Media Society" },
      { name: "Volunteer squad", capacity: 20, lead: "Event Ops Team" }
    ],
    postEventHighlights: []
  }
];

export const societyUpdates = [
  {
    id: "update-media-volunteers",
    author: "Media Society",
    authorId: "soc-media",
    authorInitials: "MS",
    timestamp: "2 hours ago",
    text: "Applications are open for photography, registration, and backstage support for the annual creator summit. Apply by Apr 22.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
    likes: 54,
    liked: false,
    comments: 8
  }
];

export const threadedComments = [
  {
    id: "comment-1",
    author: "Areeba Khan",
    text: "This looks really polished. Looking forward to the networking block.",
    likes: 12,
    liked: false,
    replies: [
      {
        id: "comment-1-reply-1",
        author: "Business Society",
        text: "We are adding a dedicated founder-intro segment too.",
        likes: 4,
        liked: false
      }
    ]
  },
  {
    id: "comment-2",
    author: "Hamza Ali",
    text: "Would love a list of attending founders ahead of time.",
    likes: 7,
    liked: true,
    replies: []
  }
];

export function getEventById(eventId) {
  return events.find((item) => item.id === eventId);
}

export function getStartupById(startupId) {
  return startupItems.find((item) => item.id === startupId);
}

export function getProfileById(profileId) {
  const profileMap = {
    me: {
      id: "me",
      name: "Zara Ahmed",
      role: "Student",
      university: "IBA Karachi",
      year: "3rd Year",
      bio: "Product-minded student exploring startups, design systems, and campus community building.",
      linkedin: "https://linkedin.com/in/zara-ahmed",
      github: "https://github.com/zaraahmed",
      tags: ["Hackathons", "Startups", "Design", "EdTech"],
      followers: 142,
      following: 89,
      eventsAttended: 12,
      verified: true
    },
    "u-ariba": {
      id: "u-ariba",
      name: "Areeba Khan",
      role: "UI/UX Designer",
      university: "IBA Karachi",
      year: "4th Year",
      bio: "Design lead for student products and workshop host for interface critique sessions.",
      linkedin: "https://linkedin.com/in/areebakhan",
      github: "https://github.com/areebakhan",
      tags: ["Design", "Research", "Startups"],
      followers: 98,
      following: 61,
      eventsAttended: 18,
      verified: true
    }
  };

  return profileMap[profileId] || profileMap.me;
}

export function buildSearchResults(query) {
  const term = query.trim().toLowerCase();

  const match = (value) => value.toLowerCase().includes(term);

  return {
    events: events.filter((event) => [event.title, event.society, event.description, ...event.tags].some(match)),
    people: suggestedPeople.filter((person) => [person.name, person.role, person.university].some(match)),
    startups: startupItems.filter((startup) => [startup.name, startup.founder, startup.summary, ...startup.domains].some(match))
  };
}
