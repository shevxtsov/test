import '../movieCard/movieCard.scss'
import thumbnail from '../../resources/img/thumb-default.jpeg'
import closeIcon from '../../resources/img/close.svg'

const FavoriteCard = (props) => {
    const movie = props.movie

    return (
        <div
            className="card is-favorited"
        >
            <div className="card__thumb">
                <img src={thumbnail} alt={movie.title.romaji} />
            </div>
            <div className="card__content">
                <div className="card__title">{movie.title.romaji}</div>
                <div
                    className="card__icon card__icon--close"
                    onClick={() => props.removeFromFavorites(movie.id)}
                >
                    <img src={closeIcon} alt="Close" />
                </div>
            </div>
        </div>
    )
}

export default FavoriteCard