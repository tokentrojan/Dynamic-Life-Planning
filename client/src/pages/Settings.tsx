import { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Nav, Alert, Spinner } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useUserSettings } from '../utils/userSettings';

const Settings = () => {
  const { backgroundColor, setBackgroundColor } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use the Firebase settings hook
  const { settings, loading, updateProfile, updateNotifications, updatePrivacy, updateAppearance } = useUserSettings();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Local form states
  const [selectedColor, setSelectedColor] = useState(backgroundColor);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [privacy, setPrivacy] = useState(settings.privacy);

  // Update form states when Firebase settings load
  useEffect(() => {
    if (!loading) {
      setDisplayName(settings.profile.displayName);
      setBio(settings.profile.bio);
      setProfileImage(settings.profile.profileImageUrl || null);
      setNotifications(settings.notifications);
      setPrivacy(settings.privacy);
      setSelectedColor(settings.appearance.backgroundColor);
    }
  }, [settings, loading]);

  // Color options
  const colorOptions = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f8f9fa' },
    { name: 'Light Blue', value: '#e3f2fd' },
    { name: 'Light Green', value: '#e8f5e8' },
    { name: 'Light Yellow', value: '#fff9c4' },
    { name: 'Light Pink', value: '#fce4ec' },
    { name: 'Light Purple', value: '#f3e5f5' },
    { name: 'Light Orange', value: '#fff3e0' },
    { name: 'Cream', value: '#fefefe' },
    { name: 'Light Teal', value: '#e0f2f1' },
  ];

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setProfileImage(base64String);
      setUploadError('');
      setUploadSuccess('Profile picture updated! Remember to save.');
    };
    reader.readAsDataURL(file);
  };

  const handleChangeProfilePicture = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePicture = () => {
    setProfileImage(null);
    setUploadSuccess('Profile picture removed! Remember to save.');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // NOTIFICATION HANDLERS
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    const success = await updateNotifications(notifications);
    setSaving(false);
    
    if (success) {
      setUploadSuccess('Notification settings saved successfully!');
    } else {
      setUploadError('Failed to save notification settings');
    }
    
    setTimeout(() => {
      setUploadSuccess('');
      setUploadError('');
    }, 3000);
  };

  // PRIVACY HANDLERS 
  const handlePrivacyChange = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    const success = await updatePrivacy(privacy);
    setSaving(false);
    
    if (success) {
      setUploadSuccess('Privacy settings saved successfully!');
    } else {
      setUploadError('Failed to save privacy settings');
    }
    
    setTimeout(() => {
      setUploadSuccess('');
      setUploadError('');
    }, 3000);
  };

  // THEME HANDLERS
  const handleSave = async () => {
    setSaving(true);
    setBackgroundColor(selectedColor);
    
    const success = await updateAppearance({ backgroundColor: selectedColor });
    setSaving(false);
    
    if (success) {
      setUploadSuccess('Theme saved successfully!');
    } else {
      setUploadError('Failed to save theme');
    }
    
    setTimeout(() => {
      setUploadSuccess('');
      setUploadError('');
    }, 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const success = await updateProfile({
      displayName,
      bio,
      profileImageUrl: profileImage || undefined,
    });
    setSaving(false);
    
    if (success) {
      setUploadSuccess('Profile saved successfully!');
    } else {
      setUploadError('Failed to save profile');
    }
    
    setTimeout(() => {
      setUploadSuccess('');
      setUploadError('');
    }, 3000);
  };

  if (loading) {
    return (
      <Container className="pt-4 text-center">
        <Spinner animation="border" />
        <p>Loading settings...</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <Container className="pt-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="d-flex align-items-center mb-4">
              <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-3">
                ← Back
              </Button>
              <h2 className="mb-0">Settings</h2>
            </div>

            {uploadError && (
              <Alert variant="danger" className="mb-3">
                {uploadError}
              </Alert>
            )}
            {uploadSuccess && (
              <Alert variant="success" className="mb-3">
                {uploadSuccess}
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'appearance')}>
                  <Nav.Item>
                    <Nav.Link eventKey="appearance">Appearance</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notifications">Notifications</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="privacy">Privacy</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>

              <Card.Body>
                {/* Appearance Tab */}
                {activeTab === 'appearance' && (
                  <div>
                    <h4 className="mb-4">Theme Settings</h4>
                    <Form>
                      <Form.Group className="mb-4">
                        <Form.Label><strong>Background Color</strong></Form.Label>
                        <Form.Select
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          size="lg"
                        >
                          {colorOptions.map((color) => (
                            <option key={color.value} value={color.value}>
                              {color.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label><strong>Preview</strong></Form.Label>
                        <div
                          style={{
                            backgroundColor: selectedColor,
                            border: '2px solid #dee2e6',
                            borderRadius: '8px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: selectedColor === '#ffffff' ? '#000' : '#fff',
                            fontSize: '16px',
                            fontWeight: 'bold'
                          }}
                        >
                          Background Preview
                        </div>
                      </Form.Group>

                      <div className="d-flex gap-2 justify-content-end">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} disabled={saving}>
                          {saving ? <Spinner animation="border" size="sm" /> : 'Save'}
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h4 className="mb-4">Profile Information</h4>
                    
                    <div className="text-center mb-4">
                      <div 
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          margin: '0 auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px',
                          color: 'white',
                          fontWeight: 'bold',
                          backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: profileImage ? 'transparent' : '#007bff',
                          border: '3px solid #dee2e6'
                        }}
                      >
                        {!profileImage && (displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U')}
                      </div>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      
                      <div className="mt-3">
                        <Button variant="outline-primary" onClick={handleChangeProfilePicture} className="me-2" size="sm">
                          Change Picture
                        </Button>
                        {profileImage && (
                          <Button variant="outline-danger" onClick={handleRemoveProfilePicture} size="sm">
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>

                    <Form>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label><strong>Display Name</strong></Form.Label>
                            <Form.Control
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Enter your display name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label><strong>Email</strong></Form.Label>
                            <Form.Control
                              type="email"
                              value={currentUser?.email || ''}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label><strong>Bio</strong></Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell others about yourself..."
                        />
                      </Form.Group>

                      <Button variant="primary" onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Save Profile'}
                      </Button>
                    </Form>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h4 className="mb-4">Notification Preferences</h4>
                    
                    <Form>
                      <div className="mb-4">
                        <h5>Email Notifications</h5>
                        <Form.Check
                          type="checkbox"
                          label="Task reminders"
                          checked={notifications.taskReminders}
                          onChange={() => handleNotificationChange('taskReminders')}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Weekly summary"
                          checked={notifications.weeklySummary}
                          onChange={() => handleNotificationChange('weeklySummary')}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Overdue tasks"
                          checked={notifications.overdueTasks}
                          onChange={() => handleNotificationChange('overdueTasks')}
                          className="mb-2"
                        />
                      </div>
                      
                      <div className="mb-4">
                        <h5>Browser Notifications</h5>
                        <Form.Check
                          type="checkbox"
                          label="Desktop notifications"
                          checked={notifications.desktopNotifications}
                          onChange={() => handleNotificationChange('desktopNotifications')}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Task completion alerts"
                          checked={notifications.taskCompletionAlerts}
                          onChange={() => handleNotificationChange('taskCompletionAlerts')}
                          className="mb-2"
                        />
                      </div>

                      <Button variant="primary" onClick={handleSaveNotifications} disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Save Notification Settings'}
                      </Button>
                    </Form>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h4 className="mb-4">Privacy & Account</h4>
                    
                    <Form>
                      <div className="mb-4">
                        <h5>Data Privacy</h5>
                        <Form.Check
                          type="checkbox"
                          label="Make my tasks private"
                          checked={privacy.privateMode}
                          onChange={() => handlePrivacyChange('privateMode')}
                          className="mb-2"
                        />
                        <Form.Check
                          type="checkbox"
                          label="Allow data analytics"
                          checked={privacy.allowAnalytics}
                          onChange={() => handlePrivacyChange('allowAnalytics')}
                          className="mb-2"
                        />
                      </div>

                      <Button variant="primary" onClick={handleSavePrivacy} disabled={saving}>
                        {saving ? <Spinner animation="border" size="sm" /> : 'Save Privacy Settings'}
                      </Button>
                    </Form>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Settings;