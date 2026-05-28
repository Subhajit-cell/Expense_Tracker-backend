import * as cdk from 'aws-cdk-lib';
import { SecurityGroup, Subnet, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import * as path from "path";
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class ExpenseBackendServices extends cdk.Stack {
   
    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props);
        
        // 1. IMPORT NETWORKING INFRASTRUCTURE
        const vpc = Vpc.fromLookup(this, 'VpcImported', {
            vpcId: cdk.aws_ssm.StringParameter.valueFromLookup(this, 'VpcId')
        });

        const privateSubnet1 = Subnet.fromSubnetId(this, 'PrivateSubnet1', cdk.aws_ssm.StringParameter.valueFromLookup(this, 'PrivateSubnet-0'));
        const privateSubnet2 = Subnet.fromSubnetId(this, 'PrivateSubnet2', cdk.aws_ssm.StringParameter.valueFromLookup(this, 'PrivateSubnet-1'));

        // Shared Security Group for Application Compute
        const servicesSecurityGroup = new SecurityGroup(this, 'BackendServicesSecurityGroup', {
            vpc,
            allowAllOutbound: true
        });

        // Create the ECS Fargate Application Cluster
        const cluster = new ecs.Cluster(this, 'ExpenseBackendCluster', { vpc: vpc });

        // Global Environment Variables pointing to your Cloud Map Database Layer
        const sharedDbEnvironment = {
            MYSQL_HOST: 'mysql-service.local',
            MYSQL_PORT: '3306',
            MYSQL_USER: 'user',
            MYSQL_PASSWORD: 'password',
            KAFKA_HOST: 'kafka-service.local',
            KAFKA_PORT: '9092'
        };


        // =========================================================================
        // SERVICE 1: AUTH SERVICE (Port 9898)
        // =========================================================================
        const authServiceImage = new assets.DockerImageAsset(this, 'AuthServiceImage', {
            directory: path.join(__dirname, '..', '..', 'authservice'),
        });

        const authServiceTaskDef = new ecs.FargateTaskDefinition(this, 'AuthServiceTaskDef', {
            memoryLimitMiB: 1024,
            cpu: 512,
        });

        authServiceTaskDef.addContainer('AuthServiceContainer', {
            image: ecs.ContainerImage.fromDockerImageAsset(authServiceImage),
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: "AuthService",
                logRetention: RetentionDays.ONE_WEEK 
            }),
            portMappings: [{ containerPort: 9898 }],
            environment: {
                ...sharedDbEnvironment,
                MYSQL_DB: 'authservice',
            }
        });

        const authFargateService = new ecs.FargateService(this, 'AuthService', {
            cluster,
            taskDefinition: authServiceTaskDef,
            desiredCount: 1,
            securityGroups: [servicesSecurityGroup],
            vpcSubnets: { subnets: [privateSubnet1, privateSubnet2] },
            assignPublicIp: false
        });


        // =========================================================================
        // SERVICE 2: DS SERVICE (Port 8000)
        // =========================================================================
        const dsServiceImage = new assets.DockerImageAsset(this, 'DsServiceImage', {
            directory: path.join(__dirname, '..', '..', 'dsservice'),
        });

        const dsServiceTaskDef = new ecs.FargateTaskDefinition(this, 'DsServiceTaskDef', {
            memoryLimitMiB: 1024, // Can scale up to 2048 if running heavy Python models
            cpu: 512,
        });

        dsServiceTaskDef.addContainer('DsServiceContainer', {
            image: ecs.ContainerImage.fromDockerImageAsset(dsServiceImage),
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: "DsService",
                logRetention: RetentionDays.ONE_WEEK 
            }),
            portMappings: [{ containerPort: 8000 }], // Standard default for Flask/FastAPI
            environment: {
                ...sharedDbEnvironment,
                MYSQL_DB: 'dsservice',
            }
        });

        const dsFargateService = new ecs.FargateService(this, 'DsService', {
            cluster,
            taskDefinition: dsServiceTaskDef,
            desiredCount: 1,
            securityGroups: [servicesSecurityGroup],
            vpcSubnets: { subnets: [privateSubnet1, privateSubnet2] },
            assignPublicIp: false
        });


        // =========================================================================
        // SERVICE 3: EXPENSE SERVICE (Port 9820)
        // =========================================================================
        const expenseServiceImage = new assets.DockerImageAsset(this, 'ExpenseServiceImage', {
            directory: path.join(__dirname, '..', '..', 'expenseService'),
        });

        const expenseServiceTaskDef = new ecs.FargateTaskDefinition(this, 'ExpenseServiceTaskDef', {
            memoryLimitMiB: 1024,
            cpu: 512,
        });

        expenseServiceTaskDef.addContainer('ExpenseServiceContainer', {
            image: ecs.ContainerImage.fromDockerImageAsset(expenseServiceImage),
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: "ExpenseService",
                logRetention: RetentionDays.ONE_WEEK 
            }),
            portMappings: [{ containerPort: 9820 }], // Adjust if your app uses a different port
            environment: {
                ...sharedDbEnvironment,
                MYSQL_DB: 'expenseservice',
            }
        });

        const expenseFargateService = new ecs.FargateService(this, 'ExpenseService', {
            cluster,
            taskDefinition: expenseServiceTaskDef,
            desiredCount: 1,
            securityGroups: [servicesSecurityGroup],
            vpcSubnets: { subnets: [privateSubnet1, privateSubnet2] },
            assignPublicIp: false
        });


        // =========================================================================
        // SERVICE 4: USER SERVICE (Port 9810)
        // =========================================================================
        const userServiceImage = new assets.DockerImageAsset(this, 'UserServiceImage', {
            directory: path.join(__dirname, '..', '..', 'userservice'),
        });

        const userServiceTaskDef = new ecs.FargateTaskDefinition(this, 'UserServiceTaskDef', {
            memoryLimitMiB: 1024,
            cpu: 512,
        });

        userServiceTaskDef.addContainer('UserServiceContainer', {
            image: ecs.ContainerImage.fromDockerImageAsset(userServiceImage),
            logging: ecs.LogDrivers.awsLogs({
                streamPrefix: "UserService",
                logRetention: RetentionDays.ONE_WEEK 
            }),
            portMappings: [{ containerPort: 9810 }], // Adjust if your app uses a different port
            environment: {
                ...sharedDbEnvironment,
                MYSQL_DB: 'userservice',
            }
        });

        const userFargateService = new ecs.FargateService(this, 'UserService', {
            cluster,
            taskDefinition: userServiceTaskDef,
            desiredCount: 1,
            securityGroups: [servicesSecurityGroup],
            vpcSubnets: { subnets: [privateSubnet1, privateSubnet2] },
            assignPublicIp: false
        });


        // =========================================================================
        // ROUTING LAYER: APPLICATION LOAD BALANCER
        // =========================================================================
        // =========================================================================
        // ROUTING LAYER: APPLICATION LOAD BALANCER
        // =========================================================================
        const sharedALB = new elbv2.ApplicationLoadBalancer(this, 'BackendServicesALB', {
            vpc,
            internetFacing: false, // Internal-only traffic routing inside the VPC
            vpcSubnets: { subnets: [privateSubnet1, privateSubnet2] }
        });

        // ALB Listeners routing to targets based on matching path headers
        const listener = sharedALB.addListener('HttpListener', { port: 80 });

        // Add Target Groups for individual traffic routing with explicit priorities
       // Add Target Groups for individual traffic routing with explicit priorities
        const authTargetGroup = listener.addTargets('AuthGroup', {
            port: 9898,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targets: [authFargateService],
            priority: 10,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/api/auth*'])]
        });

        const dsTargetGroup = listener.addTargets('DsGroup', {
            port: 5000,
            protocol: elbv2.ApplicationProtocol.HTTP,
            targets: [dsFargateService],
            priority: 20,
            conditions: [elbv2.ListenerCondition.pathPatterns(['/api/ds*'])]
        });

        // FIXED: Pass authTargetGroup directly into the forward array
        listener.addAction('DefaultAction', {
            action: elbv2.ListenerAction.forward([authTargetGroup])
        });

        // OUTPUT THE SHARED ENTRY ALB ENDPOINT
        new cdk.CfnOutput(this, 'SharedALBDNS', {
            value: sharedALB.loadBalancerDnsName,
            description: 'Core microservice entry loadbalancer endpoint',
        });
    } 
}