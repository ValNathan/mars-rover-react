
function Rover(props) {
    return (
        <div className={`rover ${props.direction}`}>
            <div className="compass"></div>
        </div>
    )
}

export default Rover