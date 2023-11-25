import React from 'react'

type Props = {
  options: string[]
  selectedOption: string
  onChange: (value: string) => void
}

const RadioButton = ({ options, selectedOption, onChange }: Props) => {
  return (
    <div>
      {options.map((option) => (
        <label key={option} style={{ margin: '0.5rem' }}>
          <input
            type='radio'
            value={option}
            onChange={() => onChange(option)}
            checked={selectedOption === option}
          />
          {option}
        </label>
      ))}
    </div>
  )
}

export default RadioButton
