/*

Generic mutation wrapper to insert a new document in a collection and update
a related query on the client with the new item and a new total item count. 

Sample mutation: 

  mutation createMovie($data: CreateMovieData) {
    createMovie(data: $data) {
      data {
        _id
        name
        __typename
      }
      __typename
    }
  }

Arguments: 

  - data: the document to insert

Child Props:

  - createMovie({ data })
    
*/

import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getFragment, getFragmentName, getCollection, createClientTemplate } from 'meteor/vulcan:core';

const withCreate = (options) => {

  const { collectionName } = options;
  // get options
  const collection = options.collection || getCollection(collectionName);
  const fragment = options.fragment || getFragment(options.fragmentName || `${collectionName}DefaultFragment`);
  const fragmentName = getFragmentName(fragment);
  const typeName = collection.options.typeName;
  const query = gql`${createClientTemplate({ typeName, fragmentName })}${fragment}`;

  // wrap component with graphql HoC
  return graphql(query, {
    alias: `withCreate${typeName}`,
    props: ({ownProps, mutate}) => ({
      [`create${typeName}`]: (args) => {
        const { data } = args;
        return mutate({ 
          variables: { data },
        });
      },
      // OpenCRUD backwards compatibility
      newMutation: (args) => {
        const { document } = args;
        return mutate({ 
          variables: { data: document },
        });
      }
    }),
  });

}

export default withCreate;