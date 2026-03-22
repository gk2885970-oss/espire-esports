import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trainingModuleRegistry } from '../../registry/trainingModules';
import NotFound from '../NotFound';

const TrainingModuleContainer = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  if (!moduleId || !trainingModuleRegistry[moduleId]) {
    return <NotFound />;
  }

  const { component: Component } = trainingModuleRegistry[moduleId];

  return <Component />;
};

export default TrainingModuleContainer;
