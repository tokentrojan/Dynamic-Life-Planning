import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { db, auth } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface CategoryMap {
  [key: string]: string;
}

const DEFAULT_ID = "default";

export default function CategoryManager() {
  const [categories, setCategories] = useState<CategoryMap>({
    cat1: "",
    cat2: "",
    cat3: "",
    cat4: "",
    cat5: "",
    cat6: "",
    cat7: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCats() {
      const userID = auth.currentUser?.uid;
      if (!userID) {
        setMessage("User not signed in");
        setLoading(false);
        return;
      }
      const ref = doc(db, "users", userID, "Category", DEFAULT_ID);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCategories(snap.data() as CategoryMap);
      } else {
        // initialize default
        const defaults: CategoryMap = {
          cat1: "Red",
          cat2: "Blue",
          cat3: "Green",
          cat4: "Yellow",
          cat5: "Grey",
          cat6: "Black",
          cat7: "None",
        };
        await setDoc(ref, defaults);
        setCategories(defaults);
      }
      setLoading(false);
    }
    fetchCats();
  }, []);

  const handleChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCategories((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSave = async () => {
    setSaving(true);
    const userID = auth.currentUser?.uid;
    if (!userID) {
      setMessage("User not signed in");
      setSaving(false);
      return;
    }
    try {
      const ref = doc(db, "users", userID, "Category", DEFAULT_ID);
      await updateDoc(ref, categories);
      setMessage("Categories saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error saving categories.");
    }
    setSaving(false);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <Card className="p-3">
      <h4>Manage Categories</h4>
      {message && <Alert variant="info">{message}</Alert>}
      <Form>
        {Object.entries(categories).map(([key, label]) => (
          <Form.Group key={key} className="mb-3">
            <Form.Label>{key.toUpperCase()}</Form.Label>
            <Form.Control
              type="text"
              value={label}
              onChange={handleChange(key)}
            />
          </Form.Group>
        ))}
      </Form>
      <Button onClick={handleSave} disabled={saving} className="mt-2">
        {saving ? "Saving..." : "Save Categories"}
      </Button>
    </Card>
  );
}
