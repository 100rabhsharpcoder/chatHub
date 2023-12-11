import React, { useEffect } from 'react';
import { validUser } from '../apis/auth';
import { useNavigate } from 'react-router-dom';

function Start() {
  const pageRoute = useNavigate();

  // Check if the user is valid and redirect accordingly
  useEffect(() => {
    const isValid = async () => {
      try {
        const data = await validUser(); // Check if the user is valid
        if (!data?.user) {
          pageRoute('/login'); // If not valid, redirect to the login page
        } else {
          pageRoute('/chats'); // If valid, redirect to the chats page
        }
      } catch (error) {
        console.error('Error checking user validity:', error);
        // Handle error, e.g., redirect to an error page
      }
    };

    isValid();
  }, [pageRoute]);

  return (
    <div className='bg-[#fff] flex items-center justify-center w-[100vw] h-[100vh] flex items-center flex-col -gap-y-10'>
      <lottie-player
        src='https://assets1.lottiefiles.com/private_files/lf30_kanwuonz.json'
        background='transparent'
        speed='1'
        style={{ width: '300px', height: '260px' }}
        loop
        autoplay
      ></lottie-player>
      <h3 className='font-semibold text-[13px] tracking-wider relative -top-16'>
        Please Wait. It Might take some time
      </h3>
    </div>
  );
}

export default Start;
