
import { parseRawTags } from './parse-raw-tags'
import { parseTags } from './parse-tags'

const html_raw_tags = ['script', 'style', 'code']
const arrayPush = Array.prototype.push

export function parseHTML (html, options = {}) {
  const raw_tags = options.raw_tags || html_raw_tags
  var opened_tags = null

  var raw = parseRawTags(html, raw_tags, {
      remove_comments: options.remove_comments,
    })

  if( raw.opened_tags && raw.opened_tags.length ) {
    throw new Error('opened_tags: ' + opened_tags.join(', ') )
  }
  
  var ast = raw.ast
    .reduce(function (_ast, token) {
      if( typeof token !== 'string' ) {
        (
          opened_tags && opened_tags.length
            ? opened_tags[opened_tags.length - 1]._
            : _ast
        ).push(token)
      } else {
        let _result = parseTags(token, { opened_tags })
        opened_tags = _result.opened_tags
        arrayPush.apply(_ast, _result.ast)
      }

      return _ast
    }, [])

  if( options.ignore_unclosed ) opened_tags = null
  
  if(  opened_tags && opened_tags.length ) {
    throw new Error('opened_tags: ' + opened_tags.join(', ') )
  }

  return ast
}
