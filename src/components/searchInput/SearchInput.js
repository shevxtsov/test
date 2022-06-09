import { Component } from 'react'

import './searchInput.scss'
import closeIcon from '../../resources/img/close.svg'

class SearchInput extends Component {
    state = {
        typing: false,
        value: ''
    }

    handleChange = (event) => {
        const value = event.target.value
        
        this.setState({
            value: value,
            typing: event.target.value ? true : false
        })
        this.props.onSearch(value)
    }

    clear = () => {
        this.setState({
            value: '',
            typing: false
        })
        this.props.clear()
    }

    render() {
        const {value, typing} = this.state
        const closeBtn = typing ? <Button clear={this.clear} /> : null

        return (
            <fieldset className="form-control">
                <input 
                    onChange={this.handleChange}
                    type="text"
                    value={value}
                    placeholder="Search..."
                />
                {closeBtn}
            </fieldset>
        )
    }
}

const Button = (props) => {
    return (
        <button
            className="search-close"
            onClick={() => props.clear()}
        >
            <img src={closeIcon} alt="close" />
        </button>
    )
}

export default SearchInput
