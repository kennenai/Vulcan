import { Components, registerComponent, withMutation, withMessages } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { Button } from 'semantic-ui-react'
import Cookies from 'universal-cookie'
import Users from 'meteor/vulcan:users'

const cookies = new Cookies();
// this component is used as a custom controller in user's account edit (cf. ./custom_fields.js)
class NewsletterSubscribe extends PureComponent {

  // check if fields is true or falsy (no value = not subscribed)
  isSubscribed = () => {
    const user = Users.getUser(this.props.document)
    return user && user.newsletter_subscribeToNewsletter;
  }

  subscribeUnsubscribe = async () => {

    const { path, updateCurrentValues, throwError } = this.props;

    const user = Users.getUser(this.props.document)
    const mutationName = this.isSubscribed() ? 'removeUserNewsletter' : 'addUserNewsletter';
    const mutation = this.props[mutationName];

    try {

      await mutation({userId: user._id});

      updateCurrentValues({ [path]: !this.isSubscribed() });

      // remove the cookie if they are now unsubscribed
      if (!this.isSubscribed()) {
        cookies.remove('showSignupBox')
      }
      // display a nice message to the client
      this.props.flash({ id: 'newsletter.subscription_updated', type: 'success'});

    } catch(error) {
      throwError(error);
    }
  }

  render() {

    return (
      this.props.document.email
        ? (
          <div className="form-group row">
            <label className="control-label col-sm-3"></label>
              <div className="col-sm-9">
                <Button
                  basic
                  primary
                  onClick={this.subscribeUnsubscribe}
                >
                  <FormattedMessage id={this.isSubscribed() ? 'newsletter.unsubscribe' : 'newsletter.subscribe'}/>
                </Button>
            </div>
         </div>
       ) : <span><FormattedMessage id={'newsletter.missing_email'}/></span>
    )
  }
}

const addOptions = {name: 'addUserNewsletter', args: {userId: 'String'}};
const removeOptions = {name: 'removeUserNewsletter', args: {userId: 'String'}};

registerComponent('NewsletterSubscribe', NewsletterSubscribe, withMutation(addOptions), withMutation(removeOptions), withMessages);
