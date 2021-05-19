import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default function Games() {
  const ALL_GAMES_QUERY = gql`
    query AllGamesQuery($date: String!) {
      allGames(date: $date) {
        home_team_score
        visitor_team_score
        status
        id
        home_team {
          name
          city
          id
        }
        visitor_team {
          name
          city
          id
        }
      }
    }
  `;
  const [date, dateSet] = useState(format(new Date(), "yyyy-LL-dd"));

  const { loading, error, data } = useQuery(ALL_GAMES_QUERY, {
    variables: { date },
  });

  if (loading) return <div>Loading</div>;
  if (error) {
    console.log(error);
    return null;
  }

  console.log(data);
  return <div>Games</div>;
}
