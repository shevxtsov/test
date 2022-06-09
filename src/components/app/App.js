import { Component } from 'react'
import AppHeader from '../appHeader/AppHeader'
import MoviesList from '../moviesList/MoviesList'
import FavoritesList from '../favoritesList/FavoritesList'
import ErrorBoundary from '../errorBoundary/ErrorBoundary'
import ApiService from '../../services/ApiService'
import SearchInput from '../searchInput/SearchInput'

class App extends Component {
    state = {
        items: [],
        page: 1,
        limit: 3,
        total: null,
        hasNextPage: null,
        favorites: [],
        loading: null,
        error: false,
        newItemsLoading: false,
        searchText: '',
        counter: 0,
        sendTime: 1,
    }

    interval = null
    ApiService = new ApiService()

    getData = (page) => {
        this.setState({
            page: page || 1
        })
        this.onLoading()
        this.ApiService.getItems(this.state.searchText, {
            page: page || this.state.page,
            limit: this.state.limit
        })
            .then((data) => {
                this.onLoaded(data.Page)
            })
            .catch(this.onError)
    }

    onLoading = () => {
        this.setState({
            newItemsLoading: true,
            total: null
        })
    }

    onLoaded = ({media, pageInfo}) => {
        this.setState(({items}) => ({
            items: [...items, ...media],
            loading: false,
            newItemsLoading: false,
            total: pageInfo.total,
            hasNextPage: pageInfo.hasNextPage
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false,
            newItemsLoading: false
        })
    }

    addToFavorites = (id) => {
        const favoritedItem = this.state.items.filter((item) => item.id === id)

        if (this.state.favorites.includes(id)) {
            favoritedItem[0].isFavorited = false
            this.removeFromFavorites(id)
            return
        }

        favoritedItem[0].isFavorited = true

        this.setState(({favorites}) => ({
            favorites: [...favorites, id]
        }))
    }

    removeFromFavorites = (id) => {
        this.setState(({favorites}) => ({
            favorites: favorites.filter((el) => el !== id)
        }))
    }

    filteredMovies = () => {
        const {items, favorites} = this.state
        return items.filter((item) => favorites.includes(item.id))
    }

    onSearch = (value) => {
        if (!value) {
            this.clear()
            return
        }

        this.setState({
    	    counter: 0,
            loading: true,
            total: null,
            items: [],
            favorites: []
        })
        
        clearInterval(this.interval)
        this.interval = null
        this.interval = setInterval(() => {
            if (this.state.counter === this.state.sendTime) {
                clearInterval(this.interval)
                this.getData()
                return
            }

            this.setState({
                counter: this.state.counter + 1
            })
        }, 1000)

        this.setState({
            searchText: value.toLowerCase()
        });
    }

    clear = () => {
        this.setState({
            searchText: '',
    	    counter: 0,
            loading: false,
            newItemsLoading: false
        })

        clearInterval(this.interval)
        this.interval = null
    }

    render() {
        const {items, limit, total, loading, newItemsLoading, error, page, hasNextPage, favorites} = this.state

        return (
            <div className="wrapper">
                <AppHeader/>
                <main>
                    <section className="movie-section">
                        <div className="container">
                            <h1 className="section-title text-center">Список аниме</h1>
                            <SearchInput onSearch={this.onSearch} clear={this.clear} />
                            <ErrorBoundary>
                                <MoviesList
                                    addToFavorites={this.addToFavorites}
                                    limit={limit}
                                    page={page}
                                    total={total}
                                    hasNextPage={hasNextPage}
                                    movies={items}
                                    loading={loading}
                                    newItemsLoading={newItemsLoading}
                                    error={error}
                                    moreItems={this.getData}
                                    favorites={favorites}
                                />
                            </ErrorBoundary>
                        </div>
                    </section>
                    <ErrorBoundary>
                        <FavoritesList
                            favorites={this.filteredMovies()}
                            removeFromFavorites={this.removeFromFavorites}
                        />
                    </ErrorBoundary>
                </main>
            </div>
        )
    }
}

export default App
