export function extractChinese(text: string): string {
  // 使用正则表达式匹配中文字符
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const result = text.match(chineseRegex);

  return result ? result.join('') : '';
}