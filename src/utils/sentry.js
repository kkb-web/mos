import { getEnv } from './env'
const devDSN = 'https://9bb538f6bf5b400680f386ecfd29842d@sentry.kaikeba.com/52'
const prodDSN = 'https://80b93c80251846288a76035bd251c79a@sentry.kaikeba.com/49'
const preDSN = 'https://6fa4e2c5805b4febbbac154fc647878f@sentry.kaikeba.com/51'
const testDSN = 'https://7827c6565f524155b2ae658fd2153f42@sentry.kaikeba.com/50'

const DSN = { dev: devDSN, prod: prodDSN, test: testDSN, pre: preDSN }
console.log('current env', getEnv)
export default DSN[getEnv]
