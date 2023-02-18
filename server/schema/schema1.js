const Project = require("../models/Project");
const Client = require("../models/Client");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");

// client type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parentValue, args) {
        return Client.findById(parentValue.clientId); // clientId means we have declared this as ref in project Schema
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //list of all clients
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parentValue, args) {
        return Client.find();
      },
    },
    //for single client
    client: {
      type: ClientType,
      // arguments
      args: {
        id: {
          type: GraphQLID,
        },
      },
      //data to return function syntax....if we use mongoose or sequilize, api will be written here
      resolve(parentValue, args) {
        return Client.findById(args.id);
      },
    },

    //list for all projects
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parentValue, args) {
        return Project.find();
      },
    },
    //for single client
    project: {
      type: ProjectType,
      // arguments
      args: {
        id: {
          type: GraphQLID,
        },
      },
      //data to return function syntax....if we use mongoose or sequilize, api will be written here
      resolve(parentValue, args) {
        return Project.findById(args.id);
      },
    },
  },
});

// mutations
const mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //add Client
    addClient: {
      type: ClientType,
      args: {
        // if we dont want this value to be null , we will add GraphQLNonNull
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    // delete client
    deleteClient: {
      type: ClientType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, args) {
        Project.find({ clientId: args.id }).then((projects) => {
          projects.forEach((project) => {
            project.remove();
          });
        });
        return Client.findByIdAndDelete(args.id);
      },
    },
    //add project
    addProject: {
      type: ProjectType,
      args: {
        // if we dont want this value to be null , we will add GraphQLNonNull
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
    //delete project
    deleteProject: {
      type: ProjectType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, args) {
        return Project.findByIdAndRemove(args.id);
      },
    },
    //update project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              progress: { value: "In Progress" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parentValue, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutations,
});
