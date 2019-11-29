import { extractQuotes, restoreQuotes } from './isolate-quotes'
import { parseTag } from './parse-tag'

/**
 * 
 * @param {*} html 
 * @param {*} raw_tags 
 */
export function parseRawTags (html, raw_tags = [], options = {}) {
  if( typeof html !== 'string' ) throw new TypeError('html source should be a String')
  if( !raw_tags.length ) throw new Error('missing raw_tags to extract')

  const tag_prop = options.tag_prop || '$'
  const content_prop = options.content_prop || '_'
  const _quotes = extractQuotes(html)

  const RE_full_content = new RegExp( '(' + raw_tags.map(function (tag_name) {
    return '<' + tag_name + '[^>]*>|<\\/' + tag_name + '>'
  }).join('|') + ')', 'g')

  var current_tag = null

  return _quotes.text
    .split(RE_full_content)
    .reduce(function (_ast, token, i) {
      const _token = restoreQuotes(token, _quotes.dquotes, _quotes.squotes)

      // console.log('_token', _token, !(i%2) )

      if( !(i%2) ) {
        if( !current_tag ) {
          _ast.push(_token)
          return _ast
        }
        current_tag[content_prop] = _token
      } else {
        if( current_tag ) {
          if( _token !== '</' + current_tag[tag_prop] + '>' ) {
            throw new Error('closing tag mismatch, expeting ' + current_tag[tag_prop] + ' but got \'' + _token + '\'')
          }
          current_tag = null
        } else {
          if( _token[0] === '/' ) {
            throw new Error('closing tag with no opened \'' + _token + '\'')
          }
          current_tag = parseTag(_token, { tag_prop })
          _ast.push(current_tag)
        }
      }

      return _ast

    }, [])

}
