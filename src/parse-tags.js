
import { extractQuotes, restoreQuotes } from './isolate-quotes'
import { parseTag } from './parse-tag'

export function parseTags (html, options = {}) {
  if( typeof html !== 'string' ) throw new TypeError('html source should be a String')

  const tag_prop = options.tag_prop || '$'
  const content_prop = options.content_prop || '_'
  const use_text_contents = options.text_contents !== false
  const clear_empty_texts = !options.empty_texts
  const _quotes = extractQuotes(html)

  const RE_tags = /(<[^>]+?>)/g

  var opened_tags = options.opened_tags || [],
      current_tag = opened_tags[0] || null,
      ast = []

  _quotes.text
    .split(RE_tags)
    .forEach(function (token, i) {
      const is_tag = i%2
      var _token = restoreQuotes(token, _quotes.dquotes, _quotes.squotes)
      // console.log('_token', `'${_token}'`)

      if( is_tag ) {
        _token = _token.trim()
        let is_closing_tag = _token[1] === '/'
        
        if( is_closing_tag ) {
          if( !current_tag ) throw new Error('unexpected closing tag \'' + _token + '\'')
          if( _token !== '</' + current_tag[tag_prop] + '>' ) {
            throw new Error('closing tag mismatch, expecting \'' + current_tag[tag_prop] + '\' but got \'' + _token + '\'')
          }
          if( !current_tag[content_prop].length ) delete current_tag[content_prop]
          else if(
            use_text_contents
              && current_tag[content_prop].length === 1
              && typeof current_tag[content_prop][0] === 'string'
          ) {
            current_tag[content_prop] = current_tag[content_prop][0]
          }
          opened_tags.pop()
          current_tag = opened_tags.pop()
        } else {
          current_tag = parseTag(_token, { tag_prop })
          ast.push(current_tag)
          if( current_tag.type === 'directive' ) {
            if( opened_tags.length ) throw new Error('!{{ tag_name }} should be the first tag')
            current_tag = null
          } else if( current_tag.self_closed ) {
            current_tag = null
          } else {
            current_tag[content_prop] = []
            opened_tags.push(current_tag)
          }
        }
      } else if( !clear_empty_texts || _token ) {
        if( current_tag ) current_tag[content_prop].push(_token)
        else ast.push(_token)
      }

    })


  return {
    ast,
    opened_tags,
  }
}
