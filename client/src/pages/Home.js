// src/pages/Home.js
import React from 'react';
import Header from '../components/Header';
import TherapyOption from '../components/TherapyOption';
import FeatureItem from '../components/FeatureItem';
import MainContent from '../components/MainContent';

const Home = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <TherapyOption />
      <FeatureItem />
    </div>
  );
};

export default Home;
