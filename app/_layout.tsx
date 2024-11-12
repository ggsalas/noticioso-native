import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import {
  Alegreya_500Medium,
  Alegreya_500Medium_Italic,
  Alegreya_700Bold,
  Alegreya_700Bold_Italic,
} from "@expo-google-fonts/alegreya";
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_500Medium_Italic,
  JetBrainsMono_700Bold,
  JetBrainsMono_700Bold_Italic,
} from "@expo-google-fonts/jetbrains-mono";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "@/constants/navigationThemes";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { FeedsProvider } from "@/providers/FeedsProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Alegreya_500Medium,
    Alegreya_500Medium_Italic,
    Alegreya_700Bold,
    Alegreya_700Bold_Italic,
    JetBrainsMono_500Medium,
    JetBrainsMono_500Medium_Italic,
    JetBrainsMono_700Bold,
    JetBrainsMono_700Bold_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <FeedsProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </FeedsProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
