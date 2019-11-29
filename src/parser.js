
import { parseTags } from './parse-html'

const html_raw_tags = ['script', 'style', 'code']

export function parseHTML (html, options = {}) {
  const raw_tags = options.raw_tags || html_raw_tags
  
  var ast = parseTags(html, { raw_tags })

  return ast
}
