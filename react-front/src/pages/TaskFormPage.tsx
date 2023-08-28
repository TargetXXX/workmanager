import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import api from '../api';
import Swal from 'sweetalert2';
import ProjectSelect from '../components/ProjectSelect';
import './TaskFormPage.css';

interface Task {
  id: number;
  name: string;
  description: string;
  staff: string;
}

const TaskFormPage: React.FC = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [task, setTask] = useState<Task>({
    id: 0,
    name: '',
    description: '',
    staff: '0'
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        Swal.showLoading();
        const response = await api.get(`/get/tasks/${id}`);
        if(response.data) {
          setTask(response.data);
        } else {
          history('/register/task');
        }

        Swal.close();
      } catch (error) {
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      Swal.showLoading();

      await api.put(`http://127.0.0.1:8000/api/edit/task/${id}`, task);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Tarefa salva com sucesso.',
      });
      history('/tasks');
    } catch (error) {
    }
  };

  return (
    <div className="container">
      <h2>{id ? 'Editar tarefa' : 'Adicionar tarefa'}</h2>
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
          <textarea
            maxLength={5000}
            className="form-control"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <ProjectSelect selected={task.staff} onChange={(value: string) => setTask({ ...task, staff: value })} apiUrl={'/get/users'} attributeLabel='name' name={'Selecione o administrador'} />
        </div>
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </form>
    </div>
  );
};

export default TaskFormPage;
