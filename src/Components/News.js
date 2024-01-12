import React, { Component } from 'react'
import NewsItems from './NewsItems'
import PropTypes from 'prop-types'
import spinner from './spinner';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

  static defaultProps ={
        pageSize:8,
        country:"in"
  }
  static propTypes ={
        pageSize:PropTypes.number,
        country:PropTypes.string,
        category:PropTypes.string
  }
  capitalizeFirstLetter = (string)=>
  {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
  constructor(props){
    super(props);
    // console.log("hi");
    this.state={
      articles: [],
      loading : false,
      page:1,
      totalResults:0

    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;

  }

  //lifecycle method - runs after render is executed
  async componentDidMount(){
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=1&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);//we are using fetch api here
      let parsedData = await data.json();
      // console.log(parsedData);
      this.setState({articles : parsedData.articles,
        totalResults : parsedData.totalResults
      });

  } 
  //we can determine total number of next that we can do by setting a page size(articles per page) and knowing total articles
  NextClick = async () =>{
    if(this.state.page + 1 > (Math.ceil(this.state.totalResults/this.props.pageSize)))
    {
      //next page over do nothing
    }
    else{

      console.log("next");
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);//we are using fetch api here
      let parsedData = await data.json();
      // console.log(parsedData);
      this.setState({
        page : this.state.page + 1,
        articles : parsedData.articles
        
      })
    }
    
  }
  PrevClick = async () =>{
    console.log("prev");
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);//we are using fetch api here
    let parsedData = await data.json();
    // console.log(parsedData);
    this.setState({
      page : this.state.page - 1,
      articles : parsedData.articles})
    
  }
  fetchMoreData = async () => {
        this.setState({page:this.state.page + 1});
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=1&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);//we are using fetch api here
      let parsedData = await data.json();
      // console.log(parsedData);
      this.setState({articles :this.state.articles.concat( parsedData.articles),
        totalResults : parsedData.totalResults
      });
        

  };
  render() {
    return (
      <div className='container my-3'>
        <h1 className='text-center'>NewsMonkey - Top Headlines</h1>
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<h4>Loading...</h4>}
        >
        <div className="row">
        {/* .map function is used to iterate over elemnents that is all articles here  */}
        {this.state.articles.map((element)=>{
          return  <div className='col-md-4' key={element.url}>
          <NewsItems author={!element.author?"Anonymous":element.author} time={element.publishedAt} title={element.title} description={element.description?element.description.slice(0,50):""} imageUrl={element.urlToImage} newsUrl={element.url}/>
          {/* element.description.length>=45?element.description.slice(0,45):element.title */}
          </div>
        })}
        
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button type="button" disabled={this.state.page<=1} onClick={this.PrevClick} className="btn btn-success"> &larr; Previous </button>
        <button type="button" disabled={this.state.page + 1 > (Math.ceil(this.state.totalResults/this.props.pageSize))} className="btn btn-success " onClick={this.NextClick} >Next  &rarr;</button>
        </div> */}
      </div>
      
    )
  }
}

export default News