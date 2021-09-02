import React from "react"
import Rover from "./Rover"


const MOVE = {
    N: [0, 1],
    E: [1, 0],
    W: [-1, 0],
    S: [0, -1]
}

const TURN_LEFT = {
    N: "W",
    E: "N",
    W: "S",
    S: "E"
}

const TURN_RIGHT = {
    N: "E",
    E: "S",
    W: "N",
    S: "W"
}

class Mars extends React.Component {

    initialState = {
        start: null,
        end: null,
        ops: [],
        position: "0-0",
        direction: "N",
        error: null,
    };

    state = Object.assign({}, this.initialState);

    componentDidMount() {
        this.reset(() => {
            this.process(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.reset(() => {
            this.process(nextProps);
        });
    }

    reset = (cb) => {
        this.setState(this.initialState, cb);
    };

    process = (props) => {
        const { commands, position } = props;
        if (commands === '') {
            this.setState(this.initialState);
        } else {
            const positionParts = position.split(" ");
            this.setState(
                {
                    start: positionParts[0] + "-" + positionParts[1],
                    position: positionParts[0] + "-" + positionParts[1],
                    direction: positionParts[2]
                },
                () => {
                    if (props.started) {
                        this.execute(commands);
                    }
                }
            );
        }
    };

    execute = (commands) => {
        let ops = (commands || "").split("");
        this.setState({ ops }, () => {
            setTimeout(this.run.bind(this), 500);
        });
    };

    run = () => {
        let ops = this.state.ops.slice();
        let op = ops.shift();
        let newPosition = {};
        if (op === "l") {
            newPosition = this.turnRoverLeft();
        } else if (op === "r") {
            newPosition = this.turnRoverRight();
        } else if (op === "f") {
            newPosition = this.moveRoverForward();
        } else {
            console.log("Invalid command");
        }
        if (newPosition.error) {
            alert('Can not move beyond the borders');
        }
        this.setState(Object.assign(this.state, {
            ops,
            ...newPosition
        }), () => {
            if (this.state.ops.length > 0 && !this.state.error) {
                setTimeout(this.run.bind(this), 300);
            } else {
                this.setState({
                    end: this.state.position
                })
            }
        })

    };

    moveRoverForward = () => {
        const { size } = this.props;
        const { position, direction } = this.state;
        const move = MOVE[direction];
        const pos = position.split('-').map(Number);
        const x = pos[0] + move[0];
        const y = pos[1] + move[1];
        if (x < 0 || x >= size || y < 0 || y >= size) {
            return { error: true };
        }
        return {
            position: x + '-' + y
        };
    };

    turnRoverLeft = () => {
        const { direction } = this.state;
        return ({
            direction: TURN_LEFT[direction]
        });
    };

    turnRoverRight = () => {
        const { direction } = this.state;
        return ({
            direction: TURN_RIGHT[direction]
        });
    };

    render() {

        const { size } = this.props;
        let { position, direction } = this.state;
        let cells = [];
        for (let i = size - 1; i >= 0; i--) {
            for (let j = 0; j < size; j++) {
                cells.push(j + "-" + i);
            }
        }
        return (
            <ul className="mars">
                {cells.map(cell => {

                    let roverElm = null;
                    let cellStatus = '';

                    if (this.state.error && this.state.end === cell) {
                        cellStatus = 'error';
                    }
                    if (this.state.start === cell) {
                        cellStatus += ' start';
                    }
                    if (this.state.end === cell) {
                        cellStatus += ' end';
                    }

                    if (position === cell) {
                        roverElm = <Rover direction={direction} />;
                    }

                    return (
                        <li className={`cell ${cellStatus}`} key={cell}>
                            {roverElm}
                        </li>
                    );
                })}
            </ul>
        );
    }
}

export default Mars