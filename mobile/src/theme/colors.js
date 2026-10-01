export const primary = {
  50: "#F0FAF8",
  100: "#D5F2EC",
  200: "#AAE4DA",
  300: "#74D0C3",
  400: "#3FB8A9",
  500: "#1F9C8E",
  600: "#167D73",
  700: "#146460",
  800: "#144F4D",
  900: "#134240",
  950: "#05292A",
};

export const palettes = {
  light: {
    bg: "#F3F6F6",
    card: "#FFFFFF",
    border: "#DCE4E3",
    text: "#10201F",
    muted: "#5B6F6D",
    icon: "#10201F",
    primary: primary[600],
    onPrimary: "#FFFFFF",
    danger: "#C62F3A",
  },
  dark: {
    bg: "#0C1414",
    card: "#152020",
    border: "#243332",
    text: "#E8F1F0",
    muted: "#8FA5A2",
    icon: "#E8F1F0",
    primary: primary[400],
    onPrimary: "#05292A",
    danger: "#F0707A",
  },
};
