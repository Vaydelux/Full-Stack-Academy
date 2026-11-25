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
      // Staged snippets and the independently compiled Nest/PG exercise.
      "drafts/p4/labs/**",
      "examples/p8-nest-integrity/**",
      "examples/p4-runtime/prisma/generated/**",
      "examples/p4-runtime/prisma/node_modules/**",
      "prototype/**",
    ],
  },
];

export default eslintConfig;
