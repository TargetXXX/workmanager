import React from 'react';
import Profile from './Profile';
import { User } from '../utils/GetUser';
import imga from '../images/index.jpg';
interface HomeProps {
  loggedUser: User;
}

const style: React.CSSProperties = {
  width: '100%',

}
const Home: React.FC<HomeProps> = ({loggedUser}) => {
  return (
    <div  style={style}>
      <img src={imga} className='savatar' alt="" style={style}/>
    </div>
  );
};

export default Home;
