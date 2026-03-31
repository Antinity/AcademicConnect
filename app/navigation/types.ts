export type RootStackParamList = {
  Auth: undefined;
  StudentHome: undefined;
  TeacherHome: undefined;
  SchoolHome: undefined;
  TeacherProfile: { teacherId: string };
  ChatList: undefined;
  ChatThread: { conversationId: string };
};
