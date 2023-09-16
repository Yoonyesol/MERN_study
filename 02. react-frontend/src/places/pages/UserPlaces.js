import React from "react";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPyuJVRazIvc5q3tBMmbrH25HHWvIwh8zsc9Tmn=s680-w680-h510",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorId: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipPyuJVRazIvc5q3tBMmbrH25HHWvIwh8zsc9Tmn=s680-w680-h510",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creatorId: "u2",
  },
];

const UserPlaces = (props) => {
  return <PlaceList items={DUMMY_PLACES} />;
};

export default UserPlaces;
