const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')

const getDirectories = (path) => {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

const getExamplesPages = () => {
  const examplesEntries = {}
  const examplesPages = []

  const examples = getDirectories(path.resolve(__dirname, '../examples'))
  examples.forEach(example => {
    const entryFile = path.resolve(__dirname, `../examples/${example}/script.ts`)
    const entryExists = fs.existsSync(entryFile)

    if (!entryExists) return

    examplesEntries[example] = entryFile
    examplesPages.push(
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../src/index.html'),
        chunks: [example],
        filename: `${example}.html`,
        minify: true
      })
    )
  })

  return {
    examplesEntries,
    examplesPages
  }
}

const generateIndexExamplePage = () => {
  const examples = getDirectories(path.resolve(__dirname, '../examples'))

  const validExamples = examples.filter(example => {
    const entryFile = path.resolve(__dirname, `../examples/${example}/script.ts`)
    const entryExists = fs.existsSync(entryFile)
    return entryExists
  })

  fs.writeFileSync(path.resolve(__dirname, '../examples/index.html'), `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        ${validExamples.map(example => `<a href="${example}.html">${example}</a>`).join('<br />\n')}
      </body>
    </html>
  `);

  return new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../examples/index.html'),
  })
}

module.exports = {
  getExamplesPages,
  generateIndexExamplePage
}
