export const getRandomStr = (strength?: number) => {
  return new Date().getTime().toString(16) + Math.floor((strength ?? 1000) * Math.random()).toString(16)
}