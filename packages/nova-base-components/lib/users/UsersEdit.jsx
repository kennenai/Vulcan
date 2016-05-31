import React, { PropTypes, Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import NovaForm from "meteor/nova:forms";

import { Messages } from "meteor/nova:core";

const UsersEdit = ({document, currentUser}) => {

  const user = document;
  //const label = `Edit profile for ${Users.getDisplayName(user)}`;

  return (
    <Telescope.components.CanEditUser user={currentUser} userToEdit={user}>
      <div className="page users-edit-form">
        <h2 className="page-title users-edit-form-title">Edit Account</h2>
        <NovaForm 
          currentUser={currentUser}
          collection={Meteor.users} 
          document={user} 
          methodName="users.edit"
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Meteor.users)}
          successCallback={(user)=>{
            Messages.flash("User updated.", "success");
          }}
        />
        <Row className="users-newsletter-settings">
          <Col sm={3}>
            Newsletter Settings
          </Col>
          <Col sm={9}>
            <Telescope.components.NewsletterButton
              successCallback={(result) => Messages.flash("Newsletter subscription updated", "success")}
              user={user}
            />
          </Col>
        </Row>
      </div>
    </Telescope.components.CanEditUser>
  )
};

  
UsersEdit.propTypes = {
  document: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
};

UsersEdit.displayName = "UsersEdit";

module.exports = UsersEdit;
export default UsersEdit;