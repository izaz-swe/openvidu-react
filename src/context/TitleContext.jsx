import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const TitleContext = createContext();

export const TitleProvider = ({ children, defaultTitle = 'Doctel Admin Portal' }) => {
  const [title, setTitle] = useState(defaultTitle);
  
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

TitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultTitle: PropTypes.string
};

TitleProvider.defaultProps = {
  defaultTitle: 'Doctel Admin Portal'
};