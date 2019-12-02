
import { extractQuotes, restoreQuotes } from './isolate-quotes'
import { parseTag } from './parse-tag'

function _closeCurrentTag (current_tag, use_text_contents) {
  if( current_tag._.length ) {
    current_tag._ = use_text_contents
      ? current_tag._.join('')
      : [current_tag._.join('')]
  } else delete current_tag._
  return current_tag
}

export function parseRawTags (html, raw_tags, options = {}) {
  if( typeof html !== 'string' ) throw new TypeError('html source should be a String')
  if( !raw_tags || !raw_tags.length ) throw new Error('raw_tags can not be empty')

  // options
  const { tag_prop = '$', content_prop = '_' } = options
  const use_text_contents = options.text_contents !== false
  const clear_empty_texts = !options.empty_texts

  const _quotes = extractQuotes(html)

  const RE_tags = new RegExp( '(' + '<!--|-->|' + raw_tags.map(function (tag_name) {
      return '<' + tag_name + '[^>]*>|<\\/' + tag_name + '>'
    }).join('|') + ')', 'g')

  var current_tag = options.opened_tags ? options.opened_tags[0] : null,
      ast = []

  function _processTag (_token) {
    let is_closing_tag = _token[1] === '/'

    if( current_tag ) {
      if( current_tag.type === 'comment' && _token === '-->' ) {
        _closeCurrentTag(current_tag, use_text_contents)
        current_tag = null
      } else if( current_tag.type !== 'comment' && _token === '</' + current_tag[tag_prop] + '>' ) {
        _closeCurrentTag(current_tag, use_text_contents)
        current_tag = null
      } else {
        current_tag[content_prop].push(_token)
      }
    } else if( is_closing_tag ) {
      throw new Error('unexpected closing tag \'' + _token + '\'')
    } else if( _token === '<!--' ) {
      current_tag = { type: 'comment', _: [] }
      if( !options.remove_comments ) ast.push(current_tag)
    } else {
      current_tag = parseTag(_token, { tag_prop })
      current_tag[content_prop] = []
      ast.push(current_tag)
    }
  }

  _quotes.text
    .split(RE_tags)
    .forEach(function (token, i) {
      const is_tag = i%2
      var _token = restoreQuotes(token, _quotes.dquotes, _quotes.squotes)

      if( is_tag ) {
        _processTag( _token.trim() )
      } else if( !clear_empty_texts || _token ) {
        if( current_tag ) current_tag[content_prop].push(_token)
        else ast.push(_token)
      }

    })


  return {
    ast,
    opened_tags: current_tag
      ? [current_tag]
      : [],
  }
}

// export function parseComments (html, options = {}) {
//   var comment_opened = false
//   const ast = []

//   const tokens = html.split(/(<!--|-->)/g)

//   for( var i = 0, n = tokens.length; i < n ; i++ ) {
//     if( i%2 ) { // if is tag
//       if( tokens[i] === '<!--' ) {
//         if( comment_opened ) {
//           comment_opened._ += tokens[i++] + tokens[i++]
//         } else {
//           comment_opened = { type: 'comment', _: '' }
//           if( !options.remove_comments ) ast.push(comment_opened)
//         }
//       } else {
//         if( !comment_opened ) throw new Error('closing non-opened comment')
//         comment_opened = null
//       }
//     } else {
//       if( comment_opened ) comment_opened._ += tokens[i]
//       else if( options.empty_texts || tokens[i] ) ast.push(tokens[i])
//     }
//   }

//   return ast

// }
