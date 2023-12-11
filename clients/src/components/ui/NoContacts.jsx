import React from 'react';
import nocontacts from '../../assets/no-contacts.jpg'; // Importing the image file

// Component for displaying a message when there are no contacts
function NoContacts() {
  return (
    <div className='flex flex-col items-center justify-center my-auto'>
      {/* Image indicating no contacts */}
      <img className='w-[170px] h-[180px]' src={nocontacts} alt='No Contacts' />
      <h4 className='text-[20px] text-[#166e48] font-semibold tracking-wide'>No Contacts Yet</h4>
      <span className='text-[13px] text-[#111b21] font-medium tracking-wide'>Search for people</span>
    </div>
  );
}

export default NoContacts;
