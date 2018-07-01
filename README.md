# DocumentaryServer

#### Sample query

```
fragment movieFragment on Movie {
  id
  adult
  backdrop_path
  original_language
  original_title
  overview
  popularity
  poster_path
  release_date
  title
  video
  vote_average
  vote_count
}

query get {
  searchByName(name: "Jack Reacher") {
    ...movieFragment
    genre_ids
  }
}

query id {
  searchByID(id: "75780") {
    ...movieFragment
    genres {
      id
      name
    }
    belongs_to_collection {
      id
      name
      poster_path
      backdrop_path
    }
    video
    videos {
      id
      site
      iso_639_1
      iso_3166_1
      key
      name
    }
    production_companies {
      id
      name
    }
  }
}
```

*Additional queries*
https://developers.themoviedb.org/3/getting-started/search-and-query-for-details