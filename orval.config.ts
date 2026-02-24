import { existsSync } from 'node:fs'
import { defineConfig } from 'orval'

if (existsSync('.env')) {
  process.loadEnvFile('.env')
}
const apiUrl = process.env.VITE_API_URL ?? 'https://ta-liso-app.online'

export default defineConfig({
  taliso: {
    input: `${apiUrl}/api/openapi.json`,
    output: {
      mode: 'tags-split',
      target: 'src/api/generated',
      client: 'vue-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: 'src/services/api.ts',
          name: 'api',
        },
        operations: {
          create_transaction_api_transactions__post: {
            mutator: { path: 'src/services/api.ts', name: 'api' },
            query: { useQuery: false },
          },
        },
      },
    },
  },
})
