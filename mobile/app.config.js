export default {
  expo: {
    name: "LifeDrop",
    slug: "lifedrop",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#8e0000"
    },
    scheme: "lifedrop",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.yourname.lifedrop",
      config: {
        // Read from .env — never hardcoded
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "LifeDrop needs your location to find the nearest donation centers.",
        NSCameraUsageDescription:
          "LifeDrop needs camera access for profile photos."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#8e0000"
      },
      package: "com.yourname.lifedrop",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "NOTIFICATIONS"
      ],
      config: {
        googleMaps: {
          // Read from .env — never hardcoded
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
        }
      }
    },
    plugins: [
      "expo-router",
      "expo-location",
      "expo-notifications"
    ],
    experiments: {
      typedRoutes: true
    }
  }
}