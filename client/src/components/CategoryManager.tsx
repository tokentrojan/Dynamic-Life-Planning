import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";

const DEFAULT_DOC_ID = "default";
const DEFAULT_LABELS: Record<string, string> = {
  cat1: "Red",
  cat2: "Blue",
  cat3: "Green",
  cat4: "Yellow",
  cat5: "Grey",
  cat6: "Black",
};

const categoryColorMap: Record<string, string> = {
  cat1: "danger",
  cat2: "primary",
  cat3: "success",
  cat4: "warning",
  cat5: "secondary",
  cat6: "dark",
};

// Map badge variants to emojis
const variantEmojiMap: Record<string, string> = {
  danger: "🔴",
  primary: "🔵",
  success: "🟢",
  warning: "🟡",
  secondary: "⚪",
  dark: "⚫",
};

type Field = { key: string; label: string };

export default function CategoryManager() {
  const uid = auth.currentUser?.uid || "";
  const ref = doc(db, "users", uid, "Category", DEFAULT_DOC_ID);

  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (!uid) throw new Error("Not signed in");
        const snap = await getDoc(ref);
        let data: DocumentData;
        if (!snap.exists()) {
          await setDoc(ref, DEFAULT_LABELS);
          data = DEFAULT_LABELS;
        } else {
          data = snap.data();
        }
        setFields(
          Object.entries(data).map(([key, label]) => ({
            key,
            label: String(label),
          }))
        );
      } catch (e: any) {
        console.error("Error loading categories", e);
        setError(e.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [uid]);

  const handleChange = (key: string, label: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, label } : f)));
  };

  const handleSave = async () => {
    try {
      if (!uid) throw new Error("Not signed in");
      const updateMap: Record<string, string> = {};
      fields.forEach((f) => (updateMap[f.key] = f.label));
      await updateDoc(ref, updateMap);
      alert("Categories saved!");
    } catch (e: any) {
      console.error("Error saving categories", e);
      setError(e.message || "Failed to save categories");
    }
  };

  if (loading)
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container style={{ maxWidth: 600 }} className="mt-4">
      <h2>Edit Categories</h2>
      <Form>
        {fields.map(({ key, label }) => {
          const variant = categoryColorMap[key] || "light";
          const emoji = variantEmojiMap[variant] || "";
          return (
            <Form.Group as={Row} key={key} className="mb-3" controlId={key}>
              <Form.Label column sm={3}>
                {emoji}
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  value={label}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </Col>
            </Form.Group>
          );
        })}
        <Button onClick={handleSave} className="mt-2">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
}
