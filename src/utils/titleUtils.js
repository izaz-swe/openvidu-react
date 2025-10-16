export const updateDocumentTitle = (pathname, items) => {
    const item = items.find(item => item.path === pathname || 
      (item.path === '/dashboard' && pathname === '/'));
    
    if (item) {
      document.title = `${item.label} | Doctel`;
    } else {
      document.title = 'Doctel';
    }
  };
  