import { toast } from 'react-toastify';

const showToast = (type, message) => toast[type](message, {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
});

export default showToast;
