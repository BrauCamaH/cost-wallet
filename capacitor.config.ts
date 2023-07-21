import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.starter",
  appName: "Cost Wallet",
  webDir: "build",
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      iconColor: "#488AFF",
    },
  },
};

export default config;
