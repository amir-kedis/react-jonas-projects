import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorageState";
import { useKeyPress } from "./useKeyPress";

const average = (arr) =>
  arr.reduce((acc, cur, _, arr) => acc + cur / arr.length, 0);

const KEY = "93a5fb3b";

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorage([], "watched");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const handleSetSelectedMovie = (id) => {
    setSelectedMovie((prevId) => (prevId == id ? null : id));
  };

  const handleCloseSelectedMovie = () => {
    setSelectedMovie(null);
  };

  const handleAddMovieToWatched = (newWatchedMovie) => {
    setWatched((watched) =>
      watched.filter((mov) => mov.imdbID !== newWatchedMovie.imdbID),
    );
    setWatched((watched) => [...watched, newWatchedMovie]);
  };

  const handleDeleteMovieFromWatched = (deletedMovie) => {
    setWatched((watched) =>
      watched.filter((mov) => mov.imdbID !== deletedMovie.imdbID),
    );
  };
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSetSelectedMovie={handleSetSelectedMovie}
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedMovie ? (
            <MovieDetails
              movieId={selectedMovie}
              closeMovieDetails={handleCloseSelectedMovie}
              onAddNewMovie={handleAddMovieToWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteMovie={handleDeleteMovieFromWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading ...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️ </span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  useEffect(() => {
    function callback(e) {
      if (e.key === "Enter") inputEl.current?.focus();
    }

    document.addEventListener("keypress", callback);

    return () => {
      document.removeEventListener("keypress", callback);
    };
  }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, onSetSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSetSelectedMovie={onSetSelectedMovie}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, onSetSelectedMovie }) {
  return (
    <li onClick={() => onSetSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ movieId, closeMovieDetails, onAddNewMovie, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map((mov) => mov.imdbID).includes(movieId);
  const watchedRating = watched.find(
    (mov) => mov.imdbID == movieId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const addMovieToWatched = () => {
    const newWatchedMovie = {
      imdbID: movieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddNewMovie(newWatchedMovie);
    closeMovieDetails();
  };

  useKeyPress("Escape", closeMovieDetails);

  useEffect(() => {
    if (title) document.title = `Movie | ${title}`;

    return () => {
      document.title = "usepopcorn";
    };
  }, [title]);

  useEffect(() => {
    async function fetchMovie() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?i=${movieId}&apikey=${KEY}`,
      );

      if (!res.ok) throw new Error("failed to fetch movie");

      const data = await res.json();

      setMovie(data);
      setIsLoading(false);
    }

    fetchMovie();
  }, [movieId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={closeMovieDetails} className="btn-back">
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} imdb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className="btn-add" onClick={addMovieToWatched}>
                      ➕ Add to the list
                    </button>
                  )}
                </>
              ) : (
                <p>You watched this movie and rated it {watchedRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring: {actors}</p>
            <p>Directed by: {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteMovie(movie)}>
          X
        </button>
      </div>
    </li>
  );
}
