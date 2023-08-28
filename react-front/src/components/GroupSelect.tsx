import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useSpring, animated } from 'react-spring';
import api from '../api';
import groups from '../context/GroupsContext';

interface Option {
  value: string;
  label: string;
}

interface GroupSelectProps {
  selected?: string;
  onChange?: (value: string) => void;
}

const GroupSelect: React.FC<GroupSelectProps> = ({ selected, onChange }) => {


  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    setOptions([
      {
        value: '1',
        label: 'Usuário',
      },
      {
        value: '10',
        label: 'Admin',
      },
    ]);

    if (selected !== undefined && selected in groups) {
      setSelectedOption({
        value: `${selected}`,
        label: groups[selected],
      });
    }
  }, [selected]);

  const springProps = useSpring({
    opacity: selectedOption ? 1 : 0,
    transform: `scale(${selectedOption ? 1 : 0.5})`,
  });

  const handleSelectChange = (selectedOption: Option | null) => {
    setSelectedOption(selectedOption);


    if(onChange !== undefined) {
        selectedOption ? onChange(selectedOption.value) : onChange('');
    }
    
  };

  return (
    <div>
      <h2>Selecione o grupo:</h2>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelectChange}
        isSearchable={true}
        placeholder="Pesquisar..."
      />

    </div>
  );
};

export default GroupSelect;
