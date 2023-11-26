import { Tabs } from "expo-router";

export default function () {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="record" />
      <Tabs.Screen name="transcript" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
