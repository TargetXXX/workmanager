import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { group } from 'console';
import groups from '../context/GroupsContext';
import { User } from '../utils/GetUser';
import Profile from './Profile';

interface NavProp {
  auth: boolean;
  loggedUser: User;
}


const Navbar: React.FC<NavProp> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const styles: React.CSSProperties = {
    position: 'absolute',
    right: '40px',
  };

  const styles2: React.CSSProperties = {
    color: 'lightcoral',
  };

  const styles3: React.CSSProperties = {
    position: 'absolute',
    left: '40px',
    top: '34px',
    fontSize: '30px',
    fontFamily: 'cursive',
  };



  const styles4: React.CSSProperties = {
    marginLeft: '250px',
  };


  const styleImg: React.CSSProperties = {
    borderRadius: '50%',
    height: '100px',
    width: '100px',
    position: 'absolute',
    right: '30px',
    top: '-24px',
  };
  const styleNavbar: React.CSSProperties = {
    height: '130px',
  }

  const styleText: React.CSSProperties = {
    fontFamily: 'cursive',
    fontSize: '25px',
  }
  
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark" style={styleNavbar}>
      <div className="">
        <Link className="navbar-brand" to="/" style={styles3}>
          WorkManager
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            {!props.auth ? (
              <>
                <li className="nav-item" style={styles4}>
                  <Link className="nav-link" to="/login" style={styleText}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" style={styleText}>Cadastrar-se</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item" style={styles4}>
                  <Link className="nav-link" to="/users" style={styleText}>Usuarios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks" style={styleText}>Tarefas</Link>
                </li>
                <li className="nav-item" style={styles}>
                  <button className="nav-link p-0" onClick={openModal} style={styles2}><img src={props.loggedUser.image} alt="" style={styleImg} /></button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <Profile isModalOpen={isModalOpen} closeModal={closeModal} user={props.loggedUser} />
    </nav>
  );
};

export default Navbar;
