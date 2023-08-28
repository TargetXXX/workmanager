import api from "../api";

export interface User {
  id: number;
  name: string;
  email: string;
  group: string;
  username: string;
  password: string;
  image: string;
}

const getUsers = async (): Promise<User[] | null> => {
  try {
    const response = await api(`/get/users`);
    const data = response.data;
    return data;
  } catch (error) {
    return null;
  }
};

export const getSessionUser = async (): Promise<User | null> => {
  if (sessionStorage.getItem('token')) {
    api.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('token')}`;
    try {
      const response = await api('/logged');
      const data = response.data.user;

      if (data) {
        const sessionUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          group: data.group,
          username: data.username,
          password: data.password,
          image: data.image,
        };

        return sessionUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    return null;
  }
};

export default getUsers;
