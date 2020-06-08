const { GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema } = require('graphql');
const axios = require('axios');

// launch type

const LaunchType = new GraphQLObjectType({
    name: 'Launch',
    fields: () => ({
        flight_number: { type: GraphQLInt },
        mission_name: { type: GraphQLString },
        launch_year: { type: GraphQLString },
        launch_date_local: { type: GraphQLString },
        launch_success: { type: GraphQLBoolean },
        rocket: { type: RocketType }
    })
});

// rocket type

const RocketType = new GraphQLObjectType({
    name: 'Rocket',
    fields: () => ({
        rocket_id: { type: GraphQLString },
        rocket_name: { type: GraphQLString },
        rocket_type: { type: GraphQLString }
    })
});

// Root query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        launches: {
            type: GraphQLList(LaunchType),
            async resolve(parent, args) {
                let launchData = await axios.get("https://api.spacexdata.com/v3/launches");
                return launchData.data;
            }
        },
        launch: {
            type: LaunchType,
            args: {
                flight_number: { type: GraphQLInt }
            },
            async resolve(parent, args) {
                let launchData = await axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`);
                return launchData.data;
            }
        },
        rockets: {
            type: GraphQLList(RocketType),
            async resolve(parent, args) {
                let rocketData = await axios.get("https://api.spacexdata.com/v3/rockets");
                return rocketData.data;
            }
        },
        rocket: {
            type: RocketType,
            args: {
                rocket_id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                let rocketData = await axios.get(`https://api.spacexdata.com/v3/rockets/${args.rocket_id}`);
                return rocketData.data;
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: RootQuery });