import toast from 'react-hot-toast';

const showToast = (type, message) => {
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast(message, {
        icon: '⚠️',
        style: {
          background: '#fef3c7',
          color: '#92400e',
        },
      });
      break;
    case 'info':
      toast(message, {
        icon: 'ℹ️',
        style: {
          background: '#e0f2fe',
          color: '#0369a1',
        },
      });
      break;
    default:
      toast(message);
  }
};

export default showToast;
