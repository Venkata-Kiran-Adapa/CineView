import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [error, setError] = useState(false); 
  const [watchedList, setWatchedList] = useState([]);
  const [selectedid, setSelectedId] = useState(null);

  useEffect(
    function () {
      async function fetchMovieDetails() {
        const debounceTimeout = setTimeout(() => {
          if (search.length > 3) {
            async function fetchMovieDetails() {
              try {
                const res = await fetch(`https://www.omdbapi.com/?apikey=3077618e&s=${search}`);
                const data = await res.json();
                setMovieList(data.Search);
                if (!data.Search) setError(true);
                else setError(false);
              } catch (error) {
                setError(true);
              }
            }
            fetchMovieDetails();
          }
        }, 500);
        return () => clearTimeout(debounceTimeout);
      }
      fetchMovieDetails();
    },
    [search]
  );

  return (
    <>
      <Header search={search} setSearch={setSearch} nums={movieList?.length} />
      <Main
        movieList={movieList}
        search={search}
        error={error}
        watchedList={watchedList}
        setSelectedId={setSelectedId}
        selectedid={selectedid}
        setWatchedList={setWatchedList}
      />
    </>
  );
}

function Header({ search, setSearch, nums = 0 }) {
  return (
    <header>
      <h1 style={{ margin: "10px" }}>🎞️ CineView</h1>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="   Enter Movie name.....!"
        style={{
          width:"50%",
          borderRadius:"20px",
          backgroundColor:"#151515",
          color:"whitesmoke",
        }}
      ></input>
      <h3>Found {nums} results</h3>
    </header>
  );
}

function Main({
  movieList,
  search,
  error,
  watchedList,
  setSelectedId,
  selectedid,
}) {

 const [selectedMovie , setSelectedMovie] =useState([]);

function handleSelectedMovie(movie){
  console.log(movie)
  const selectMovie={
    Title:movie.Title,
    Year:movie.Year,
    Poster:movie.Poster,
    Runtime:movie.Runtime,
    imdbRating:movie.imdbRating,
    Plot:movie.Plot,
    Released:movie.Released,
    Actors:movie.Actors,
    Director:movie.Director,
    Genre:movie.Genre,
  };
  setSelectedMovie(selectMovie)
}

  useEffect(()=> {
              async function fetchSelectedMovieDetails() {
                const res = await fetch(`https://www.omdbapi.com/?apikey=3077618e&i=${selectedid}`);
                const data = await res.json();
                handleSelectedMovie(data);
              }
      fetchSelectedMovieDetails();
    },[selectedid]
  );

  return (
    <>
      <main>
        <Box>
          {" "}
          {error ? (
            <p style={{ textAlign: "center" }}>
              Give more details so we can find what you want...!
            </p>
          ) : movieList && movieList.length !== 0 && search.length !== 0 ? (
            <ul className="movieList">
              {movieList.map((movie) => (
                <MovieItem
                  item={movie}
                  key={movie.imdbID}
                  setSelectedId={setSelectedId}
                />
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center" }}>Search For Movies....:)</p>
          )}
        </Box>


        
        <Box>
          { !selectedid ? 
            <div className="moviesWatchedBox" style={{ height: "100%" }}>
              <div className="moviesWatchedStats">
                <h2> Search for Movies You wanna know about...!</h2>
              </div>
              <div className="movieList">
               {watchedList.map((movie) => (
                  <MovieItem
                    item={movie}
                    selectedid={selectedid}
                    key={movie.imdbID}
                  />
                ))} 
            </div>
            </div>  : (
              search ? selectedMovie ? <SelectedMoviedisplay selectedMovie={selectedMovie}/> : <p>Try Again...!</p> : <> <h2> Search for Movies You wanna know about...!</h2></>
              
            )
          }  
  
        </Box>
      </main>
    </>
  );
}


function  SelectedMoviedisplay({selectedMovie}){
   return(
    <div className="selectedMovieDisplay">
       <div className="SelectedMovieInfo"  style={{textAlign:'center'}}>
       <img  src={selectedMovie?.Poster} style={{width:'30%'}} alt="selectedMovie.Title"></img>
       <div>
          <h2>{selectedMovie.Title}</h2>
          <div style={{display:'flex',gap:'0.5em',justifyContent:'center'}}>
          <h5 >{selectedMovie.Year}</h5>
          <h5> {selectedMovie.Runtime}</h5>
          </div>
          <p>{selectedMovie.Genre}</p>
          <p>⭐ {selectedMovie.imdbRating} IMDb Rating</p>
       </div>
              
       </div>
       <div className="SelectedMoviePlot">
       <p> <span style={{color:'red', fontSize:'larger'}}> Actors<br></br> </span>{selectedMovie.Actors}</p>
       <p> <span style={{color:'red', fontSize:'larger'}}> Director<br></br> </span>{selectedMovie.Director}</p>
       <p> <span style={{color:'red', fontSize:'larger'}}> Plot<br></br> </span>{selectedMovie.Plot}</p>
       </div>
    </div>
   )
}


function Box({ children }) {
  return <div className="box"> {children} </div>;
}

function MovieItem({ item, setSelectedId }) {
  function handleSelectedMovie() {
    setSelectedId((e) => (e = item.imdbID));
  }

  return (
    <li className="movieitem" onClick={handleSelectedMovie}>
      {item ? (
        <>
          <img src={item.Poster} alt={item.Title} className="image"></img>
          <div>
            <p>{item.Title}</p>
            <p>{item.Year}</p>
          </div>
        </>
      ) : (
        <p>No item Found...!</p>
      )}
    </li>
  );
}

export default App;
