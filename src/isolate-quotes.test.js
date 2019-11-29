
import assert from 'assert'

import { extractQuotes, restoreQuotes } from './isolate-quotes'

/** */
describe( '.' + __filename.substr( process.cwd().length ), function () {
// --------------------------------------

const test_cases = [

  [ '<div>', '<div>', [], [] ],
  [ '<div class="">', '<div class="1">', [''], [] ],
  [ '<div class="foo">', '<div class="1">', ['foo'], [] ],
  [ '<div class="foo \'bar\' ">', '<div class="1">', ['foo \'bar\' '], [] ],

]

describe('extractQuotes', function () {

  function _runTestCases (src, text, dquotes, squotes) {

    it(src, function () {

      assert.deepStrictEqual(
        extractQuotes(src),
        { text, dquotes, squotes }
      )

    })

  }

  test_cases.forEach( (test_case) => _runTestCases.apply(null, test_case) )

})

describe('restoreQuotes', function () {

  function _runTestCases (src, text, dquotes, squotes) {

    it(src, function () {

      assert.deepStrictEqual(
        src,
        restoreQuotes(text, dquotes, squotes)
      )

    })

  }

  test_cases.forEach( (test_case) => _runTestCases.apply(null, test_case) )

})


/** */
})
/** */
