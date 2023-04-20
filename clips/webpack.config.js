import path from "path";
import Dotenv from "dotenv-webpack";

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new Dotenv()],
};
