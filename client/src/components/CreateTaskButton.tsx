
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useState } from 'react';
import TaskModal from './TaskModal';

const CreateTaskButton = () => {
  const [showModal, setShowModal] = useState(false);

return (
  <>
    <OverlayTrigger
      placement="left"
      overlay={<Tooltip id="tooltip-create">Create Task</Tooltip>}
    >
      <Button
        variant="primary"
        title="Create Task"
        onClick={() =>  setShowModal(true)} // No more navigation
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1050,
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '2rem',
          lineHeight: '1',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        +
      </Button>
    </OverlayTrigger>
    {/* No task passed = Create mode */}
      <TaskModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default CreateTaskButton;