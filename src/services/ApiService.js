export default class ApiService {
    _apiUrl = 'https://graphql.anilist.co'

    getResource = async (url, options) => {
        const res = await fetch(url, options)
    
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json()
    }

    getItems = async (searchText, {page, limit}) => {
        const query = `
            query ($id: Int, $page: Int, $perPage: Int, $search: String) {
                Page (page: $page, perPage: $perPage) {
                    pageInfo {
                        total
                        currentPage
                        lastPage
                        hasNextPage
                        perPage
                    }
                    media (id: $id, search: $search) {
                        id
                        title {
                            romaji
                            native
                        }
                    }
                }
            }
        `

        const variables = {
            search: searchText,
            page: page,
            perPage: limit
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

        const res = await this.getResource(this._apiUrl, options)
        return res.data
    }
}