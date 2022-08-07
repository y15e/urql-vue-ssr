const graphql = require('graphql')
const fetch = require('cross-fetch')
const fs = require('fs')
const urql = require('@urql/introspection')

fetch(`https://demotivation-quotes-api.herokuapp.com/graphql`, {
  
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    variables: {},
    query: graphql.getIntrospectionQuery({ descriptions: false })
  })
  
}).then(
  
  result => result.json()
  
).then(({ data }) => {
  
  const minified = urql.minifyIntrospectionQuery(
    urql.getIntrospectedSchema(data)
  )
  
  fs.writeFileSync('./src/schema.json', JSON.stringify(minified))
  
})
