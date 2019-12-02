
import assert from 'assert'

import { parseTags } from './parse-tags'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

describe('parseTags: throws', function () {

  it('html source should be a String', function () {

    assert.throws(function () {
      parseTags()
    }, /html source should be a String/)

    assert.throws(function () {
      parseTags()
    }, TypeError)

  })

})

describe('parseTags', function () {

  function _runTestCases (html, result, opened_tags = []) {

    it(`${ html }`, function () {

      assert.deepStrictEqual(
        parseTags(html),
        { ast: result, opened_tags },
      )

    })

  }

  [

    [ '<div>', [ { $: 'div', _: [] } ], [{ $: 'div', _: [] }] ],
    [ '<div data-value="foo">', [ { $: 'div', attrs: { 'data-value': 'foo' }, _: []  } ], [ { $: 'div', attrs: { 'data-value': 'foo' }, _: [] } ] ],

    [ '<div data-value="foo" />', [ { $: 'div', attrs: { 'data-value': 'foo' }, self_closed: true  } ] ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

/** */
})
/** */
