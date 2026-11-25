import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "examples/forms-query-vertical/react-client/dist/**",
      "examples/forms-query-vertical/.ssr-qualification-*/**",
      "next-env.d.ts",
      "public/**",
      "preview-src/**",
      "drafts/nestjs/**",
      "labs/nestjs-*/**",
      "examples/nestjs-vertical/**",
      "examples/p4-runtime/prisma/generated/**",
      "examples/p4-runtime/prisma/node_modules/**",
      "prototype/**",
    ],
  },
];

export default eslintConfig;
