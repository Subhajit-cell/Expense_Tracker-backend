#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { ExpenseTrackerServicesDeployStack } from '../lib/expense_tracker_services_deploy-stack';
import { ExpenseTrackerServices } from '../lib/expense_services-stack';
import { ExpenseBackendServices } from '../lib/expense_backend_services-stack';

const app = new cdk.App();

// ✅ HARDCODE (best for now to avoid env issues)
const env = {
  account: "571600860627",   // your AWS account ID
  region: "ap-south-1",      // your region
};

// ✅ Infra (VPC)
const vpcStack = new ExpenseTrackerServicesDeployStack(
  app,
  'ExpenseTrackerServicesDeployStack',
  { env }
);

// ✅ MySQL + Kafka
const mysqlAndKafkaStack = new ExpenseTrackerServices(
  app,
  'ExpenseTrackerServicesStack',
  { env }
);

// ✅ Backend Services (ECS)
const backendServices = new ExpenseBackendServices(
  app,
  'ExpenseBackendServices',
  { env }
);

// (optional but clean)
backendServices.addDependency(mysqlAndKafkaStack);
mysqlAndKafkaStack.addDependency(vpcStack);