
import assert from 'assert'

import { parseRawTags } from './parse-html'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

describe('parseRawTags', function () {

  it('throws: html source should be a String', function () {

    assert.throws(function () {
      parseRawTags()
    }, /html source should be a String/)

    assert.throws(function () {
      parseRawTags()
    }, TypeError)

  })

  it('throws: missing raw_tags', function () {

    assert.throws(function () {
      parseRawTags('')
    }, /missing raw_tags/)

  })

  function _runTestCases (html, raw_tags, result) {

    it(`${ html } [${ raw_tags }]`, function () {

      assert.deepStrictEqual(
        parseRawTags(html, raw_tags.split(/ *, */) ),
        result
      )

    })

  }

  [

    [ '<div>', 'script, style, code', [ '<div>' ] ],
    [ '<div><style>foobar</style></div>', 'script, style, code', ['<div>', { $: 'style', _: 'foobar' }, '</div>'] ],
    [ '<div><style><div>foobar</div></style></div>', 'script, style, code', ['<div>', { $: 'style', _: '<div>foobar</div>' }, '</div>'] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})


/** */
})
/** */
