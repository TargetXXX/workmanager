import React, { useState, useEffect } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import getUsers, { User } from '../utils/GetUser';

interface Option {
  value: string;
  label: string;
  name: string;
  image: string;
}

interface Props {
  onSelectFilter: (criteria: number[]) => void;
}

const FilterSelect: React.FC<Props> = ({ onSelectFilter }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const fetchedUsers = await getUsers();
        if (fetchedUsers) {
          setUsers(fetchedUsers);
          const optionData: Option[] = fetchedUsers.map((user: User) => ({
            value: user.id.toString(),
            name: user.name.toString(),
            image: user.image,
            label: user.name,
          }));

          setOptions(optionData);
        }
      } catch (error) {
        console.error('Erro ao buscar opções:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleSelectChange = (selected: MultiValue<Option>) => {
    if (selected) {
        let selectGroup: number[] = [];

        if (selected.length > 0) {
            selected.forEach((opt) => {
                selectGroup.push(parseInt(opt.value));
            })
        }

        
        setSelectedOptions(selected);
      onSelectFilter(selectGroup);
    }
  };

  const formatOptionLabel = ({ name, image }: Option) => (
    <div>
      <img
        src={image}
        alt={name}
        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      />
      <span>{name}</span>
    </div>
  );

  return (
    <div>
      <Select
        options={options}
        value={selectedOptions}
        formatOptionLabel={formatOptionLabel}
        onChange={handleSelectChange}
        isSearchable={true}
        placeholder="Filtrar por usuário(s)..."
        isLoading={isLoading}
        isMulti={true}
      />
    </div>
  );
};

export default FilterSelect;
