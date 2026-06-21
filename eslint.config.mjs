import coreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * Flat ESLint config. Next 16 removed `next lint` and ESLint 10 requires flat
 * config, so we consume eslint-config-next's flat preset directly (replacing the
 * old `.eslintrc.json` that extended "next/core-web-vitals").
 */
const eslintConfig = [
  ...coreWebVitals,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "public/**",
    ],
  },
];

export default eslintConfig;
