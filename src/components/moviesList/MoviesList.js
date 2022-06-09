import ErrorMessage from '../errorMessage/ErrorMessage'
import Skeleton from '../skeleton/Skeleton'
import MovieCard from '../movieCard/MovieCard'
import { range } from '../../helpers/utils'

const MoviesList = (props) => {
    const {movies, limit, page, total, hasNextPage, loading, error, newItemsLoading, favorites} = props
    const errorMessage = error ? <ErrorMessage/> : null
    const moviesList = movies.length ? movies.map((item) => <MovieCard movie={item} key={item.id} addToFavorites={props.addToFavorites} favorites={favorites} />) : null
    const skeleton = loading || newItemsLoading ? range(0, limit).map((item) => <Skeleton key={item} />) : null
    const notFound = total === 0 ? <h3 className="not-found">Nothing found</h3> : null

    return (
        <div className="movies-list-content">
            {errorMessage}
            <div className="row">
                {notFound}
                {moviesList}
                {skeleton}
            </div>
            <div className="row row--center">
                <button
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    style={{'display': total === 0 || !hasNextPage || !movies.length ? 'none' : 'block'}}
                    onClick={() => props.moreItems(page + 1)}
                >
                    <span>more</span>
                </button>
            </div>
        </div>
    )
}

export default MoviesList