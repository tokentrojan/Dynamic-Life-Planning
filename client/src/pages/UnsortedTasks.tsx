import { Container, ListGroup } from 'react-bootstrap';

function UnsortedTasks() {
  return (
    <Container className="mt-4">
      <h2>Unsorted Tasks</h2>
      <ListGroup>
        <ListGroup.Item>Unsorted Task 1</ListGroup.Item>
        <ListGroup.Item>Unsorted Task 2</ListGroup.Item>
      </ListGroup>
    </Container>
  );
}

export default UnsortedTasks;