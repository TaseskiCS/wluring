import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disabling various rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-html-link-for-pages': 'off',
      'react/jsx-key': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'next/no-server-import-in-page': 'off', // Example: disabling server import issues in Next.js pages
      'next/no-html-link-for-pages': 'off', // Disable Next.js link validation errors
    },
  },
];

export default eslintConfig;
