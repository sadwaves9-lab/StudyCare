import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import colors from '../theme/colors';

import HomeScreen from '../screens/home/HomeScreen';
import NotesListScreen from '../screens/notes/NotesListScreen';
import NotesDetailScreen from '../screens/notes/NotesDetailScreen';
import ChaptersScreen from '../screens/notes/ChaptersScreen';
import SearchScreen from '../screens/notes/SearchScreen';
import BookmarksScreen from '../screens/notes/BookmarksScreen';
import VideoLessonsScreen from '../screens/notes/VideoLessonsScreen';
import TestListScreen from '../screens/test/TestListScreen';
import TestIntroScreen from '../screens/test/TestIntroScreen';
import TestScreen from '../screens/test/TestScreen';
import TestResultScreen from '../screens/test/TestResultScreen';
import TestHistoryScreen from '../screens/test/TestHistoryScreen';
import PracticeScreen from '../screens/practice/PracticeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import DoubtsScreen from '../screens/social/DoubtsScreen';
import DiscussionsScreen from '../screens/social/DiscussionsScreen';
import AnnouncementsScreen from '../screens/social/AnnouncementsScreen';
import PaywallScreen from '../screens/premium/PaywallScreen';
import ClassSetupScreen from '../screens/setup/ClassSetupScreen';
import LeaderboardScreen from '../screens/rank/LeaderboardScreen';
import StreakScreen from '../screens/gamification/StreakScreen';
import AchievementsScreen from '../screens/gamification/AchievementsScreen';
import RewardsScreen from '../screens/gamification/RewardsScreen';
import StudyTimerScreen from '../screens/study/StudyTimerScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Practice" component={PracticeScreen} />
      <Stack.Screen name="Doubts" component={DoubtsScreen} />
      <Stack.Screen name="Discussions" component={DiscussionsScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="NotesDetail" component={NotesDetailScreen} />
      <Stack.Screen name="VideoLessons" component={VideoLessonsScreen} />
      <Stack.Screen name="Streak" component={StreakScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="StudyTimer" component={StudyTimerScreen} />
    </Stack.Navigator>
  );
}

function NotesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotesList" component={NotesListScreen} />
      <Stack.Screen name="NotesDetail" component={NotesDetailScreen} />
      <Stack.Screen name="Chapters" component={ChaptersScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="VideoLessons" component={VideoLessonsScreen} />
    </Stack.Navigator>
  );
}

function TestStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TestList" component={TestListScreen} />
      <Stack.Screen name="TestIntro" component={TestIntroScreen} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
      <Stack.Screen name="TestResult" component={TestResultScreen} />
      <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
      <Stack.Screen name="ClassSetup" component={ClassSetupScreen} />
      <Stack.Screen name="TestHistory" component={TestHistoryScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="VideoLessons" component={VideoLessonsScreen} />
      <Stack.Screen name="Streak" component={StreakScreen} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="StudyTimer" component={StudyTimerScreen} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.bgAlt, borderTopColor: colors.border, borderTopWidth: 1, height: 64, paddingBottom: 8, paddingTop: 8 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const map = {
            HomeTab: focused ? 'home' : 'home-outline',
            NotesTab: focused ? 'book' : 'book-outline',
            TestTab: focused ? 'clipboard' : 'clipboard-outline',
            ProfileTab: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="NotesTab" component={NotesStack} options={{ title: 'Notes' }} />
      <Tab.Screen name="TestTab" component={TestStack} options={{ title: 'Tests' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
