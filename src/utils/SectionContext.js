import { createContext, useContext, useState } from 'react';
import { sessionStorageSet } from './storageHelper';

const SectionContext = createContext();

export const useSection = () => useContext(SectionContext);

export const SectionProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('Stepone');

  const showSection = (section) => {
    setActiveSection(section);
    sessionStorageSet('activeSection', section)
  };

  const hideSection = () => {
    setActiveSection(null);
  };

  return (
    <SectionContext.Provider value={{ activeSection, showSection, hideSection }}>
      {children}
    </SectionContext.Provider>
  );
};