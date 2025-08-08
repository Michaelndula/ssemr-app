import React from 'react';
import Header from './header/header.component';
import PatientSearch from './search/patient-search.component';

const Home: React.FC = () => {
  return (
    <>
     <Header />
     <PatientSearch />
    </>
    
  );
};

export default Home;