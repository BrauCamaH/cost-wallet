import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bgch.notecostlink",
  appName: "NoteCostLink",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      iconColor: "#488AFF",
    },
  },
};

export default config;
