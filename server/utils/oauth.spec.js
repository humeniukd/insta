import mockedRequest from 'request-promise-native'
import config from '../config'
import oauth from './oauth'
import mockedUsers from './users'

jest.mock('./users')

describe('Oauth session handling', () => {
  const email = 'doe@example.com'
  const accessToken = '6goz71I7dTgU'
  const idToken = 'eyJhbGciOiJIUzI1NiJ9.e30.XmNK3GpH3Ys_7wsYBfq4C3M6goz71I7dTgUkuIa5lyQ'
  let authService, req, res

  beforeEach(() => {
    authService = oauth()
    req = {
      url: '/data',
      cookies: {},
      query: {},
      get: jest.fn()
    }
    res = {
      writeHead: jest.fn(),
      end: jest.fn()
    }
  })

  it('should skip static resource fetch', async () => {
    let nextSpy = jest.fn()
    req.url = 'http://google.pl'
    await authService(req, {}, nextSpy)
    expect(nextSpy.mock.calls.length).toBe(1)
  })
  it('should get existing session id', async () => {
    mockedUsers.has.mockReturnValueOnce(true)
    mockedUsers.get.mockReturnValueOnce({ email })
    await authService(req, {}, jest.fn())
    expect(req.user.email).toBe(email)
  })
  it('should redirect unauthorized fetch', async () => {
    await authService(req, res)
    expect(res.writeHead.mock.calls.length).toBe(1)
    expect(res.writeHead.mock.calls[0][0]).toBe(302)
  })
  it('should handle redirect', async () => {
    req.url = config.callbackUrl
    mockedRequest.mockReturnValueOnce(`{"access_token":"${accessToken}","id_token":"${idToken}"}`)
    await authService(req, res)
    expect(mockedRequest.mock.calls.length).toBe(1)
    expect(mockedUsers.set.mock.calls[0][1]['access_token']).toBe(accessToken)
  })
})
