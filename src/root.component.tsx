/**
 * From here, the application is pretty typical React, but with lots of
 * support from `@openmrs/esm-framework`. Check out `Greeter` to see
 * usage of the configuration system, and check out `PatientGetter` to
 * see data fetching using the OpenMRS FHIR API.
 *
 * Check out the Config docs:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 */

import React from 'react';
import Home from './components/home.component';
import { BrowserRouter } from 'react-router-dom';

const RootComponent: React.FC = () => {
  const baseName = window.getOpenmrsSpaBase() + "home/ssemr-home";
  return (
    <main>
        <BrowserRouter basename={baseName}>
            <Home />
        </BrowserRouter>
    </main>
  );
};

export default RootComponent;
