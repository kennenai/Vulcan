import { addCallback, Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import { getVotePower } from '../modules/vote.js';
// import { updateScore } from './scoring.js';

// ----------------------------- vote.async ------------------------------- //

/**
 * @summary Update an item's (post or comment) score
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
// function updateItemScore(item, user, collection, operation, context) {
//   updateScore({collection: collection, item: item, forceUpdate: true});
// }

// addCallback("upvote.async", updateItemScore);
// addCallback("downvote.async", updateItemScore);
// addCallback("cancelUpvote.async", updateItemScore);
// addCallback("cancelDownvote.async", updateItemScore);



/**
 * @summary Update the profile of the user doing the operation
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
function updateUser(item, user, collection, operation, context) {

  // uncomment for debug
  // console.log('item = ');
  // console.log(item);
  // console.log('user = ');
  // console.log(user);
  // console.log('collection._name = ');
  // console.log(collection._name);
  // console.log('operation = ');
  // console.log(operation);

  const update = {};
  const vote = {
    itemId: item._id,
    votedAt: new Date()
  };

  const collectionName = Utils.capitalize(collection._name);

  const newUpvoteCount = operation === 'upvote' ? 1 : -1

  switch (operation) {
    case "upvote":
      update.$addToSet = {[`upvoted${collectionName}`]: vote};
      break;
    case "cancelUpvote":
      update.$pull = {[`upvoted${collectionName}`]: {itemId: item._id}};
      break;
   }

   // also update the upvote counter cache
   update.$inc = { 'upvoteCount': newUpvoteCount }

   Users.update({_id: user._id}, update);
}

addCallback("votes.upvote.async", updateUser);
addCallback("votes.cancel.async", updateUser);

/**
 * @summary Update the karma of the item's owner
 * @param {object} item - The item being operated on
 * @param {object} user - The user doing the operation
 * @param {object} collection - The collection the item belongs to
 * @param {string} operation - The operation being performed
 */
// function updateKarma(item, user, collection, operation, context) {

//   const votePower = getVotePower(user);
//   const karmaAmount = (operation === "upvote" || operation === "cancelDownvote") ? votePower : -votePower;

//   // only update karma is the operation isn't done by the item's author
//   if (item.userId !== user._id) {
//     Users.update({_id: item.userId}, {$inc: {"karma": karmaAmount}});
//   }

// }

// addCallback("upvote.async", updateKarma);
// addCallback("downvote.async", updateKarma);
// addCallback("cancelUpvote.async", updateKarma);
// addCallback("cancelDownvote.async", updateKarma);
