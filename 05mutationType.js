const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql')
const { books, authors } = require('./data')
const app = express()

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'this is represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt)},
    author: {
      type: AuthorType,
      resolve: book => {
        return authors.find( author => author.id === book.authorId )
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'this is represents a author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: author => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    
    book: {
      type: BookType,
      description: 'A Single Book',
      args: { id: { type: GraphQLInt } },
      resolve: ( parent, args ) => books.find( book => book.id === args.id )
    },

    books: {
      type: new GraphQLList(BookType),
      description: 'List of all books',
      resolve: () => books
    },

    
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: { id: { type: GraphQLInt } },
      resolve: ( parent, args ) => authors.find( author => author.id === args.id )
    },

    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of all Authors',
      resolve: () => authors
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: ( parent, args ) => {
        /* input mutation below in browser: 
        mutation {
          addBook( name: "New Name", authorId: 1) {
            id,
            name
          }
        }
        result:
        {
          "data": {
            "addBook": {
              "id": 9,
              "name": "New Name"
            }
          }
        }
        */
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
        books.push(book)
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add a author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: ( parent, args ) => {
        const author = { id: authors.length + 1, name: args.name }
        authors.push(author)
        return author
      }
    },
  })
})



const Schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/books', graphqlHTTP({
  schema: Schema,
  graphiql: true
}))
app.listen(5000, () => console.log('server run no port 5000'))