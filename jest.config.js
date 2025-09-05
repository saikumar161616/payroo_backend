module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/))(test|spec)\\.[jt]s?$',
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};