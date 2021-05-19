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

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="date">Show games for: </label>
      <input
        type="date"
        value={date}
        id="date"
        onChange={(e) => dateSet(e.target.value)}
        className="border-2 border-gray-500 p-2"
      />
      {data?.allGames.map((game) => (
        <div key={game.id} className="flex flex-col items-center">
          <p className="mt-4">
            <Link to={`teams/${game.home_team.id}`}>
              {game.home_team.name}, {game.home_team.city}{" "}
            </Link>
            {game.home_team_score || ""} vs {game.visitor_team_score || ""}{" "}
            <Link to={`teams/${game.visitor_team.id}`}>
              {game.visitor_team.city} {game.visitor_team.name}
            </Link>
          </p>
          <p>{game.status}</p>
        </div>
      ))}
    </div>
  );
}
