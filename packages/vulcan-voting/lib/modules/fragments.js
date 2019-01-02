import { registerFragment } from 'meteor/vulcan:core';

registerFragment(`
  fragment VoteFragment on Vote {
    _id
    collectionName
    voteType
    power
  }
`);
