// secureUrl: 确保图片链接使用 HTTPS，防止混合内容错误
export function secureUrl(url) {
  if (!url) return "";
  return url.replace(/^http:\/\//i, 'https://');
}