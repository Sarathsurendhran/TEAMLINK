import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OneToOneAudioCallAlert({roomId, setAudioCallAlert}) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate()

  const handleAccept = () => {
    // Handle accept call logic
    navigate(`/audio-call/${roomId}`)
    handleClose();
  };
  const handleDecline = () => {
    // Handle decline call logic
    setAudioCallAlert(false)
    handleClose();
  };

  return (
    <div>
      {/* <button
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleOpen}
      >
        Open Audio Call Modal
      </button> */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Incoming Audio Call</h2>
            <p className="mb-4">You have an incoming audio call. Do you want to accept it?</p>
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleAccept}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleDecline}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
