import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import { FaPlus, FaTrash, FaEdit, FaFilter, FaSearch } from 'react-icons/fa';
import { getSessionUser, User } from '../utils/GetUser';
import './UserPage.css';
import groups from '../context/GroupsContext';



const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [tempSelectedGroup, setTempSelectedGroup] = useState<string>('');
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;

  const filteredUsers = users.filter(
    (user) =>
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedGroup === '' || user.group === selectedGroup)
  );
  useEffect(() => {
    fetchData();
    getSessionUser().then((user) => setSessionUser(user));
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
  }, [filteredUsers]);

  const fetchData = async () => {
    try {
      Swal.showLoading();
      const response = await api('/get/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
      Swal.close();
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete',
      text: 'Você tem certeza que deseja excluir este usuário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (sessionUser && id === sessionUser.id) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Você não pode excluir o próprio usuário da sessão.',
        });
        return;
      }

      try {
        Swal.showLoading();
        await api.delete(`/delete/user/${id}`);
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Usuário deletado com sucesso!',
        });
        fetchData();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao deletar usuário.',
        });
      }
    }
  };

  const applyFilters = () => {
    setSelectedGroup(tempSelectedGroup);
    setShowFilterModal(false);
    setCurrentPage(1);
    fetchData();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };



  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const renderPagination = () => (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>
      <span>{currentPage}</span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próximo
      </button>
    </div>
  );

  const handleTempGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempSelectedGroup(e.target.value);
  };

  return (
    <div className="container">
      <h2>Usuários</h2>
      <div className="filter-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar usuário"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            className="btn btn-secondary filter-button"
            onClick={() => setShowFilterModal(true)}
          >
            <FaFilter /> Filtros
          </button>
        </div>
      </div>

      <div
        className={`modal fade${showFilterModal ? ' show' : ''}`}
        style={{ display: showFilterModal ? 'block' : 'none' }}
        tabIndex={-1}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Filtros</h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowFilterModal(false)}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="groupFilter">Grupo:</label>
                <select
                  id="groupFilter"
                  className="form-control"
                  value={tempSelectedGroup}
                  onChange={handleTempGroupChange}
                >
                  <option value="">Todos os Grupos</option>
                  {Object.entries(groups).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowFilterModal(false)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Grupo</th>
              {sessionUser && parseInt(sessionUser.group) >= 10 ? (<th>Ações</th>): null}
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className='avatarUser'><img src={user.image} alt="User avatar" /></td>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{groups[user.group]}</td>
                {sessionUser && parseInt(sessionUser.group) >= 10 ?
                
              
                  (     <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                    <Link to={`/users/${user.id}`} className="btn btn-warning">
                      <FaEdit />
                    </Link>
                  </td>) : null
              }
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {renderPagination()}

      {sessionUser && parseInt(sessionUser.group) >= 10 ? (<Link to="/register" className="btn btn-primary">
        <FaPlus />
      </Link>) : null} 

    </div>
  );
};

export default UsersPage;
