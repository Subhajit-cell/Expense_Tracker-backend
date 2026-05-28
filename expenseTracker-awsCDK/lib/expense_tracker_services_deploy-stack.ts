import * as cdk from 'aws-cdk-lib';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class ExpenseTrackerServicesDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC - High-level L2 construct handles IGW, 2 NAT Gateways, EIPs, and Routing automatically!
    const vpc = new Vpc(this, "myVPC", {
      vpcName: "expenseTracker",
      ipAddresses: cdk.aws_ec2.IpAddresses.cidr("10.0.0.0/16"),
      maxAzs: 2,
      natGateways: 2, // Spreads 1 NAT Gateway per AZ for high availability
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public-subnet',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'private-subnet',
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        }
      ]
    });

    // 1. Export VPC ID to SSM Parameter Store for downstream stacks to look up
    new cdk.aws_ssm.StringParameter(this, 'VpcIdExport', {
      parameterName: 'VpcId',
      stringValue: vpc.vpcId
    });
    
    // 2. Export Public Subnet IDs to SSM
    vpc.publicSubnets.forEach((subnet, index) => {
      new cdk.aws_ssm.StringParameter(this, `PublicSubnetExport-${index}`, {
        parameterName: `PublicSubnet-${index}`,
        stringValue: subnet.subnetId
      });
    });

    // 3. Export Private Subnet IDs to SSM
    vpc.privateSubnets.forEach((subnet, index) => {
      new cdk.aws_ssm.StringParameter(this, `PrivateSubnetExport-${index}`, {
        parameterName: `PrivateSubnet-${index}`,
        stringValue: subnet.subnetId
      });
    }); 

  }
}