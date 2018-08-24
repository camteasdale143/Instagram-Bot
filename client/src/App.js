import React, { Component } from 'react';

class App extends Component {

  this.state =
  render() {
    return (
      <div>
        <header style={styles.headerStyle}>
          <h1 style={styles.headerTextStyle}>Bot Dashboard</h1>
        </header>
        <div style={styles.contentContainerColumnarDividerStyles}>
          <div style={styles.columnContentStyles}>
            <h3>
              Account Credentials
            </h3>
            <small>Username</small>
            <input type='text'>
            </input>
            <small>Password</small>
            <input type='password'>
            </input>
          </div>
          <div style={styles.columnContentStyles}>
            <h3>
              Flagged Account
            </h3>
            <input type='text'>
            </input>
          </div>
          <div style={styles.columnContentStyles}>
            <h3>
              Target Market
            </h3>
          </div>
        </div>

        <div>
          <button>Start Following</button>
        </div>
      </div>
    );
  }
}

const styles={
  headerStyle: {
    backgroundColor: '#222',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: 150,
    marginTop: 0,
  },
  headerTextStyle: {
    color: '#eee',
    textAlign: 'center'
  },
  contentContainerColumnarDividerStyles: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 20
  },
  columnContentStyles: {
    backgroundColor: '#eee',
    width: 400,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
}

export default App;
