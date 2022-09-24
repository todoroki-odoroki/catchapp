import React, { useCallback } from "react";
import {Textarea as  ChakraTextarea } from '@chakra-ui/react'


export type Props = {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const TextArea = ({ className, onChange, value }: Props) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.currentTarget.value)
  }, [onChange])

  return(
    <ChakraTextarea placeholder="今週なにしたんだい？" onBlur={handleChange} value={value} onChange={handleChange}/>
  )
};

export default TextArea;
