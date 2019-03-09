import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { registerComponent, Utils, getSetting, registerSetting, Head } from 'meteor/vulcan:lib';
import { compose } from 'react-apollo'

registerSetting('logoUrl', null, 'Absolute URL for the logo image');
registerSetting('title', 'My App', 'App title');
registerSetting('tagline', null, 'App tagline');
registerSetting('description');
registerSetting('siteImage', null, 'An image used to represent the site on social media');
registerSetting('faviconUrl', '/img/favicon.ico', 'Favicon absolute URL');

class HeadTags extends PureComponent {
  render() {

    const { url, title, type, description, author, publicationDate, postedDate, tags, sectionName } = this.props
    const formattedDescription = `${getSetting('tagline')}. ${getSetting('secondaryTagline')}`
    const descriptionTag = description || formattedDescription

    const isArticle = () => {
      return type.includes('article')
    }

    const isSection = () => {
      return type.includes('section')
    }

    const twitterCardType = isArticle ? 'summary_large_image' : 'summary'

    // default image meta: logo url, else site image defined in settings
    let image = !!getSetting('siteImage') ? getSetting('siteImage') : getSetting('squareLogoUrl');

    // overwrite default image if one is passed as props
    if (!!this.props.image) {
      image = this.props.image;
    }

    // add site url base if the image is stored locally
    if (!!image && image.indexOf('//') === -1) {
      // remove starting slash from image path if needed
      if (image.charAt(0) === '/') {
        image = image.slice(1);
      }
      image = Utils.getSiteUrl() + image;
    }

    return (
      <div>
        <Helmet>

          <title>{title}</title>

          <meta charSet='utf-8'/>
          <meta name='description' content={descriptionTag}/>
          <meta name='viewport' content='width=device-width, initial-scale=1'/>

          {/* Open Graph */}
          <meta property='og:site_name' content={title}/>

          {/* Author tags */}
          { author ? <meta property="author" content={author.name} /> : null }

          {/* facebook */}
          <meta property='og:type' content={type}/>
          <meta property='og:url' content={url}/>
          <meta property='og:image' content={image}/>
          <meta property='og:title' content={title}/>
          <meta property='og:locale' content={getSetting('locale')}/>
          <meta property='og:description' content={descriptionTag}/>
          { isSection && sectionName ? <meta property="article:section" content={sectionName} /> : null }
          { publicationDate != null ? <meta property="article:published_time" content={publicationDate} /> : null }
          { postedDate != null ? <meta property="article:modified_time" content={postedDate} /> : null }
          { tags.map((tag, index) => <meta key={index} property="article:tag" content={tag} />) }

          {/* twitter */}
          <meta name='twitter:card' content={twitterCardType}/>
          <meta name='twitter:site' content={getSetting('twitterHandle')}/>
          <meta name='twitter:image' content={image}/>
          <meta name='twitter:title' content={title}/>
          <meta name='twitter:description' content={descriptionTag}/>

          <link rel='canonical' href={url}/>
          <link name='favicon' rel='shortcut icon' href={getSetting('faviconUrl', '/img/favicon.ico')}/>

          {Head.meta.map((tag, index) => <meta key={index} {...tag}/>)}
          {Head.link.map((tag, index) => <link key={index} {...tag}/>)}
          {Head.script.map((tag, index) => <script key={index} {...tag}>{tag.contents}</script>)}

        </Helmet>

        {Head.components.map((componentOrArray, index) => {
          let HeadComponent;
          if (Array.isArray(componentOrArray)) {
            const [component, ...hocs] = componentOrArray;
            HeadComponent = compose(...hocs)(component);
          } else {
            HeadComponent = componentOrArray;
          }
          return <HeadComponent key={index} />
        })}

      </div>
    );
  }
}

HeadTags.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  sectionName: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  publicationDate: PropTypes.string,
  tags: PropTypes.array,
};

HeadTags.defaultProps = {
  url: Utils.getSiteUrl(),
  title: getSetting('title', 'My App'),
  type: 'website',
  description: getSetting('description'),
  tags: []
};

registerComponent('HeadTags', HeadTags);

export default HeadTags;
