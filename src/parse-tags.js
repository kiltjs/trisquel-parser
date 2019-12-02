
import { extractQuotes, restoreQuotes } from './isolate-quotes'
import { parseTag } from './parse-tag'

export function parseTags (html, options = {}) {
  if( typeof html !== 'string' ) throw new TypeError('html source should be a String')

  // options
  const { tag_prop = '$', content_prop = '_', ignore_bad_closed, ignore_unexpected_closed } = options
  const use_text_contents = options.text_contents !== false
  const clear_empty_texts = !options.empty_texts

  const _quotes = extractQuotes(html)

  const RE_tags = /(<[^>]+?>)/g

  var opened_tags = options.opened_tags || [],
      current_tag = opened_tags[opened_tags.length - 1] || null,
      ast = []

  function _processClosingTag (_token) {
    if( !current_tag ) {
      if( ignore_unexpected_closed ) return
      throw new Error('unexpected closing tag \'' + _token + '\'')
    }

    if( _token !== '</' + current_tag[tag_prop] + '>' ) {
      if( !ignore_bad_closed ) {
        throw new Error('closing tag mismatch, expecting \'</' + current_tag[tag_prop] + '>\' but got \'' + _token + '\'')
      }
      let _opened_tags = opened_tags.slice()
      while( current_tag && _token !== '</' + current_tag[tag_prop] + '>' ) {
        opened_tags.pop()
        current_tag = opened_tags[opened_tags.length - 1]
      }
      if( !current_tag ) {
        if( ignore_unexpected_closed ) {
          opened_tags = _opened_tags
          current_tag = opened_tags[opened_tags.length - 1]
        } else throw new Error('unexpected closing tag \'' + _token + '\', previous tags: ' + _opened_tags.map( (tag) => tag.type || tag.$ ).join(', ') )
      }
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
    current_tag = opened_tags[opened_tags.length - 1] || null
  }

  function _processOpeningTag (_token) {
    var _current_tag = parseTag(_token, { tag_prop })
    ast.push(_current_tag)
    if( _current_tag.type === 'directive' ) {
      if( opened_tags.length ) throw new Error('!{{ tag_name }} should be the first tag')
    } else if( !_current_tag.self_closed ) {
      _current_tag[content_prop] = []
      opened_tags.push(_current_tag)
      current_tag = _current_tag
    }
  }

  _quotes.text
    .split(RE_tags)
    .forEach(function (token, i) {
      const is_tag = i%2
      var _token = restoreQuotes(token, _quotes.dquotes, _quotes.squotes)
      // console.log('_token', `'${_token}'`)

      if( is_tag ) {
        let __token = _token.trim()
        let is_closing_tag = __token[1] === '/'

        if( is_closing_tag ) {
          _processClosingTag(__token)
        } else {
          _processOpeningTag(__token)
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
