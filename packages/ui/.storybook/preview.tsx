import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import React from "react";

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(ThemeProvider, null, React.createElement(Story)),
  ],
  parameters: {
    backgrounds: {
      default: "geti-dark",
      values: [
        { name: "geti-dark", value: "#1b1b1b" },
        { name: "geti-darker", value: "#0f0f0f" },
      ],
    },
    layout: "centered",
    a11y: {
      config: {},
    },
  },
};

export default preview;
