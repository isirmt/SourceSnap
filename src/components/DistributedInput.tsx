export default function DistributedInput({ value, setValue, placeholder, num }: {
  value: string | undefined;
  setValue:
  ((value: React.SetStateAction<string | undefined>) => void) |
  ((value: React.SetStateAction<string>) => void);
  placeholder: string;
  num: number;
}) {
  return <input
    type='text'
    placeholder={placeholder}
    value={value}
    onChange={(e) => setValue(e.target.value)}
    className={`transition-colors block border w-1/${num} px-1 outline-none hover:border-gray-400 focus:border-gray-400`}
  />
}