const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema,
        GraphQLObjectType,
        GraphQLString,
} = require('graphql')
const app = express()

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'helloWorld',
    fields: () => ({
      message: {
        type: GraphQLString,
        resolve: () => 'Hello World'
      }
    })
  })
})

app.use('/', graphqlHTTP({ schema, graphiql: true }))

app.listen(5000, () => console.log('server run no port 5000'))