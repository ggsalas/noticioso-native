import { Theme } from "@react-navigation/native/src/types";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: 'rgb(10, 132, 255)',
    background: 'rgb(0, 0, 0)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(255, 255, 255)',
    border: 'rgb(0, 0, 0)',
    notification: 'rgb(255, 69, 58)',
  },
};

export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(0, 0, 0)',
    border: 'rgb(0, 0, 0)',
    notification: 'rgb(255, 59, 48)',
  },
};
