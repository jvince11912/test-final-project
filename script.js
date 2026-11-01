// //https://www.omdbapi.com/?apikey=a5384297&s=marvel

const API_KEY = "a5384297";
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const moviesGrid = document.querySelector('#moviesGrid');

const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');

let currentMovies = [];


//Event Listener
searchForm.addEventListener('submit', (event) => {
   event.preventDefault();
   const searchTerm = searchInput.value.trim();
   if (searchTerm) { 
      fetchMovies(searchTerm);
   }
})


function showSkeletons() {
    const skeletons = Array(10).fill(0).map(() => `
        <div class="movie-card movie-card--skeleton">
         <div class="movie-card__img movie-card__img--skeleton"></div>
          <div class="movie-card__title movie-card__title--skeleton"></div>
          <div class="movie-card__year movie-card__year--skeleton"></div>  
      </div>
    `).join('');
}

async function fetchMovies(searchTerm) {
    showSkeletons();

    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`);
        const data = await res.json();
   
        if (data.Response === "True") {
            currentMovies = data.Search;
            resultsInfo.textContent = `Showing: ${searchTerm}`;
            sortSelect.value = 'default';
            displayMovies(currentMovies);
        } else {
            resultsInfo.textContent = `Showing: ${searchTerm}`;
            moviesGrid.innerHTML = '<p>No Movies Found.</p>'
            currentMovies = [];
        }
    
     } catch (e) {
        console.log(e);
    }   finally  {
        console.log('finally');
    }
}


function displayMovies(movies) {
    const movieResults = movies.map((movie) => {
        const poster = movie.Poster != 'N.A' ? movie.Poster : '' ;

        return `
            <div class="movie-card">
                ${poster ? `<img class="movie-card__img" src="${poster}" alt="${movie.Title}">` :  `<div class="movie-card__poster-placeholder"> </div>` }
                  <h2 class="movie-card__title">${movie.Title}</h2>
                  <p class="movie-card__year">${movie.Year}</p>
            </div> 
            `;
    }).join('');
       
    moviesGrid.innerHTML = movieResults;

    // add error listeners after DON insertion
    moviesGrid.querySelectorAll('.movie-card__img').forEach(img => {
        img.addEventListener('error' , () => {
            const placeholder = document.createElement('div');
            placeholder.className = 'movie-card__poster-placeholder';
            placeholder.innerHTML = 'Movie Poster<br>Not Available';
            img.replaceWith(placeholder);
        });
    });
}

// Sort movies
sortSelect.addEventListener('change', (e) => {
    sortMovies(e.target.value);
})

function sortMovies(sortType) {
    let  sortedMovies = [...currentMovies];

    if (sortType === 'a-z') {
        sortedMovies.sort((a,b) => a.Title.localeCompare(b.Title));
    } else if (sortType === 'z-a') {
        sortedMovies.sort((a,b) => b.Title.localeCompare(a.Title));
    } else if (sortType === 'newest') {
        sortedMovies.sort((a,b) => Number(b.Year) - Number(a.Year));
    } else if (sortType === 'oldest') {
        sortedMovies.sort((a,b) => Number(a.Year) - Number(b.Year));
    }
 
    displayMovies(sortedMovies);
}

