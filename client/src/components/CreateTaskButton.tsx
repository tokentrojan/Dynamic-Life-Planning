
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateTaskButton = () => {
  const navigate = useNavigate();

  return (
    <OverlayTrigger
      placement="left"
      overlay={<Tooltip id="tooltip-create">Create Task</Tooltip>}
    >
      <Button
        variant="primary"
        title="Create Task"
        onClick={() => navigate('/create')}
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
  );
};

export default CreateTaskButton;