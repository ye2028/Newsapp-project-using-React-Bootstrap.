import React, { Component } from 'react'
import NewsItems from './NewsItems'
import PropTypes from 'prop-types'
import spinner from './spinner';  // استيراد spinner
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
    this.state={
      articles: [],
      loading : false,
      page:1,
      totalResults:0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;

  }

  async componentDidMount(){
      this.setState({ loading: true });
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=1&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false
      });
  } 

  NextClick = async () =>{
    if(this.state.page + 1 > (Math.ceil(this.state.totalResults/this.props.pageSize))) {
      //next page over do nothing
    } else {
      this.setState({ loading: true });
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();
      this.setState({
        page: this.state.page + 1,
        articles: parsedData.articles,
        loading: false
      });
    }
  }

  PrevClick = async () =>{
    this.setState({ loading: true });
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      page: this.state.page - 1,
      articles: parsedData.articles,
      loading: false
    });
  }

  fetchMoreData = async () => {
    this.setState({ loading: true });
    this.setState({ page: this.state.page + 1 });
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=1a63f8589a984036b1bfe00f2701a7f2&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading: false
    });
  };

  render() {
    return (
      <div className='container my-3'>
        <h1 className='text-center'>NewsMonkey - Top Headlines</h1>
        {this.state.loading && <img src={spinner} alt="loading" />}  {/* عرض مؤشر التحميل */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<img src={spinner} alt="loading" />}  {/* عرض مؤشر التحميل داخل InfiniteScroll */}
        >
        <div className="row">
        {this.state.articles.map((element) => {
          return  <div className='col-md-4' key={element.url}>
          <NewsItems author={!element.author ? "Anonymous" : element.author} time={element.publishedAt} title={element.title} description={element.description ? element.description.slice(0, 50) : ""} imageUrl={element.urlToImage} newsUrl={element.url} />
          </div>
        })}
        </div>
        </InfiniteScroll>
      </div>
    )
  }
}

export default News
