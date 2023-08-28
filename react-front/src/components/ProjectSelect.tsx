import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '../api';
import getUsers, { User } from '../utils/GetUser';

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T> {
  apiUrl: string;
  name: string;
  attributeLabel: keyof T;
  onChange?: (value: string) => void;
  selected?: string;
}

const ProjectSelect: React.FC<SelectProps<User>> = ({ apiUrl, name, attributeLabel, onChange, selected }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await api(apiUrl);
        const optionData = response.data.map((user: User) => ({
          value: user.id.toString(),
          label: user[attributeLabel] as string,
        }));
        setOptions(optionData);
        const fetchedUsers = await getUsers();
        if (fetchedUsers) setUsers(fetchedUsers);
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchData();
  }, [apiUrl, attributeLabel]);

  useEffect(() => {
    if (!isLoading && selected !== undefined && selected !== '0') {
      const staff = getStaff(parseFloat(selected));
      if (staff) {
        setSelectedOption({
          value: staff.id.toString(),
          label: staff[attributeLabel] as string,
        });
      }
    }
  }, [selected, attributeLabel, isLoading]);

  const handleSelectChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);

    if (onChange !== undefined) {
      selectedOption ? onChange(selectedOption.value) : onChange('');
    }
  };

  const getStaff = (id: number) => {
    const staff = users.find(user => user.id === id);
    return staff;
  };

  return (
    <div>
      <h2>{name}</h2>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
        isSearchable={true}
        placeholder="Pesquisar..."
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectSelect;
