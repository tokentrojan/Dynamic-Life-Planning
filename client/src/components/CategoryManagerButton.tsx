import { useState } from "react";
import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import CategoryManager from "./CategoryManager";

export default function CategoryManagerButton() {
  const [show, setShow] = useState(false);

  return (
    <>
      <OverlayTrigger
        placement="left"
        overlay={<Tooltip id="tooltip-cats">Edit Categories</Tooltip>}
      >
        <Button
          variant="secondary"
          onClick={() => setShow(true)}
          style={{
            position: "fixed",
            bottom: "100px", // sit above “+” task button
            right: "20px",
            zIndex: 1050,
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "1.5rem",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          🛠
        </Button>
      </OverlayTrigger>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CategoryManager />
        </Modal.Body>
      </Modal>
    </>
  );
}
