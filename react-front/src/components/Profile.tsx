import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import groups from '../context/GroupsContext';
import { User } from '../utils/GetUser';
import { Link, useLocation } from 'react-router-dom';
import { update } from '../context/ApiContext';
import { FiLogOut, FiEdit, FiSave, FiX } from 'react-icons/fi';

interface ProfileProps {
  isModalOpen: boolean;
  closeModal: () => void;
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ isModalOpen, closeModal, user }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      maxWidth: '1000px',
      width: '80%',
      height: '80%',
      padding: '20px',
      border: 'none',
    },
  };
  
  const modalStyles2: React.CSSProperties = {
    height: '100%',
    width: '100%',
  };
  
  const modalStyles3: React.CSSProperties = {
    padding: '4vh 0',
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updatedUserData = { ...editedUser };

    if (!updatedUserData.username) {
      updatedUserData.username = user.username;
      editedUser.username = user.username;
    }

    if (!updatedUserData.email) {
      updatedUserData.email = user.email;
      editedUser.email = user.email;
    }
    
    if (!updatedUserData.name) {
      updatedUserData.name = user.name;
      editedUser.name = user.name;
    }
    
    if (!updatedUserData.password) {
      updatedUserData.password = user.password;
      editedUser.password = user.password;
    }



    await update(user.id, updatedUserData);
    setIsEditing(false);
    setEditedUser({ ...updatedUserData });
    window.location.reload();
  };

  useEffect(() => {
    editedUser.email = user.email;
    editedUser.name = user.name;
    editedUser.username = user.username;
  }, [location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} style={modalStyles}>
      <div className="modal-dialog modal-dialog-centered" style={modalStyles2}>
        <div className="modal-content " style={modalStyles2}>
          <div className="modal-header">
            <h5 className="modal-title">Perfil do Usuário</h5>
            <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <hr />
            <div className="mt-4 mb-4">
              <p className="mb-3 w-100" style={modalStyles3}>
                <strong>Username:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    placeholder={user.username}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.username
                )}
              </p>
              <p className="mb-3 w-100" style={modalStyles3}>
                <strong>Nome:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    placeholder={user.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.name
                )}
              </p>
              <p className="mb-3 w-100" style={modalStyles3}>
                <strong>Email:</strong> {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    value={editedUser.email}
                    placeholder={user.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.email
                )}
              </p>
              <p className="mb-0 w-100" style={modalStyles3}>
                <strong>Grupo:</strong> {groups[editedUser.group || user.group]}
              </p>
            </div>
            <hr />
          </div>
          <div className="modal-footer d-flex justify-content-between">
            <Link to="/logout" className="btn btn-danger mr-auto">
              <FiLogOut className='me-2' />
              Deslogar
            </Link>
            <div>
              {isEditing ? (
                <>
                  <button type="button" className="btn btn-primary m-1" onClick={handleSave}>
                    <FiSave className="me-2" />
                    Salvar
                  </button>
                  <button type="button" className="btn btn-secondary m-1" onClick={() => setIsEditing(false)}>
                    <FiX className="me-2" />
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-primary m-1" onClick={handleEdit}>
                    <FiEdit className="me-2" />
                    Editar
                  </button>
                  <button type="button" className="btn btn-secondary m-1" onClick={closeModal}>
                    <FiX className="me-2" />
                    Fechar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Profile;

