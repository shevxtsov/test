import './skeleton.scss'

const Skeleton = () => {
    return (
        <div className="skeleton">
            <div className="pulse skeleton__image"></div>
            <div className="pulse skeleton__block"></div>
            <div className="pulse skeleton__mini"></div>
            <div className="pulse skeleton__mini"></div>
        </div>
    )
}

export default Skeleton