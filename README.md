# DocumentaryServer

[![Greenkeeper badge](https://badges.greenkeeper.io/arjunrao87/documentary-server.svg)](https://greenkeeper.io/)

## Server infrastructure to help you search documentaries

### FB Bot available at

https://www.messenger.com/t/200967383642574/

### Server being run at

https://boiling-wave-58166.herokuapp.com/


#### Task list available at

https://trello.com/b/QfwpRzAm/documentary


#### Resources

https://github.com/jw84/messenger-bot-witai-tutorial

https://www.codementor.io/iykyvic/writing-your-nodejs-apps-using-es6-6dh0edw2o

https://dev-blog.apollodata.com/tutorial-building-a-graphql-server-cddaa023c035


#### Sample query

```
query get {
  search(input: {query: "Jack Reacher"}) {
    edges {
      node {
        id
        vote_count
        video
        vote_average
        title
        popularity
        poster_path
        original_language
        original_title
        genre_ids
        backdrop_path
        adult
        overview
        release_date
      }
      cursor
    }
    pageInfo {
      hasNextPage
    }
  }
}
```
