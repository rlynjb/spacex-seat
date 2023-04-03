import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';

import { Loading, Header, LaunchDetail } from '../components';
import { useParams } from 'react-router-dom';

export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      id
      mission {
        name
      }
      site
      rocket {
        type
      }
    }
  }
`;

interface LaunchProps {
}

const Launch: React.FC<LaunchProps> = () => {
  let { launchId } = useParams();
  // This ensures we pass a string, even if useParams returns `undefined`
  launchId ??= '';
  const { data, loading, error } = useQuery(GET_LAUNCH_DETAILS, { variables: { launchId }});

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header
        image={
          data.launch &&
          data.launch.mission &&
          data.launch.mission.missionPatch
        }
      >
        {
          data &&
          data.launch &&
          data.launch.mission &&
          data.launch.mission.name
        }
      </Header>
      <LaunchDetail {...data.launch} />
    </Fragment>
  );
}

export default Launch;
