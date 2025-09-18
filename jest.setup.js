import '@testing-library/jest-dom'

// Mock window.confirm and window.alert
global.confirm = jest.fn(() => true)
global.alert = jest.fn()

// Mock navigator.clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(),
    },
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})