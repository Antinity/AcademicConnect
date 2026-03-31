import { Conversation, PersonProfile, Role, Teacher } from "../types";

export const teachers: Teacher[] = [
  {
    id: "teacher_1",
    name: "Ava Brooks",
    title: "Mathematics Tutor",
    subjects: ["Algebra", "Calculus", "Statistics"],
    rating: 4.8,
    hourlyRate: 45,
    bio: "Patient tutor focused on building confidence, exam strategy, and steady progress.",
    reviews: [
      {
        id: "review_1",
        reviewer: "Lucas M.",
        rating: 5,
        comment: "Clear explanations and steady pacing. I improved fast.",
        date: "2026-03-12"
      },
      {
        id: "review_2",
        reviewer: "Maya K.",
        rating: 4,
        comment: "Great with test prep. Notes were easy to follow.",
        date: "2026-02-27"
      }
    ]
  },
  {
    id: "teacher_2",
    name: "Ethan Clarke",
    title: "Computer Science Coach",
    subjects: ["Programming", "Data Structures", "Algorithms"],
    rating: 4.7,
    hourlyRate: 55,
    bio: "Hands-on sessions that blend theory with practical projects.",
    reviews: [
      {
        id: "review_3",
        reviewer: "Sara D.",
        rating: 5,
        comment: "Helped me land my internship with solid portfolio work.",
        date: "2026-03-18"
      }
    ]
  },
  {
    id: "teacher_3",
    name: "Noah Patel",
    title: "Physics Mentor",
    subjects: ["Mechanics", "Electricity", "Waves"],
    rating: 4.6,
    hourlyRate: 48,
    bio: "Focused on intuition and problem-solving under pressure.",
    reviews: [
      {
        id: "review_4",
        reviewer: "Tara J.",
        rating: 4,
        comment: "Loved the real-world examples and practice sets.",
        date: "2026-01-22"
      }
    ]
  },
  {
    id: "teacher_4",
    name: "Priya Shah",
    title: "English Writing Instructor",
    subjects: ["Essay Writing", "Literature", "Editing"],
    rating: 4.9,
    hourlyRate: 50,
    bio: "Supports students with structure, voice, and polished drafts.",
    reviews: [
      {
        id: "review_5",
        reviewer: "Jordan R.",
        rating: 5,
        comment: "My essays finally feel confident and organized.",
        date: "2026-03-05"
      }
    ]
  },
  {
    id: "teacher_5",
    name: "Lena Ortiz",
    title: "Chemistry Tutor",
    subjects: ["Organic Chemistry", "Lab Reports", "Stoichiometry"],
    rating: 4.5,
    hourlyRate: 46,
    bio: "Balanced approach with problem drills and conceptual checks.",
    reviews: [
      {
        id: "review_6",
        reviewer: "Kevin S.",
        rating: 4,
        comment: "Very organized and flexible with timing.",
        date: "2026-02-14"
      }
    ]
  }
];

export const people: Record<string, PersonProfile> = {
  teacher_1: { id: "teacher_1", name: "Ava Brooks", role: "teacher", headline: "Mathematics Tutor" },
  teacher_2: { id: "teacher_2", name: "Ethan Clarke", role: "teacher", headline: "Computer Science Coach" },
  teacher_3: { id: "teacher_3", name: "Noah Patel", role: "teacher", headline: "Physics Mentor" },
  teacher_4: { id: "teacher_4", name: "Priya Shah", role: "teacher", headline: "English Writing Instructor" },
  teacher_5: { id: "teacher_5", name: "Lena Ortiz", role: "teacher", headline: "Chemistry Tutor" },
  student_1: { id: "student_1", name: "Jamie Lee", role: "student", headline: "Sophomore, STEM" },
  student_2: { id: "student_2", name: "Riley Chen", role: "student", headline: "Senior, CS" },
  school_1: { id: "school_1", name: "Northview Academy", role: "school", headline: "Hiring Committee" }
};

export const defaultProfilesByRole: Record<Role, PersonProfile> = {
  student: people.student_1,
  teacher: people.teacher_1,
  school: people.school_1
};

export const conversations: Conversation[] = [
  {
    id: "conv_1",
    participantIds: ["teacher_1", "student_1"],
    messages: [
      {
        id: "msg_1",
        senderId: "student_1",
        text: "Hi Ava, do you have time for calculus review this week?",
        timestamp: "2026-03-30T09:30:00Z"
      },
      {
        id: "msg_2",
        senderId: "teacher_1",
        text: "Yes, I can do Thursday afternoon. What topics are you targeting?",
        timestamp: "2026-03-30T10:05:00Z"
      }
    ]
  },
  {
    id: "conv_2",
    participantIds: ["teacher_2", "school_1"],
    messages: [
      {
        id: "msg_3",
        senderId: "school_1",
        text: "We are looking for a CS coach for summer programs. Interested?",
        timestamp: "2026-03-29T16:15:00Z"
      },
      {
        id: "msg_4",
        senderId: "teacher_2",
        text: "Yes, happy to share availability and curriculum ideas.",
        timestamp: "2026-03-29T17:02:00Z"
      }
    ]
  }
];
