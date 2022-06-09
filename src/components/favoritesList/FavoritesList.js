import FavoriteCard from "../favoriteCard/FavoriteCard"

const FavoritesList = (props) => {
    const title = props.favorites.length ? <h2 className="section-title text-center">Любимое аниме</h2> : null
    
    return (
        <section className="favorite-movies-section">
            <div className="container">
                {title}
                <div className="row row--around">
                    {
                        props.favorites.map((item) => {
                            return (
                                <FavoriteCard
                                    movie={item}
                                    key={item.id}
                                    removeFromFavorites={props.removeFromFavorites}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default FavoritesList