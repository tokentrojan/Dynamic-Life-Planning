import { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../AuthContext";
import { Colour } from "../types/Task"; // adjust path if needed

export interface Category {
  id: string;
  color: Colour;
  label: string;
  userID: string;
}

function CategoryManager() {
  const { currentUser } = useAuth();
  const userID = currentUser?.uid || localStorage.getItem("cachedUID");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!userID) return;

      const snapshot = await getDocs(
        collection(db, "users", userID, "categories")
      );
      const loaded = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];

      setCategories(loaded);
      setLoading(false);
    };

    fetchCategories();
  }, [userID]);

  const handleLabelChange = (id: string, newLabel: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, label: newLabel } : cat))
    );
  };

  const handleSave = async () => {
    if (!userID) return;
    await Promise.all(
      categories.map((cat) =>
        updateDoc(doc(db, "users", userID, "categories", cat.id), {
          label: cat.label,
        })
      )
    );
    alert("Categories updated!");
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <Container className="mt-4" style={{ maxWidth: 600 }}>
      <h2>Edit Categories</h2>
      <Form>
        {categories.map((cat) => (
          <Form.Group as={Row} key={cat.id} className="mb-3">
            <Form.Label column sm={3}>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: cat.color,
                }}
              ></div>
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                value={cat.label}
                onChange={(e) => handleLabelChange(cat.id, e.target.value)}
              />
            </Col>
          </Form.Group>
        ))}

        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}

export default CategoryManager;
