module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\.(css|less|scss)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@reduxjs/toolkit)/)',
  ],
};
