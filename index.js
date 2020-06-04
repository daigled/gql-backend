var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')

// !: non-nullable; String!: non-nullable String field
// [Type]: array of Type; [Float]: array of Floats
var schema = buildSchema(`
    type Query {
        hello: String
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int]
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`)

var root = {
    hello: () => {
        return 'hi there guy'
    },
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Jai Guru Deva Om' : 'Paint It Black'
    },
    random: () => {
        return Math.random()
    },
    rollThreeDice: () => {
        return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
    },
    rollDice: ({numDice, numSides}) => {
        var output = []
        for( var i = 0; i< numDice; i++ ) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)))
        }
        return output
    }
}

var app = express()

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.post('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.listen(4000)
console.log(`Running a GraphQL API server at http://localhost:4000/graphql`)
