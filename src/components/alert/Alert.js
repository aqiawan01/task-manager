import React, { useEffect } from 'react';
import "./Alert.css"
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Alert = ({alertContent, alertClass, onCloseAlert}) => {
  useEffect(() => {
   const int =  setTimeout(() => {
      onCloseAlert();
    }, 3000);

    return () => {
      clearTimeout(int);
    }
  });

  return (
    <div className={`alert ${alertClass}`}>
        <FaExclamationCircle size={16} className="icon-x" />
        <span className="msg">{alertContent}</span>
        <div className="close-btn">
            <FaTimes size={19} onClick={onCloseAlert} className="icon-x" />
        </div>
    </div>
  )
}

export default Alert