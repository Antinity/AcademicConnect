import { create } from "zustand";
import { conversations, defaultProfilesByRole, people, teachers } from "../data/mockData";
import { Conversation, Role, Teacher, UserSession } from "../types";
import { ThemeMode } from "../theme/palettes";

interface AppState {
  user: UserSession | null;
  teachers: Teacher[];
  conversations: Conversation[];
  people: Record<string, { id: string; name: string; role: Role; headline?: string }>;
  themeMode: ThemeMode;
  login: (name: string, role: Role) => void;
  logout: () => void;
  toggleTheme: () => void;
  startConversation: (participantId: string) => string;
  sendMessage: (conversationId: string, text: string) => void;
  getTeacherById: (id: string) => Teacher | undefined;
  getPersonName: (id: string) => string;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  teachers,
  conversations,
  people,
  themeMode: "light",
  login: (name, role) => {
    const profile = defaultProfilesByRole[role];
    const sessionName = name.trim() || profile.name;
    set({
      user: { id: profile.id, name: sessionName, role }
    });
  },
  logout: () => set({ user: null }),
  toggleTheme: () => {
    const current = get().themeMode;
    set({ themeMode: current === "dark" ? "light" : "dark" });
  },
  startConversation: (participantId) => {
    const { user } = get();
    if (!user) {
      return "";
    }
    const existing = get().conversations.find((conv) => {
      const ids = new Set(conv.participantIds);
      return ids.has(user.id) && ids.has(participantId);
    });
    if (existing) {
      return existing.id;
    }
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      participantIds: [user.id, participantId],
      messages: []
    };
    set({ conversations: [newConversation, ...get().conversations] });
    return newConversation.id;
  },
  sendMessage: (conversationId, text) => {
    const { user } = get();
    if (!user || !text.trim()) {
      return;
    }
    const next = get().conversations.map((conv) => {
      if (conv.id !== conversationId) {
        return conv;
      }
      return {
        ...conv,
        messages: [
          ...conv.messages,
          {
            id: `msg_${Date.now()}`,
            senderId: user.id,
            text: text.trim(),
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
    set({ conversations: next });
  },
  getTeacherById: (id) => get().teachers.find((teacher) => teacher.id === id),
  getPersonName: (id) => {
    const { user, people: map } = get();
    if (user && user.id === id) {
      return user.name;
    }
    return map[id]?.name || "Unknown";
  }
}));
