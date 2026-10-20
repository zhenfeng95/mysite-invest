/**
 * 给客户端判断是否中国大陆访问。
 * Vercel 在请求上带 x-vercel-ip-country；本地没有该头时返回空字符串。
 */
export default defineEventHandler((event) => {
  const country = String(getHeader(event, 'x-vercel-ip-country') || '').trim().toUpperCase()
  setHeader(event, 'Cache-Control', 'private, no-store')
  return { country }
})
