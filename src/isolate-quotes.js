export function extractQuotes (text) {
  const dquotes = []
  const squotes = []

  text = text.replace(/"([^"]*?)"/g, function (_matched, text) {
    dquotes.push(text)
    return '"' + dquotes.length + '"'
  })

  text = text.replace(/'([^"]*?)'/g, function (_matched, text) {
    squotes.push(text)
    return "'" + squotes.length + "'" // eslint-disable-line quotes
  })

  return {
    text,
    dquotes,
    squotes,
  }
}

export function restoreQuotes (text, dquotes = [], squotes = []) {
  return text
    .replace(/'([^"]*?)'/g, (_matched, text) => "'" + squotes[Number(text) - 1] + "'" ) // eslint-disable-line quotes
    .replace(/"([^"]*?)"/g, (_matched, text) => '"' + dquotes[Number(text) - 1] + '"' )
}
