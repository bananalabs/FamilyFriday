import * as React from 'react';

const Home = () => {
  const groupStyle = {
    textAlign: 'center',
    marginTop: '15%'
  };
  const buttonStyle = {
    textDecoration: 'none',
    color: 'black'
  };
  return (
    <div style={groupStyle}>
      <button type='button' className='btn btn-warning btn-lg' style={{marginRight: '10px'}}>
        <a href='/groups' style={buttonStyle}>I'm hungry. Let's eat.</a>
      </button>
      <button type='button' className='btn btn-warning btn-lg'>
        <a href='/addEmployee' style={buttonStyle}>New hire. Join the group.</a>
      </button>
    </div>
  );
};

export default Home;
