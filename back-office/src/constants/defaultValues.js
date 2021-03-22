/* 
Menu Types:
"menu-default", "menu-sub-hidden", "menu-hidden"
*/
export const defaultMenuType = "menu-default menu-hidden menu-sub-hidden";

export const subHiddenBreakpoint = 1440;
export const menuHiddenBreakpoint = 768;
export const defaultLocale = "en";
export const localeOptions = [
  { id: "en", name: "English - LTR", direction: "ltr" },
  // { id: "es", name: "Español", direction: "ltr" },
  { id: "enrtl", name: "English - RTL", direction: "rtl" }
];

/* 
Color Options:
"light.purple", "light.blue", "light.green", "light.orange", "light.red", "dark.purple", "dark.blue", "dark.green", "dark.orange", "dark.red"
*/
export const isMultiColorActive = false;
export const defaultColor = "light.blue";
export const defaultDirection = "ltr";
export const isDarkSwitchActive = false;
export const areNotificationEnabled = true;
export const themeColorStorageKey="__theme_color";
export const themeRadiusStorageKey = "__theme_radius";
export const isDemo = true;