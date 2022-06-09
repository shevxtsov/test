import './movieCard.scss'
import thumbnail from '../../resources/img/thumb-default.jpeg'
import like from '../../resources/img/like.svg'
import likeFilled from '../../resources/img/like-fill.svg'

const MovieCard = (props) => {
    const movie = props.movie
    const isFavorited = props.favorites ? props.favorites.includes(movie.id) : false

    return (
        <div
            className="card"
        >
            <div className="card__thumb">
                <img src={thumbnail} alt={movie.title.romaji} />
            </div>
            <div className="card__content">
                <div className="card__title">{movie.title.romaji}</div>
                <div className="card__desc">{movie.title.native}</div>
                <div
                    className="card__icon"
                    onClick={() => props.addToFavorites(movie.id)}
                >
                    <img src={isFavorited ? likeFilled : like} alt="Like" />
                </div>
            </div>
        </div>
    )
}

export default MovieCard