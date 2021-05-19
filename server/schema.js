const { sub, add, format } = require("date-fns");
const { default: axios } = require("axios");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

const TeamType = new GraphQLObjectType({
  name: "Team",
  fields: () => ({
    id: { type: GraphQLInt },
    city: { type: GraphQLString },
    conference: { type: GraphQLString },
    division: { type: GraphQLString },
    full_name: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

const GameType = new GraphQLObjectType({
  name: "Game",
  fields: () => ({
    id: { type: GraphQLInt },
    date: { type: GraphQLString },
    home_team_score: { type: GraphQLInt },
    visitor_team_score: { type: GraphQLInt },
    home_team: { type: TeamType },
    visitor_team: { type: TeamType },
    status: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    teams: {
      type: new GraphQLList(TeamType),
      async resolve(parent, args) {
        try {
          const response = await axios.get(
            "https://www.balldontlie.io/api/v1/teams"
          );
          const data = await response;
          return data.data.data;
        } catch {
          throw "fetching teams failed";
        }
      },
    },
    team: {
      type: TeamType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        try {
          const response = await axios.get(
            `https://www.balldontlie.io/api/v1/teams/${args.id}`
          );
          const data = await response;
          return data.data;
        } catch {
          throw "fetching team failed";
        }
      },
    },
    allGames: {
      type: new GraphQLList(GameType),
      args: {
        date: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          const response = await axios.get(
            `https://www.balldontlie.io/api/v1/games?start_date=${args.date}&end_date=${args.date}`
          );
          const data = await response;
          return data.data.data;
        } catch {
          throw "fetching games failed";
        }
      },
    },
    teamGames: {
      type: new GraphQLList(GameType),
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        try {
          const baseDate = new Date();
          const startDate = format(sub(baseDate, { days: 7 }), "yyyy-LL-dd");
          const endDate = format(add(baseDate, { days: 7 }), "yyyy-LL-dd");
          const response = await axios.get(
            `https://www.balldontlie.io/api/v1/games?team_ids[]=` +
              `${args.id}&start_date=${startDate}&end_date=${endDate}`
          );
          const data = await response;
          return data.data.data;
        } catch {
          throw "fetching game for team failed";
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
