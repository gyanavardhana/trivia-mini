import { ToastContainer, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Navbar = () => {
  return (
    <>
      <div className="flex h-24 bg-gray-700 justify-center font-extrabold items-center text-slate-200 p-2">
        <h1 className=" text-5xl ">Trivia Game</h1>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
    </>
  );
};

export default Navbar;
