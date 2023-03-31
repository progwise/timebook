import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: '../../packages/backend/src/graphql/generated/schema.graphql',
  documents: ['frontend/**/*.tsx', 'pages/**/*.tsx'],
  ignoreNoDocuments: true,
  generates: {
    './frontend/generated/gql/': {
      preset: 'client',
      plugins: [
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
      ],
    },
    './frontend/mocks/mocks.generated.ts': {
      plugins: [
        { add: { content: '/* eslint-disable @typescript-eslint/no-explicit-any */' } },
        { add: { content: '/* eslint-disable unicorn/prevent-abbreviations */' } },
        'typescript',
        'typescript-operations',
        'typescript-msw',
      ],
    },
  },
  hooks: { afterOneFileWrite: ['prettier --write'] },
  config: {
    scalars: { Date: 'string', DateTime: 'string' },
    dedupeFragments: true,
  },
}

export default config
