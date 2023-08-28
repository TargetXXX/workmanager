import React, { useState, useEffect, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import ProjectSelect from '../components/ProjectSelect';
import { getSessionUser, User } from '../utils/GetUser';

interface Task {
  id: number;
  name: string;
  description: string;
  staff: string;
}

const TaskRegister: React.FC = () => {
  const history = useNavigate();
  const [task, setTask] = useState<Task>({
    id: 0,
    name: '',
    description: '',
    staff: '0'
  });
  const [sessionUser, setSessionUser] = useState<User | undefined>();

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const session = await getSessionUser();
        if (session) {
          setSessionUser(session);
          setTask((prevTask) => ({
            ...prevTask,
            staff: session.id.toString()
          }));
        }
      } catch (error) {
        console.error('Error fetching session user:', error);
      }
    };

    fetchSessionUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Swal.showLoading();

      await api.post('http://127.0.0.1:8000/api/register/task', task);

      Swal.hideLoading();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Tarefa registrada com sucesso.',
      });
      history('/tasks');
    } catch (error) {
    }
  };
  const textstyle: CSSProperties = {
    maxHeight: '300px',
    minHeight: '300px',
  }
  return (
    <div className="container">
      <h2>Adicionar tarefa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome:</label>
          <input
            type="text"
            className="form-control"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição:</label>
          <textarea style={textstyle}
            maxLength={5000}
            className="form-control"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
        </div>
        {sessionUser ? (
          <div className="mb-3">
            <ProjectSelect
              selected={task.staff}
              onChange={(value: string) =>
                setTask({ ...task, staff: value })
              }
              apiUrl={'/get/users'}
              attributeLabel='name'
              name={'Selecione o administrador'}
            />
          </div>
        ) : null}
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default TaskRegister;