
import { parseComments, parseTags } from './parse-html'

const html_raw_tags = ['script', 'style', 'code']

export function parseHTML (html, options = {}) {
  const raw_tags = options.raw_tags || html_raw_tags
  var opened_tags = null

  var ast = parseComments(html, { remove_comments: options.remove_comments })
    .reduce(function (_ast, token) {
      if( typeof token !== 'string' ) {
        _ast.push(token)
      } else {
        let _result = parseTags(html, { raw_tags, opened_tags })
        opened_tags = _result.opened_tags
        _ast.push.apply(_ast, _result.ast)
      }

      return _ast
    }, [])

  if( opened_tags && opened_tags.length ) {
    throw new Error('opened_tags: ' + opened_tags.join(', ') )
  }
  
  ast = ast
    .reduce(function (_ast, token) {
      if( typeof token !== 'string' ) {
        _ast.push(token)
      } else {
        let _result = parseTags(html, { opened_tags })
        opened_tags = _result.opened_tags
        _ast.push.apply(_ast, _result.ast)
      }

      return _ast
    }, [])
  
  if( opened_tags && opened_tags.length ) {
    throw new Error('opened_tags: ' + opened_tags.join(', ') )
  }

  return ast
}
