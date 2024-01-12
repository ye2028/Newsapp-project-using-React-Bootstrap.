import React, { Component } from 'react'

export class NewsItems extends Component {
  render() {
    let {title,description,imageUrl,newsUrl,author,time} = this.props;
    return (
      <div><div className="card" >
      <img src={!imageUrl?"https://static.vecteezy.com/system/resources/thumbnails/006/299/370/original/world-breaking-news-digital-earth-hud-rotating-globe-rotating-free-video.jpg":imageUrl} className="card-img-top" alt="..."/>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}...</p>
        <p class="card-text"><small>-By {author} Submitted at {new Date(time).toUTCString()}</small></p>
        <a href={newsUrl} target="_blank"  rel="noreferrer" className="btn btn-sm btn-primary">Read more</a>
      </div>
    </div></div>
    )
  }
}

export default NewsItems