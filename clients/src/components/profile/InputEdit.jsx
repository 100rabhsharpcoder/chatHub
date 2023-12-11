import React, { useState } from 'react';
import { TbEdit } from 'react-icons/tb';
import { BsCheck2 } from 'react-icons/bs';

// Component for editable input with an edit button and a submit button
function InputEdit({ type, handleChange, input, handleSubmit }) {
  // State to manage whether the input is editable or not
  const [editable, setEditable] = useState(false);

  // Function to handle the submission and toggle the edit mode
  const submitButton = () => {
    handleSubmit();
    setEditable(false);
  };

  return (
    <>
      <div className='flex flex-col py-4 mt-4 bg-[#ffff] shadow-md px-4 gap-y-3'>
        <p className='text-[12px] text-[#166e48] font-medium tracking-wide'>Your name</p>

        {/* Render input and buttons based on whether it is editable or not */}
        {!editable ? (
          <div className='flex justify-between items-center'>
            {/* Displaying the non-editable input */}
            <p className='text-[14.5px] text-[#3b4a54]'>{input}</p>

            {/* Button to toggle the input into editable mode */}
            <button onClick={() => setEditable(!editable)}>
              <TbEdit className='w-[21px] h-[21px]' />
            </button>
          </div>
        ) : (
          // Displaying the input in editable mode along with submit button
          <div className='flex items-center justify-between'>
            <div>
              {/* Editable input field */}
              <input name={type} onChange={handleChange} className='text-[14.5px] text-[#3b4a54] outline-0' type='text' value={input} />
            </div>
            <div className='flex items-center gap-x-4'>
              {/* Submit button to save the changes and exit editable mode */}
              <button onClick={submitButton}>
                <BsCheck2 className='w-[21px] h-[21px]' />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default InputEdit;
