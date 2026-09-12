import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/incompatible-library": "off",
      "no-unused-vars": "off",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "bun.lock"],
  },
];

export default eslintConfig;
