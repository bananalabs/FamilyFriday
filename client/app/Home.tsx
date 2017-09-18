import * as React from 'react';

const Home = () => {
  const groupStyle = {
    textAlign: 'center',
    marginTop: '15%'
  };
  const buttonStyle = {
    textDecoration: 'none',
    color: 'black',
    marginRight: '10px'
  };
  return (
    <div style={groupStyle}>
      <a className='btn btn-warning btn-lg' style={buttonStyle} href='/groups'>
        I'm hungry. Let's eat.
      </a>
      <a className='btn btn-warning btn-lg' style={buttonStyle} href='/addEmployee'>
        New hire. Join the group.
      </a>
    </div>
  );
};

export default Home;
