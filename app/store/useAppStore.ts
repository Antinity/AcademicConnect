import { create } from "zustand";
import { Conversation, OnboardingProfile, Role, Teacher, UserSession, Review } from "../types";
import { ThemeMode } from "../theme/palettes";
import api from "../services/api";
import { setStoredToken, removeStoredToken } from "../services/storage";

interface AppState {
  user: UserSession | null;
  isOnboarded: boolean;
  profile: OnboardingProfile | null;
  teachers: Teacher[];
  conversations: Conversation[];
  people: Record<string, { id: string; name: string; role: Role; headline?: string }>;
  themeMode: ThemeMode;
  authError: string | null;

  // Actions
  authenticate: (name: string, email: string, password: string, role: Role, isRegister: boolean) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
  completeOnboarding: (profile: OnboardingProfile) => Promise<boolean>;
  
  // Data Fetching
  fetchTeachers: () => Promise<void>;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  
  // Interactions
  startConversation: (participantId: string) => Promise<string | null>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  submitReview: (teacherId: string, rating: number, comment: string) => Promise<boolean>;

  // Getters
  getTeacherById: (id: string) => Teacher | undefined;
  getPersonName: (id: string) => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isOnboarded: false,
  profile: null,
  teachers: [],
  conversations: [],
  people: {},
  themeMode: "light",
  authError: null,

  authenticate: async (name, email, password, role, isRegister) => {
    try {
      set({ authError: null });
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { name, email, password, role } : { email, password };
      
      const response = await api.post(endpoint, payload);
      const { user, token } = response.data;
      
      await setStoredToken(token);
      set({
        user: { id: user.id || user._id, name: user.name, role: user.role },
        isOnboarded: false // Simplified: always show onboarding or default
      });
      return true;
    } catch (error: any) {
      set({ authError: error.response?.data?.message || "Authentication failed" });
      return false;
    }
  },

  logout: async () => {
    await removeStoredToken();
    set({ user: null, isOnboarded: false, profile: null, teachers: [], conversations: [], people: {} });
  },

  toggleTheme: () => {
    const current = get().themeMode;
    set({ themeMode: current === "dark" ? "light" : "dark" });
  },

  completeOnboarding: async (profilePayload) => {
    try {
      const { user } = get();
      if (!user) return false;

      const response = await api.put("/profiles", profilePayload);
      set({ isOnboarded: true, profile: { ...profilePayload, role: user.role } });
      
      // Refresh teacher list if we are a teacher to show our new profile
      if (user.role === "teacher") {
        await get().fetchTeachers();
      }
      return true;
    } catch (error) {
      console.error("Error completing onboarding", error);
      return false;
    }
  },

  fetchTeachers: async () => {
    try {
      const resp = await api.get("/profiles?role=teacher");
      // Map API profile to Teacher type
      const teachersList: Teacher[] = resp.data.map((p: any) => ({
        id: p.userId?._id || p.userId,
        name: p.userId?.name || "Unknown",
        title: p.headline || "Teacher",
        subjects: p.subjects || [],
        rating: p.rating || 0,
        hourlyRate: p.hourlyRate || 0,
        bio: p.bio || "",
        reviews: [] // We fetch reviews on demand or separately
      }));
      
      // Update people map
      const peopleMap = { ...get().people };
      teachersList.forEach(t => {
        peopleMap[t.id] = { id: t.id, name: t.name, role: "teacher", headline: t.title };
      });

      set({ teachers: teachersList, people: peopleMap });
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  },

  fetchConversations: async () => {
    try {
      const resp = await api.get("/conversations");
      const apiConvs = resp.data.map((c: any) => ({
        id: c._id,
        participantIds: c.participantIds.map((p: any) => p._id || p),
        messages: get().conversations.find((existing) => existing.id === c._id)?.messages || []
      }));
      set({ conversations: apiConvs });
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  },

  fetchMessages: async (conversationId) => {
    try {
      const resp = await api.get(`/conversations/${conversationId}/messages`);
      const apiMsgs = resp.data.map((m: any) => ({
        id: m._id,
        senderId: m.senderId,
        text: m.text,
        timestamp: m.timestamp
      }));
      
      const next = get().conversations.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, messages: apiMsgs };
        }
        return conv;
      });
      set({ conversations: next });
    } catch (error) {
      console.error("Failed to fetch messages for conv", error);
    }
  },

  startConversation: async (participantId) => {
    try {
      const resp = await api.post("/conversations", { targetUserId: participantId });
      const newConv = resp.data;
      const convId = newConv._id;
      
      // Refresh conv list
      await get().fetchConversations();
      return convId;
    } catch (error) {
      console.error("Failed to start conversation", error);
      return null;
    }
  },

  sendMessage: async (conversationId, text) => {
    try {
      const resp = await api.post(`/conversations/${conversationId}/messages`, { text });
      // Currently, components fetch messages themselves, but we could update store here if we keep messages in store.
      // Easiest is to let components re-fetch after sending.
    } catch (error) {
      console.error("Failed to send message", error);
    }
  },

  submitReview: async (teacherId, rating, comment) => {
    try {
      await api.post(`/reviews/${teacherId}`, { rating, comment });
      return true;
    } catch (error) {
      console.error("Failed to submit review", error);
      return false;
    }
  },

  getTeacherById: (id) => get().teachers.find((t) => t.id === id),
  getPersonName: (id) => {
    const { user, people: map } = get();
    if (user && user.id === id) return user.name;
    return map[id]?.name || "Unknown";
  }
}));
