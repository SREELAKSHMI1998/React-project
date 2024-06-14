const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;


mongoose.connect("mongodb+srv://sreelakshmitj18:sreelu@freedb.j1kogjr.mongodb.net/",{useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('connected to MongoDB');
})



const typeDefs = gql`
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    age: Int!
    dateOfJoining: String!
    title: String!
    department: String!
    employeeType: String!
    currentStatus: Boolean!
  }

  type Query {
    employees: [Employee]
  }

  type Mutation {
    addEmployee(firstName: String!, lastName: String!, age: Int!, dateOfJoining: String!, title: String!, department: String!, employeeType: String!): Employee
  }
`;

// Define GraphQL resolvers
const resolvers = {
  Query: {
    employees: async () => await Employee.find()
  },
  Mutation: {
    addEmployee: async (_, { firstName, lastName, age, dateOfJoining, title, department, employeeType }) => {
      const employee = new Employee({
        firstName,
        lastName,
        age,
        dateOfJoining,
        title,
        department,
        employeeType,
        currentStatus: true
      });
      await employee.save();
      return employee;
    }
  }
};

async function startServer (){
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen({ port }, () => {
    console.log('Server ready at http://localhost:${port}${server.graphqlPath}');
});

}
startServer();

// Define Employee model
const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  dateOfJoining: String,
  title: String,
  department: String,
  employeeType: String,
  currentStatus: Boolean
});

const Employee = mongoose.model('Employee', employeeSchema);