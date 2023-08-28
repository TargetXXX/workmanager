import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaFilter, FaPlus, FaTrash } from 'react-icons/fa';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import api from '../api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import getUsers, { User, getSessionUser } from '../utils/GetUser';
import './TasksPage.css';
import FilterSelect from '../components/filterSelect';

const MySwal = withReactContent(Swal);

interface Task {
  id: number;
  name: string;
  description: string;
  status: number;
  staff: number;
  assignee: number | null;
}

const TasksPage: React.FC = () => {
  const [filterCriteria, setFilterCriteria] = useState<number[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sessionUser, setSessionUser] = useState<User | null>();
  const [updateCounter, setUpdateCounter] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const history = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const taskIdFromQuery = searchParams.get('id');
  const [filteredUser, setFilteredUsers] = useState<User>();
  const [showPopup, setShowPopup] = useState(false);

 

  

  useEffect(() => {
    fetchTasksAndUsers();
  }, []);

  useEffect(() => {
    if (updateCounter > 0) {
      fetchTasksAndUsers();
    }
  }, [updateCounter]);

  useEffect(() => {
    if (taskIdFromQuery) {
      const matchingTask = tasks.find(task => task.id === parseInt(taskIdFromQuery));
      if (matchingTask) {
        openTaskModal(matchingTask, matchingTask.id);
      }
    }
  }, [taskIdFromQuery, tasks]);

  const handleCloseModal = () => {
    MySwal.close();
    history('/tasks');
  };
  const handleFilterSelect = (criteria: number[] | null) => {
    if (criteria && criteria.length >= 0) {
      setFilterCriteria(criteria);
    }

  };

  useEffect(() => {

    const filtered = filterCriteria.length > 0 ? tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterCriteria.includes(task.staff) || filterCriteria.find(crit => task.assignee == crit))
    ) : tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()));

    setFilteredTasks(filtered);

    const searchQueryNumber = parseInt(searchQuery);
    const matchingTask = tasks.find(task => task.id === searchQueryNumber);

    if (matchingTask) {
      openTaskModal(matchingTask, matchingTask.id);
    }
  }, [searchQuery, tasks, filterCriteria]);



  const fetchTasksAndUsers = async () => {
    try {
      const [tasksResponse, usersResponse, sessionResponse] = await Promise.all([
        api('/get/tasks'),
        getUsers(),
        getSessionUser(),
      ]);
      setTasks(tasksResponse.data);
      if (usersResponse) setUsers(usersResponse);
      if (sessionResponse) setSessionUser(sessionResponse);
      setIsLoadingTasks(false);
    } catch (error) {
      console.error('Erro ao requisitar dados:', error);
      setIsLoadingTasks(false);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setFilterCriteria([]);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const result = await MySwal.fire({
      title: 'Delete',
      text: 'Você tem certeza que deseja excluir esta tarefa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      MySwal.fire({
        title: 'Deletando...',
        allowOutsideClick: false,
        didOpen: () => {
          MySwal.showLoading();
        },
      });

      try {
        await api.delete(`/delete/task/${id}`);
        setUpdateCounter(updateCounter + 1);
        MySwal.close();
        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Tarefa deletada com sucesso!',
        });
      } catch (error) {
        MySwal.close();
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Erro ao deletar tarefa.',
        });
      }
    }
  };


  const handleEdit = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const result = await MySwal.fire({
      title: 'Edit',
      text: 'Você tem certeza que deseja ser redirecionado para a edição dessa tarefa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Editar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) history(`/tasks/${id}`);
  };
  const getStaff = (id: number) => {
    const staff = users.find((user) => user.id === id);
    return staff ? staff : null;
  };

  const getStaffName = (id: number) => {
    const staff = users.find((user) => user.id === id);
    return staff ? staff.name : 'Usuário não encontrado';
  };


  const getStatusName = (id: number) => {
    if (id === 0) {
      return <div className="stt">Pendente <div className="red"></div> </div>;
    } else if (id === 1) {
      return <div className="stt">Em andamento<div className="yellow"></div> </div>;
    } else if (id === 2) {
      return <div className="stt">Finalizada <div className="green"></div> </div>;
    } else {
      return <div className="stt">Indefinido <div className="black"></div> </div>;
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) return;

    const updatedTasks = Array.from(tasks);
    const movedTaskIndex = updatedTasks.findIndex((task) => task.id === parseInt(result.draggableId));
    const [movedTask] = updatedTasks.splice(movedTaskIndex, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    const updatedTask = {
      ...movedTask,
      status: result.destination.droppableId as number,
      assignee: result.destination.droppableId === '0' ? null : sessionUser?.id as number,
    };

    try {
      const loadingSwal = withReactContent(Swal);
      loadingSwal.fire({
        title: 'Atualizando...',
        allowOutsideClick: false,
        didOpen: () => {
          loadingSwal.showLoading();
        },
      });

      await api.put(`/edit/task/${updatedTask.id}`, updatedTask);
      await fetchTasksAndUsers();

      loadingSwal.close();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const openTaskModal = (task: Task, cardId: number) => {
    setSelectedTask(task);
    
    MySwal.fire({
      customClass: 'modal-b',
      title: task.name,
      html: (
        <div className="row">
          <div className="col-md-9 task-row-info">
            <div className="task-info">
              <p><strong>Descrição:</strong></p>
              <p>{task.description}</p>
            </div>
          </div>
          <div className="col-md-3 task-row-status">
            <div className="task-status">
              <p><strong>Status:</strong> {getStatusName(task.status)}</p>
              <hr />
              {task.assignee ? (
                <>
                  <p><strong>Assignee:</strong> {getStaffName(task.assignee)}</p>
                  <img src={getStaff(task.assignee)?.image} alt="Assignee avatar" className="avatar-image" />
                </>
              ) : 'Tarefa não atribuída'}
              <hr />
              <p><strong>Staff:</strong> {getStaffName(task.staff)}</p>
              <img src={getStaff(task.staff)?.image} alt="Staff avatar" className="avatar-image" />
            </div>
          </div>
        </div>
      ),
      showCancelButton: false,
      confirmButtonText: 'Fechar',
      didClose: handleCloseModal,
      footer: (
        <div className="modal-footer">
          <p className="text-muted task-modal-footer">{task.name} | {getStatusName(task.status)}</p>
        </div>
      ),
    });
  };
  

  const renderTask = (task: Task) => {
    const nameWords = task.name.split(' ');
    const titulo = nameWords.length > 0 ? nameWords[0] : '';
    const truncatedName = task.name.length > 50 ? task.name.substring(0, 50) + '...' : task.name;

    return (
      <Link to={`/tasks?id=${task.id}`} className={`task-item p-3 mb-3 rounded position-relative status-${task.status}`}>
        <div className={`task-content `}>
          {task.assignee ? (<p className='avatar'><img src={getStaff(task.assignee)?.image} alt="Assignee avatar" /></p>) : null}
          <p><strong> {truncatedName}</strong></p>
        </div>
        <div className={`task-footer `}>
          <div className='container-foter'>
            <hr />
          </div>
          <div className="task-footer-text">
            <strong>{titulo} </strong>
            {getStaff(task.staff)?.image ? (
              <img className='staffAvatar' src={getStaff(task.staff)?.image} alt="Staff avatar" />
            ) : null}
          </div>
        </div>
        <div className="task-icons">
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e, task.id);
            }}
          >
            <FaTrash size={16} color="red" />
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(e, task.id);
            }}
          >
            <FaEdit size={16} color="blue" />
          </div>
        </div>
      </Link>
    );
  };

  const renderStatusColumn = (status: number) => (
    <Droppable key={status} droppableId={status.toString()}>
      {(provided) => (
        <td
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="status-column status-c p-3"
        >
          {filteredTasks
            .filter((task) => task.status === status)
            .map((task, index) => (
              <Draggable
                disableInteractiveElementBlocking={true}
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderTask(task)}
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </td>
      )}
    </Droppable>
  );

  const renderTasksTable = () => {
    if (isLoadingTasks) {
      return <div className="text-center">Carregando tarefas...</div>;
    }

    return (
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Pendente</th>
              <th>Em andamento</th>
              <th>Finalizada</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {renderStatusColumn(0)}
              {renderStatusColumn(1)}
              {renderStatusColumn(2)}
            </tr>
          </tbody>
        </table>

      </div>
    );
  };



  return (
    <div className="container">
      <h2>Tarefas</h2>
      <input
        type="text"
        placeholder="Buscar tarefa"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control"
      />

      {sessionUser && parseInt(sessionUser.group) >= 10 ? (<Link to="/register/task" className="btn btn-primary mt-3 custombtn">
        <FaPlus /> Criar Tarefa
      </Link>) : null}
      <button className='btn btn-warning mt-3 custombtn' onClick={togglePopup}> <FaFilter color='black' /> Filtro por usuário</button>

      {showPopup && (
        <div className='mt-3'><FilterSelect onSelectFilter={handleFilterSelect} /></div>


      )}
      <DragDropContext onDragEnd={handleDragEnd}>
        {renderTasksTable()}
      </DragDropContext>

    </div>
  );
};

export default TasksPage;
