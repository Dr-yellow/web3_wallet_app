import "../a_polyfills";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AppShell } from "@/components/app/AppShell";
import { appWdkTheme } from "@/components/transaction/theme";
import { AuthProvider } from "@/context/AuthContext";
import { MultiChainProvider } from "@/context/MultiChainContext";
import { UserPreferenceProvider } from "@/context/UserPreferenceContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider as ThemeProviderWdk } from "@tetherto/wdk-uikit-react-native";

import { grayScale } from "@/constants/theme/base";
import { HomeProvider } from "@/context/HomeContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <UserPreferenceProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <MultiChainProvider>
            <HomeProvider>
              <AppShell>
                <ThemeProviderWdk
                  defaultMode={colorScheme}
                  customDarkTheme={appWdkTheme}
                  componentOverrides={appWdkTheme.componentOverrides}
                >
                  <ThemeProvider
                    value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                  >
                    <Stack
                      screenOptions={{
                        headerBackTitle: " ",
                        headerStyle: { backgroundColor: grayScale[500] },
                        headerTintColor: grayScale[100],
                        headerTitleStyle: { fontSize: 20 },
                        headerBackButtonDisplayMode: "minimal",
                      }}
                    >
                      <Stack.Screen
                        name="(tabs)"
                        options={{
                          headerShown: false,
                          title: "",
                        }}
                      />
                      <Stack.Screen
                        name="(modal)"
                        options={{
                          headerShown: false,
                          presentation: "transparentModal",
                        }}
                      />
                      <Stack.Screen
                        name="wallet-setup"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="login/index"
                        options={{
                          headerShown: true,
                          title: "",
                        }}
                      />
                      <Stack.Screen
                        name="history/index"
                        options={{
                          headerShown: true,
                          title: "",
                        }}
                      />
                      <Stack.Screen
                        name="transfer"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="wallet-manager"
                        options={{ headerShown: false }}
                      />
                    </Stack>
                    <StatusBar style="light" />
                    <Toaster
                      offset={90}
                      toastOptions={{
                        style: {
                          backgroundColor: "#000",
                          borderWidth: 1,
                          borderColor: "#fff",
                        },
                        titleStyle: { color: "#fff" },
                        descriptionStyle: { color: "#fff" },
                      }}
                    />
                  </ThemeProvider>
                </ThemeProviderWdk>
              </AppShell>
            </HomeProvider>
          </MultiChainProvider>
        </GestureHandlerRootView>
      </UserPreferenceProvider>
    </AuthProvider>
  );
}
