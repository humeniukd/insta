import wrap from './error-handler-wrapper'

describe('Helper: Error Handler Wrapper', () => {
  it('returns a function', () => {
    let wrappedFunction = wrap(() => {})
    expect(typeof wrappedFunction).toBe('function')
  })

  it('does not call next when function resolves', async () => {
    const fn = () => Promise.resolve()
    const next = jest.fn()
    const wrapped = wrap(fn)
    await wrapped({}, {send: jest.fn()}, next)
    expect(next.mock.calls.length).toBe(0)
  })

  it('calls next when function rejects', async () => {
    const fn = () => Promise.reject()
    const next = jest.fn()
    const wrapped = wrap(fn)

    return wrapped({}, {send: () => ({catch: fn => fn()})}, next)
    expect(next.mock.calls.length).toBe(1)
  })
})
