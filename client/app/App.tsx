import * as React from 'react';
import * as fetch from 'isomorphic-fetch';

export interface Props {
  children: any;
}

const App = (props: Props) => {
  const style = {
    textAlign: 'center',
    marginTop: '2%'
  };
  return (
    <div>
      <h2 style={style}>
        <a style={{textDecoration: 'none', color: 'black'}} href='/'>Family Friday</a>
      </h2>
      {props.children}
    </div>
  );
};

export default App;
