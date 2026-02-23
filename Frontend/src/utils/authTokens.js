export const USER_TOKEN_KEY = 'userToken'
export const CAPTAIN_TOKEN_KEY = 'captainToken'

export const getUserToken = () => localStorage.getItem(USER_TOKEN_KEY)
export const getCaptainToken = () => localStorage.getItem(CAPTAIN_TOKEN_KEY)

export const setUserToken = token => localStorage.setItem(USER_TOKEN_KEY, token)
export const setCaptainToken = token => localStorage.setItem(CAPTAIN_TOKEN_KEY, token)

export const clearUserToken = () => localStorage.removeItem(USER_TOKEN_KEY)
export const clearCaptainToken = () => localStorage.removeItem(CAPTAIN_TOKEN_KEY)
