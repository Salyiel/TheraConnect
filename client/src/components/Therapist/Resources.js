

import '../../styles/Therapist/Resources.css'; // Ensure this matches your CSS file
import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Resources = () => {
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [resources, setResources] = useState([
    // Sample data
    { title: 'Depression Basics', topic: 'Depression', url: '#' },
    { title: 'Dealing with Trauma', topic: 'Trauma', url: '#' },
    // Add more resources here
  ]);
  const [newResource, setNewResource] = useState({ title: '', topic: '', url: '' });

  const handleTopicChange = (e) => setSelectedTopic(e.target.value);

  const filteredResources = selectedTopic === 'All'
    ? resources
    : resources.filter((resource) => resource.topic.toLowerCase() === selectedTopic.toLowerCase());

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource((prevResource) => ({ ...prevResource, [name]: value }));
  };

  const handleAddResource = () => {
    if (newResource.title && newResource.topic && newResource.url) {
      setResources((prevResources) => [...prevResources, newResource]);
      setNewResource({ title: '', topic: '', url: '' }); // Clear the form after adding
    }
  };

  return (
    <div className="resources-container">
      <h1>Resources</h1>

      <div className="filter-section">
        <label htmlFor="topic-filter">Filter by Topic:</label>
        <input
          id="topic-filter"
          type="text"
          placeholder="Enter topic to filter"
          value={selectedTopic}
          onChange={handleTopicChange}
          className="filter-select"
        />
      </div>

      <div className="resource-list">
        {filteredResources.map((resource, index) => (
          <div key={index} className="resource-item">
            <h2>{resource.title}</h2>
            <p>Topic: {resource.topic}</p>
            <a href={resource.url} target="_blank" rel="noopener noreferrer">View Document</a>
          </div>
        ))}
      </div>

      <div className="upload-form">
        <h2>Add New Resource</h2>
        <input
          type="text"
          name="title"
          value={newResource.title}
          placeholder="Resource Title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="topic"
          value={newResource.topic}
          placeholder="Resource Topic (e.g. Depression)"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="url"
          value={newResource.url}
          placeholder="Document URL"
          onChange={handleInputChange}
        />
        <button onClick={handleAddResource} className="add-resource-btn">Add Resource</button>
      </div>
    </div>
  );
};

export default Resources;


