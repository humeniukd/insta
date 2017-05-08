import errorHandler from './error-handler'

describe('Helper: Error Handler', () => {
  let error, res, send

  beforeEach(() => {
    error = {
      stack: 'stack',
      statusCode: 404,
      msg: 'msg'
    }
    send = jest.fn()
    res = {
      status: (code) => {
        res.statusCode = code
        return { send }
      }
    }
  })

  it('logs the error to the console', () => {
    global.console = {
      error: jest.fn()
    }
    errorHandler(error, {}, res)
    expect(console.error.mock.calls.length).toBe(1)
  })

  it('sets status to whatever is defined in the error', () => {
    errorHandler(error, {}, res)
    expect(res.statusCode).toBe(error.statusCode)
  })

  it('sets the response body to error message', () => {
    errorHandler(error, {}, res)
    expect(send.mock.calls[0][0]).toBe(error.msg)
  })
})
