import React from 'react';
import Mars from './components/Mars';

const GRID_SIZE = 10

class App extends React.Component {

  state = {
    commands: '',
    commandsToExecute: '',
    started: false,
    startPosition: '00N'
  };

  addCommand = (e) => {
    this.setState({
      commands: this.state.commands + e.target.value
    })
  };

  //display sample in input
  displaySample = (e) => {
    this.setState({
      commands: e.target.value
    });
  };

  //run simulation
  run = () => {
    this.setState({
      started: true,
      commandsToExecute: this.state.commands,
      startPosition: this.state.startPosition
    });

  };

  //reset simulation
  clear = () => {
    this.setState({
      commands: '',
      started: false,
      commandsToExecute: ''
    });
  };

  //end simulation
  stop = () => {
    this.setState({
      started: false
    });
  };

  //check if characters are only "f", "r" or "l". If not, you can't press start button
  checkCommand = (text) => {
    var replacedText = text.toLowerCase().replaceAll("f", "").replaceAll("l", "").replaceAll("r", "");
    if (replacedText.length === 0 && text.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    let position = this.state.startPosition;
    position = position.split('').join(' ');
    return (
      <div className='app'>
        <div className='title'>
          <h1 className='app-name'>Mars Rover React</h1>
          <div className='control-panel'>
            <div className='execution'>
              <button onClick={this.clear} className='reset'>Reset</button>
              <input type="text" value={this.state.commands} readOnly={this.state.started} onChange={(e) => this.setState({ commands: e.target.value })} />
              <button className='cta' disabled={this.checkCommand(this.state.commands)} onClick={this.run}>Start</button>
            </div>
            <div className='samples'>
              <label>Demo: </label>
              <ul>
                <li>
                  <button value={'rfflfflfrff'} onClick={this.displaySample}>rfflfflfrff</button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Mars
          size={GRID_SIZE}
          position={position}
          commands={this.state.commandsToExecute}
          started={this.state.started}
          onDone={this.stop}
        />
      </div>
    )
  }
}

export default App;
