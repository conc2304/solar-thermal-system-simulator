/// <reference types="vitest/config" />
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';
import tsconfigPaths from 'vite-tsconfig-paths';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          [
            '@babel/preset-react',
            {
              runtime: 'automatic',
              importSource: 'theme-ui',
            },
          ],
        ],
      },
    }),
    tsconfigPaths(),
    process.env.ANALYZE == 'true' &&
      analyzer({
        analyzerMode: 'server',
        openAnalyzer: true,
      }),
  ],
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
  build: {
    // outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // TODO - look into why chunking breaks build
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Skip externalized modules (React, React-DOM, etc.)
          if (id.includes('node_modules')) {
            // Only chunk non-externalized vendor libraries
            if (id.includes('three') || id.includes('THREE')) {
              if (id.includes('build')) return 'vendor-three-build';
              return 'vendor-three';
            }

            if (
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/d3/')
            ) {
              return 'vendor-d3';
            }
            // Return undefined for other node_modules to let Vite handle them
            return undefined;
          }
        },
      },
    },
  },
});
