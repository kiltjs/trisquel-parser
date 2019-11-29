
import assert from 'assert'

import { parseTag } from './parse-tag'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

describe('parseTag', function () {

  function _runTestCases (html, result) {

    it(html, function () {

      assert.deepStrictEqual(
        parseTag(html),
        result
      )

    })

  }

  [

    [ '<div>', { $: 'div' } ],
    [ '<div class="foo">', { $: 'div', attrs: { class: 'foo' } } ],
    [ '<div id="foo">', { $: 'div', attrs: { id: 'foo' } } ],

    [ '<!DOCTYPE html>', { $: 'DOCTYPE', attrs: { html: '' }, warn: true } ],

  ].forEach( (test_case) => _runTestCases.apply(null, test_case) )

})


/** */
})
/** */
