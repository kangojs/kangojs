import type {Config} from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  silent: false,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  "modulePaths": [
    "<rootDir>"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
