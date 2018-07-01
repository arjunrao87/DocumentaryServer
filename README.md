# DocumentaryServer

#### Sample query

```
query name {
  searchByName(name: "Jack Reacher") {
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
}

query id {
  searchByID(id: "75780") {
    id
    vote_count
    video
    vote_average
    title
    popularity
    poster_path
    original_language
    original_title
    genres {
      id
    }
    belongs_to_collection {
      id
    }
    video
    videos {
      id
      site
    }
    production_companies {
      id
    }
    backdrop_path
    adult
    overview
    release_date
  }
}

```
