import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Disables the rule that disallows `any`,
      '@typescript-eslint/no-unused-vars': 'off', // Disables the rule that disallows unused variables,
      'react-hooks/exhaustive-deps': 'warn' // Disables the rule that disallows unused variables,
    }
  }
]

export default eslintConfig
