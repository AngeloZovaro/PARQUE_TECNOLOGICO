import React, { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import '../styles/OverflowMenu.css';

function OverflowMenu({ options }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="overflow-menu-container" ref={menuRef}>
      <button onClick={handleToggle} className="overflow-menu-button">
        <BsThreeDotsVertical size={20} />
      </button>
      {isOpen && (
        <ul className="overflow-menu-options">
          {options.map((option, index) => (
            <li key={index} onClick={() => {
                option.onClick();
                setIsOpen(false);
            }} 
            className={`menu-option ${option.isDestructive ? 'destructive' : ''}`}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OverflowMenu;