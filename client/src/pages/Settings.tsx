import { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Nav, Alert } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Settings = () => {
  const { backgroundColor, setBackgroundColor } = useTheme();
  const { currentUser } = useAuth();
  const [selectedColor, setSelectedColor] = useState(backgroundColor);
  const [activeTab, setActiveTab] = useState('appearance');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User profile states
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  // NOTIFICATION STATES 
  const [notifications, setNotifications] = useState({
    taskReminders: false,
    weeklySummary: false,
    overdueTasks: false,
    desktopNotifications: false,
    taskCompletionAlerts: false,
  });

  const [privacy, setPrivacy] = useState({
    privateMode: false,
    allowAnalytics: true,
  });

  // Color options - Light colors
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
    { name: 'Pale Rose', value: '#ffb6c1' },
    { name: 'Light Lavender', value: '#e6e6fa' },
    { name: 'Soft Mint', value: '#f0fff0' },
    { name: 'Light Peach', value: '#ffefd5' },
    { name: 'Powder Blue', value: '#b0e0e6' },
  ];

  // Load saved settings on component mount
  useEffect(() => {
    // Load profile image
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Load saved notifications
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    // Load saved privacy settings
    const savedPrivacy = localStorage.getItem('privacySettings');
    if (savedPrivacy) {
      setPrivacy(JSON.parse(savedPrivacy));
    }
  }, []);
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      setUploadSuccess('');
      return;
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      setUploadSuccess('');
      return;
    }
    // Create FileReader to convert image to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setProfileImage(base64String);
      localStorage.setItem('profileImage', base64String);
      setUploadError('');
      setUploadSuccess('Profile picture updated successfully!');
    
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(''), 3000);
    };

    reader.onerror = () => {
      setUploadError('Error reading the image file');
      setUploadSuccess('');
    };

    reader.readAsDataURL(file);
  };

  // Trigger file input when button is clicked
  const handleChangeProfilePicture = () => {
    fileInputRef.current?.click();
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
    setUploadSuccess('Profile picture removed successfully!');
    setUploadError('');
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(''), 3000);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // NOTIFICATION HANDLERS
  const handleNotificationChange = (key: keyof typeof notifications) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(newNotifications);
    console.log(`${key} changed to:`, !notifications[key]);
  };
  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
    setUploadSuccess('Notification settings saved successfully!');
    setUploadError('');
    console.log('Notifications saved:', notifications);
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(''), 3000);
  };

  // PRIVACY HANDLERS 
  const handlePrivacyChange = (key: keyof typeof privacy) => {
    const newPrivacy = {
      ...privacy,
      [key]: !privacy[key]
    };
    setPrivacy(newPrivacy);
    console.log(`${key} changed to:`, !privacy[key]);
  };

  const handleSavePrivacy = () => {
    localStorage.setItem('privacySettings', JSON.stringify(privacy));
    setUploadSuccess('Privacy settings saved successfully!');
    setUploadError('');
    console.log('Privacy settings saved:', privacy);
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(''), 3000);
  };

  // THEME HANDLERS
  const handleSave = () => {
    console.log('Save clicked! Selected color:', selectedColor);
    console.log('Current background color:', backgroundColor);
    setBackgroundColor(selectedColor);
    console.log('Background color updated');
    setUploadSuccess('Theme saved successfully!');
    setTimeout(() => setUploadSuccess(''), 3000);
    navigate(-1);
  };

  const handleCancel = () => {
    setSelectedColor(backgroundColor);
    navigate(-1);
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', { displayName, bio, profileImage: profileImage ? 'Image saved' : 'No image' });
    setUploadSuccess('Profile saved successfully!');
    setUploadError('');
    
    // Clear success message after 3 seconds
    setTimeout(() => setUploadSuccess(''), 3000);
  };

  // Export data handler
  const handleExportData = () => {
    const data = {
      profile: { displayName, bio, email: currentUser?.email },
      notifications,
      privacy,
      theme: backgroundColor
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-planner-data.json';
    a.click();
    
    setUploadSuccess('Data exported successfully!');
    setTimeout(() => setUploadSuccess(''), 3000);
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      alert('Account deletion feature not implemented yet. Contact support.');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
      <Container className="pt-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            {/* Back Button */}
            <div className="d-flex align-items-center mb-4">
              <Button variant="outline-secondary" onClick={() => navigate(-1)} className="me-3">
                ← Back
              </Button>
              <h2 className="mb-0">Settings</h2>
            </div>

            {/* Alert Messages */}
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
                        <Form.Label>
                          <strong>Background Color</strong>
                        </Form.Label>
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
                        <Form.Text className="text-muted">
                          Choose a background color for your planner
                        </Form.Text>
                      </Form.Group>

                      {/* Color Preview */}
                      <Form.Group className="mb-4">
                        <Form.Label>
                          <strong>Preview</strong>
                        </Form.Label>
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
                        <Button variant="secondary" onClick={handleCancel}>
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                          Save & Close
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h4 className="mb-4">Profile Information</h4>
                    
                    {/* Profile Picture Section */}
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
                        {!profileImage && (currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U')}
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />
                      
                      <div className="mt-3">
                        <Button 
                          variant="outline-primary" 
                          onClick={handleChangeProfilePicture}
                          className="me-2"
                          size="sm"
                        >
                          Change Picture
                        </Button>
                        {profileImage && (
                          <Button 
                            variant="outline-danger" 
                            onClick={handleRemoveProfilePicture}
                            size="sm"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Form.Text className="text-muted d-block mt-2">
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </Form.Text>
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
                            <Form.Text className="text-muted">
                              Email cannot be changed
                            </Form.Text>
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

                      <Button variant="primary" onClick={handleSaveProfile}>
                        Save Profile
                      </Button>
                    </Form>
                  </div>
                )}

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

                      <Button variant="primary" onClick={handleSaveNotifications}>
                        Save Notification Settings
                      </Button>
                    </Form>
                  </div>
                )}

              
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

                      <div className="mb-4">
                        <h5>Account Management</h5>
                        <Button 
                          variant="outline-warning" 
                          className="me-2 mb-2"
                          onClick={handleExportData}
                        >
                          Export My Data
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          className="mb-2"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      </div>
                      <Button variant="primary" onClick={handleSavePrivacy}>
                        Save Privacy Settings
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