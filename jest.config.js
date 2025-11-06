export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          jsxImportSource: 'theme-ui',
          esModuleInterop: true,
          baseUrl: './src',
          paths: {
            '@/*': ['./*'],
          },
          types: ['vite/client', 'jest', '@testing-library/jest-dom'],
        },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.svg$': 'jest-transformer-svg',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Add this to ensure setup files are transformed
  transformIgnorePatterns: ['node_modules/(?!(@testing-library)/)'],
};
