import React, { Dispatch, SetStateAction, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';

interface LoginProps {
    setAuth: Dispatch<SetStateAction<boolean>>;
  }
  
  const Login: React.FC<LoginProps> = ({ setAuth }) => {
    
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async () => {
      try {
        Swal.showLoading();
        const response = await api.post('/login', { username, password });
        const { token } = response.data;
        sessionStorage.setItem('token', token);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Logado com sucesso.',
        });
        setAuth(true); 
        navigate('/');
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Credenciais inválidas.',
        });
      }
    };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-header">Login</div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Usuário ou Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" onClick={handleLogin}>
                Entrar
              </button>
              <Link to="/register" className="btn btn-link">
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
