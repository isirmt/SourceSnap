import { SetStateAction } from 'react';

export default function DistributedInput({
  value,
  setValue,
  onChange,
  placeholder,
  num,
}: {
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  setValue: (value: SetStateAction<string | undefined> & SetStateAction<string>) => void;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
  placeholder: string;
  num: number;
}) {
  return (
    <input
      type='text'
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      className={`block border transition-colors w-1/${num} px-1 outline-none hover:border-gray-400 focus:border-gray-400`}
    />
  );
}
