const express = require('express')
const app = express()

const {initializeDatabase}= require('./db/db.connect')
const Movie = require('./models/movie.models');
const { error } = require('console');

app.use(express.json())

initializeDatabase()

  

async function createMovie(newMovie){
    try{
     const movie= new Movie(newMovie)
     const saveMovie= await movie.save()
     return saveMovie
    }catch(error){
     throw error
    }
}

app.post('/movies',async(req,res)=>{
    try{
        const savedMovie= await createMovie(req.body)
        res.status(201).json({message:"movie added successfully." ,movie:savedMovie })
    }catch(error){
        console.error("Error adding movie:", error);

        res.status(500).json({error:"failed to add data"})
    }
})


//find a movie with a particular title
async function readMovieByTitle(movieTitle) {
    try{
        const movie = await Movie.findOne({title:movieTitle})
        return movie
    }catch(error){
        throw error
    }
}

app.get("/movies/:title", async(req,res)=>{
    try{
        const movie = await readMovieByTitle(req.params.title)
        if(movie){
            res.json(movie)
        }else{
            res.status(404).json({error:"movie not found."})
        }
    }catch(error){
        res.status(500).json({error:"Failed to fetch movie."})
    }
})


// to get all the movies in the database
async function  readAllMovies() {
    try{
        const allMovies = await Movie.find()
        return allMovies
    }catch(error){
        throw error
    }
}

app.get('/movies', async(req,res)=>{
    try{
        const movies = await readAllMovies()
        if(movies.length != 0){
            res.json(movies)
        }else{
            res.status(404).json({error:"No movie found"})
        }
    }catch(error){
        res.status(500).json({error:"failed to fetch movies"
        })
        throw error
    }
})



// get movie by director
async function readMovieByDirector(directorName) {
    try{
        const movieByDirector= await Movie.findOne({director:directorName})
        return movieByDirector
    }catch(error){
        throw error
    }
}

app.get('/movies/director/:directorName',async(req,res)=>{
    try{
        const movies= await readMovieByDirector(req.params.directorName)

        if(movies!=0){
            res.json(movies )
        }else{
            res.status(404).json({error:'movie not found'})
        }
    }catch{
        res.status(500).json({error:"failed to fetch the movies."})
    }
})



async function readMovieByGenre(genreName) {
    try{
        const movieByGenre= await Movie.find({genre: genreName})
        return movieByGenre
    }catch(error){
        throw(error)
    }
}


app.get('/movies/genre/:genreName', async(req,res)=>{
    try{
        const movies = await readMovieByGenre(req.params.genreName)
        if(movies != 0){
            res.json(movies)
        }else{
            res.status(404).json({error:"movie not found"})
        }
    }catch{
        res.status(500).json({error:"failed to fetch movies"})
    }
})

//delete movie by id
async function deleteMovie(movieId){
    try{
        const deletedMovie = await Movie.findByIdAndDelete(movieId)
        return deletedMovie
    }catch(error){
        console.log(error)
    }
}

app.delete('/movies/:movieId', async(req,res)=>{
    try{
        const deletedMovie= await deleteMovie(req.params.movieId)
        if(deletedMovie){
            res.status(200).json({message:"movie deleted successfully."})
        }
       
    }catch(error){
        res.status(500).json({error:"failed to delete data."})
    }
})

async function updateMovie(movieId, dataToUpdate) {
    try{
        const updatedMovie = await Movie.findByIdAndUpdate(movieId, dataToUpdate, {new:true})
        return updatedMovie
    }catch(error){
        throw error
    }
}

app.post('/movies/:movieId', async (req,res)=>{
    try{
        const updatedMovie= await updateMovie(req.params.movieId, req.body)

        if(updatedMovie){
            res.status(200).json({message:"movie updated successfully"})
        }else{
            res.status(404).json({error:"movie not found"})
        }
    }catch(error){
        res.status(500).json({error:"failed to update movie"})
    }
})


const PORT =3000
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})


    