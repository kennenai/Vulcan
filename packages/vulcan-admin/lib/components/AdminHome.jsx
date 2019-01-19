import React from 'react';
import { Components, withCurrentUser, AdminColumns } from 'meteor/vulcan:core';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import Users from 'meteor/vulcan:users';
import { Button, Header, Segment } from 'semantic-ui-react'

import '../modules/columns.js';

const fixPostDurations = () => {
  Meteor.call('updateReadingTime')
}

const AdminHome = ({ currentUser }) =>
  <div className="admin-home page">
    <Components.ShowIf check={Users.isAdmin} document={currentUser} failureComponent={<p className="admin-home-message"><FormattedMessage id="app.noPermission" /></p>}>
      <Components.Datatable
        collection={Users}
        columns={AdminColumns}
        options={{
          fragmentName: 'UsersAdmin',
          terms: {view: 'usersAdmin'},
          limit: 20
        }}
        showEdit={true}
      />
      <Segment>
        <Header as='h3'>Scripts</Header>
        <Button color='red' onClick={fixPostDurations}>Fix Post Durations</Button>
      </Segment>
    </Components.ShowIf>
  </div>

export default withCurrentUser(AdminHome);
