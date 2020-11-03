const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema,
        GraphQLObjectType,
        GraphQLString,
        GraphQLList,
        GraphQLInt,
        GraphQLNonNull
} = require('graphql')
const app = express()


const books = [
  { id: 1, name: 'Harry Potter and the Chamber of Secrets' },
  { id: 2, name: 'Harry Potter and the Prisoner of Azkaban' },
  { id: 3, name: 'Harry Potter and the Goblet of Fire' },
  { id: 4, name: 'The Fellowship of the Ring' },
  { id: 5, name: 'The Two Towers' },
  { id: 6, name: 'The Return of the King' },
  { id: 7, name: 'The Way of Shadows' },
  { id: 8, name: 'Beyond the Shadows' },
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'this is represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
  })
})
const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books
    }
  })
})
const BookSchema = new GraphQLSchema({ query: RootQueryType })


app.use('/books', graphqlHTTP({
  schema: BookSchema,
  graphiql: true
}))

app.listen(5000, () => console.log('server run no port 5000'))