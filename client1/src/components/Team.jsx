import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

export default function Team(props) {
  const TEAM_QUERY = gql`
    query TeamQuery($id: Int!) {
      team(id: $id) {
        name
        city
        conference
        division
      }
    }
  `;

  let { id } = props.match.params;
  id = parseInt(id);
  const { loading, error, data } = useQuery(TEAM_QUERY, {
    variables: { id },
  });

  if (loading) return <div>Loading</div>;
  if (error) {
    console.log(error);
    return null;
  }

  const { name, city, conference, division } = data.team;
  return (
    <div className="flex flex-col items-center">
      <p>
        {name} {city}
      </p>
      <p>Conference: {conference}</p>
      <p>Division: {division}</p>
      <Link to="/">&larr;Back</Link>
    </div>
  );
}
