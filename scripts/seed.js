const { Client, Databases, Account, ID, Query, Users } = require('node-appwrite');
const { config } = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.NEXT_APPWRITE_KEY); // Server API key needed for seeding

const databases = new Databases(client);
const account = new Account(client);
const users = new Users(client);

// Database and Collection IDs (adjust these to match your Appwrite setup)
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const WORKSPACES_ID = process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID;
const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID;
const PROJECTS_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID;
const TASKS_ID = process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID;

// Task statuses from your project
const TaskStatus = {
  BACKLOG: 'BACKLOG',
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  DONE: 'DONE'
};

// Sample data
const sampleWorkspaces = [
  {
    name: 'Acme Corporation',
    imageUrl: null,
    inviteCode: 'ACME2024'
  },
  {
    name: 'Tech Innovators Inc',
    imageUrl: null,
    inviteCode: 'TECH2024'
  },
  {
    name: 'Digital Solutions LLC',
    imageUrl: null,
    inviteCode: 'DIGI2024'
  }
];

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@acme.com'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@acme.com'
  },
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@tech.com'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@tech.com'
  },
  {
    name: 'Mike Brown',
    email: 'mike.brown@digital.com'
  },
  {
    name: 'Lisa Davis',
    email: 'lisa.davis@digital.com'
  },
  {
    name: 'Volodymyr',
    email: 'gitpush@gmail.com'
  }
];

const sampleProjects = [
  {
    name: 'Website Redesign',
    imageUrl: null
  },
  {
    name: 'Mobile App Development',
    imageUrl: null
  },
  {
    name: 'API Integration',
    imageUrl: null
  },
  {
    name: 'Database Migration',
    imageUrl: null
  },
  {
    name: 'Security Audit',
    imageUrl: null
  },
  {
    name: 'Performance Optimization',
    imageUrl: null
  },
  {
    name: 'E-commerce Platform',
    imageUrl: null
  },
  {
    name: 'User Analytics Dashboard',
    imageUrl: null
  },
  {
    name: 'Cloud Infrastructure Setup',
    imageUrl: null
  },
  {
    name: 'Customer Support Portal',
    imageUrl: null
  },
  {
    name: 'Inventory Management System',
    imageUrl: null
  },
  {
    name: 'Employee Onboarding Platform',
    imageUrl: null
  },
  {
    name: 'Data Backup & Recovery',
    imageUrl: null
  },
  {
    name: 'Marketing Automation Tool',
    imageUrl: null
  },
  {
    name: 'Video Streaming Service',
    imageUrl: null
  },
  {
    name: 'Document Management System',
    imageUrl: null
  },
  {
    name: 'IoT Device Monitoring',
    imageUrl: null
  },
  {
    name: 'Financial Reporting Tool',
    imageUrl: null
  },
  {
    name: 'Social Media Integration',
    imageUrl: null
  },
  {
    name: 'AI Chatbot Implementation',
    imageUrl: null
  },
  {
    name: 'Multi-tenant SaaS Platform',
    imageUrl: null
  },
  {
    name: 'Real-time Chat Application',
    imageUrl: null
  },
  {
    name: 'Payment Processing System',
    imageUrl: null
  },
  {
    name: 'Content Management System',
    imageUrl: null
  },
  {
    name: 'DevOps Automation Pipeline',
    imageUrl: null
  }
];

const sampleTasks = [
  {
    name: 'Design new homepage layout',
    status: TaskStatus.IN_PROGRESS,
    description: 'Create a modern, responsive homepage design that showcases our key services'
  },
  {
    name: 'Implement user authentication',
    status: TaskStatus.TODO,
    description: 'Set up secure user login and registration system with email verification'
  },
  {
    name: 'Create responsive navigation',
    status: TaskStatus.DONE,
    description: 'Build mobile-friendly navigation menu with smooth animations'
  },
  {
    name: 'Set up payment gateway',
    status: TaskStatus.BACKLOG,
    description: 'Integrate Stripe payment processing for subscription management'
  },
  {
    name: 'Write API documentation',
    status: TaskStatus.IN_REVIEW,
    description: 'Document all API endpoints with examples and response formats'
  },
  {
    name: 'Implement search functionality',
    status: TaskStatus.TODO,
    description: 'Add full-text search with filters and sorting options'
  },
  {
    name: 'Optimize database queries',
    status: TaskStatus.IN_PROGRESS,
    description: 'Improve query performance and add proper indexing'
  },
  {
    name: 'Set up CI/CD pipeline',
    status: TaskStatus.BACKLOG,
    description: 'Configure automated testing and deployment workflow'
  },
  {
    name: 'Implement real-time notifications',
    status: TaskStatus.TODO,
    description: 'Add WebSocket-based notifications for user activities'
  },
  {
    name: 'Create admin dashboard',
    status: TaskStatus.IN_REVIEW,
    description: 'Build comprehensive admin panel with analytics and user management'
  },
  // Frontend Tasks
  {
    name: 'Build product catalog page',
    status: TaskStatus.TODO,
    description: 'Create paginated product listing with filters and sorting'
  },
  {
    name: 'Implement shopping cart functionality',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add items to cart, update quantities, and persist across sessions'
  },
  {
    name: 'Design mobile-first checkout flow',
    status: TaskStatus.BACKLOG,
    description: 'Create streamlined checkout process optimized for mobile devices'
  },
  {
    name: 'Add dark mode toggle',
    status: TaskStatus.DONE,
    description: 'Implement theme switching with user preference persistence'
  },
  {
    name: 'Create loading states and skeletons',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add skeleton screens and loading indicators for better UX'
  },
  {
    name: 'Implement form validation',
    status: TaskStatus.TODO,
    description: 'Add client-side and server-side validation for all forms'
  },
  {
    name: 'Build image gallery component',
    status: TaskStatus.BACKLOG,
    description: 'Create reusable image gallery with zoom and navigation'
  },
  {
    name: 'Add accessibility features',
    status: TaskStatus.IN_REVIEW,
    description: 'Ensure WCAG compliance with screen reader support and keyboard navigation'
  },
  // Backend Tasks
  {
    name: 'Design database schema',
    status: TaskStatus.DONE,
    description: 'Create normalized database structure with proper relationships'
  },
  {
    name: 'Implement caching layer',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add Redis caching for frequently accessed data'
  },
  {
    name: 'Set up email service',
    status: TaskStatus.TODO,
    description: 'Configure transactional emails using SendGrid or similar'
  },
  {
    name: 'Create backup strategy',
    status: TaskStatus.BACKLOG,
    description: 'Implement automated daily backups with retention policy'
  },
  {
    name: 'Add rate limiting',
    status: TaskStatus.TODO,
    description: 'Protect APIs from abuse with intelligent rate limiting'
  },
  {
    name: 'Implement file upload system',
    status: TaskStatus.IN_PROGRESS,
    description: 'Handle file uploads with virus scanning and cloud storage'
  },
  {
    name: 'Set up monitoring and logging',
    status: TaskStatus.IN_REVIEW,
    description: 'Add application monitoring with structured logging'
  },
  {
    name: 'Create data export functionality',
    status: TaskStatus.BACKLOG,
    description: 'Allow users to export their data in various formats'
  },
  // DevOps Tasks
  {
    name: 'Configure Docker containers',
    status: TaskStatus.DONE,
    description: 'Containerize application for consistent deployment'
  },
  {
    name: 'Set up staging environment',
    status: TaskStatus.IN_PROGRESS,
    description: 'Create production-like staging environment for testing'
  },
  {
    name: 'Implement blue-green deployment',
    status: TaskStatus.TODO,
    description: 'Set up zero-downtime deployment strategy'
  },
  {
    name: 'Add health check endpoints',
    status: TaskStatus.DONE,
    description: 'Create endpoints for monitoring service health'
  },
  {
    name: 'Configure SSL certificates',
    status: TaskStatus.IN_REVIEW,
    description: 'Set up automatic SSL certificate renewal'
  },
  {
    name: 'Implement secret management',
    status: TaskStatus.TODO,
    description: 'Secure storage and rotation of application secrets'
  },
  {
    name: 'Set up load balancing',
    status: TaskStatus.BACKLOG,
    description: 'Configure load balancer for high availability'
  },
  // Testing Tasks
  {
    name: 'Write unit tests for API',
    status: TaskStatus.IN_PROGRESS,
    description: 'Achieve 80% code coverage for backend APIs'
  },
  {
    name: 'Create integration tests',
    status: TaskStatus.TODO,
    description: 'Test end-to-end user workflows'
  },
  {
    name: 'Add performance tests',
    status: TaskStatus.BACKLOG,
    description: 'Load test critical user paths'
  },
  {
    name: 'Implement visual regression tests',
    status: TaskStatus.IN_REVIEW,
    description: 'Catch UI changes with automated screenshot comparison'
  },
  {
    name: 'Set up automated security scanning',
    status: TaskStatus.TODO,
    description: 'Scan for vulnerabilities in dependencies and code'
  },
  // Mobile Tasks
  {
    name: 'Create React Native app',
    status: TaskStatus.BACKLOG,
    description: 'Build mobile app with core functionality'
  },
  {
    name: 'Implement push notifications',
    status: TaskStatus.TODO,
    description: 'Add Firebase push notifications for mobile app'
  },
  {
    name: 'Add offline sync capability',
    status: TaskStatus.BACKLOG,
    description: 'Allow app to work offline and sync when online'
  },
  {
    name: 'Optimize app performance',
    status: TaskStatus.IN_PROGRESS,
    description: 'Reduce app bundle size and improve load times'
  },
  // Analytics & Monitoring
  {
    name: 'Implement user analytics',
    status: TaskStatus.DONE,
    description: 'Track user behavior and conversion funnels'
  },
  {
    name: 'Set up error tracking',
    status: TaskStatus.IN_PROGRESS,
    description: 'Monitor and alert on application errors'
  },
  {
    name: 'Create business intelligence dashboard',
    status: TaskStatus.TODO,
    description: 'Build executive dashboard with key metrics'
  },
  {
    name: 'Add A/B testing framework',
    status: TaskStatus.BACKLOG,
    description: 'Enable feature flag-based experimentation'
  },
  // Security Tasks
  {
    name: 'Implement two-factor authentication',
    status: TaskStatus.IN_REVIEW,
    description: 'Add 2FA using TOTP or SMS verification'
  },
  {
    name: 'Add GDPR compliance features',
    status: TaskStatus.TODO,
    description: 'Implement data privacy controls and consent management'
  },
  {
    name: 'Perform security audit',
    status: TaskStatus.BACKLOG,
    description: 'Comprehensive security assessment and penetration testing'
  },
  {
    name: 'Implement content security policy',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add CSP headers to prevent XSS attacks'
  },
  // Documentation & Maintenance
  {
    name: 'Update user documentation',
    status: TaskStatus.TODO,
    description: 'Create comprehensive user guides and tutorials'
  },
  {
    name: 'Write technical documentation',
    status: TaskStatus.IN_REVIEW,
    description: 'Document system architecture and deployment procedures'
  },
  {
    name: 'Create onboarding flow',
    status: TaskStatus.BACKLOG,
    description: 'Guide new users through key features'
  },
  {
    name: 'Refactor legacy code',
    status: TaskStatus.IN_PROGRESS,
    description: 'Modernize older codebase sections for maintainability'
  },
  {
    name: 'Update dependencies',
    status: TaskStatus.TODO,
    description: 'Upgrade to latest versions and remove deprecated packages'
  }
];

// Helper functions
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Seeding functions
async function createUsers() {
  console.log('👤 Creating user accounts...');
  const createdUsers = [];

  for (const user of sampleUsers) {
    try {
      // Create a real user account in Appwrite
      const createdUser = await users.create(
        ID.unique(),
        user.email,
        undefined, // phone (optional)
        'password123', // default password - users should change this
        user.name
      );
      createdUsers.push(createdUser);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    } catch (error) {
      console.error(`❌ Failed to create user ${user.name}:`, error.message);
    }
  }

  return createdUsers;
}

async function clearExistingData() {
  console.log('🧹 Clearing existing data...');
  
  try {
    // Clear tasks first (due to dependencies)
    const tasks = await databases.listDocuments(DATABASE_ID, TASKS_ID);
    for (const task of tasks.documents) {
      await databases.deleteDocument(DATABASE_ID, TASKS_ID, task.$id);
    }
    console.log(`✅ Cleared ${tasks.documents.length} tasks`);

    // Clear projects
    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID);
    for (const project of projects.documents) {
      await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, project.$id);
    }
    console.log(`✅ Cleared ${projects.documents.length} projects`);

    // Clear members
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID);
    for (const member of members.documents) {
      await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, member.$id);
    }
    console.log(`✅ Cleared ${members.documents.length} members`);

    // Clear workspaces
    const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID);
    for (const workspace of workspaces.documents) {
      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspace.$id);
    }
    console.log(`✅ Cleared ${workspaces.documents.length} workspaces`);

    // Clear users (do this last since members reference users)
    const usersList = await users.list();
    for (const user of usersList.users) {
      // Skip deleting the admin user or any user that's not from our sample data
      const isSampleUser = sampleUsers.some(sampleUser => sampleUser.email === user.email);
      if (isSampleUser) {
        try {
          await users.delete(user.$id);
          console.log(`✅ Deleted user: ${user.name || user.email}`);
        } catch (error) {
          console.log(`⚠️ Could not delete user ${user.email}:`, error.message);
        }
      }
    }

  } catch (error) {
    console.log('ℹ️ No existing data to clear or error occurred:', error.message);
  }
}

async function seedWorkspaces() {
  console.log('🏢 Seeding workspaces...');
  const createdWorkspaces = [];

  for (const workspace of sampleWorkspaces) {
    try {
      const created = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name: workspace.name,
          imageUrl: workspace.imageUrl,
          inviteCode: workspace.inviteCode,
          userId: 'admin' // You might need to adjust this based on your auth setup
        }
      );
      createdWorkspaces.push(created);
      console.log(`✅ Created workspace: ${workspace.name}`);
    } catch (error) {
      console.error(`❌ Failed to create workspace ${workspace.name}:`, error.message);
    }
  }

  return createdWorkspaces;
}

async function seedMembers(workspaces, realUsers) {
  console.log('👥 Seeding members...');
  const createdMembers = [];

  for (const user of realUsers) {
    // Assign each user to 1-2 random workspaces
    const userWorkspaces = workspaces
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1);

    for (const workspace of userWorkspaces) {
      try {
        const member = await databases.createDocument(
          DATABASE_ID,
          MEMBERS_ID,
          ID.unique(),
          {
            userId: user.$id, // Use the real user ID from Appwrite Users
            workspaceId: workspace.$id,
            role: Math.random() > 0.7 ? 'ADMIN' : 'MEMBER' // 30% admins, 70% members
          }
        );
        createdMembers.push(member);
        console.log(`✅ Created member: ${user.name} (${user.email}) with role ${member.role} in ${workspace.name}`);
      } catch (error) {
        console.error(`❌ Failed to create member for ${user.name} in ${workspace.name}:`, error.message);
      }
    }
  }

  return createdMembers;
}

async function seedProjects(workspaces, members) {
  console.log('📁 Seeding projects...');
  const createdProjects = [];

  for (const workspace of workspaces) {
    // Create 4-6 projects per workspace (increased from 2-3)
    const projectCount = Math.floor(Math.random() * 3) + 4;
    const workspaceProjects = sampleProjects
      .sort(() => 0.5 - Math.random())
      .slice(0, projectCount);

    for (const project of workspaceProjects) {
      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          PROJECTS_ID,
          ID.unique(),
          {
            name: `${workspace.name} - ${project.name}`,
            imageUrl: project.imageUrl,
            workspaceId: workspace.$id
          }
        );
        createdProjects.push(created);
        console.log(`✅ Created project: ${created.name}`);
      } catch (error) {
        console.error(`❌ Failed to create project ${project.name}:`, error.message);
      }
    }
  }

  return createdProjects;
}

async function seedTasks(projects, members) {
  console.log('✅ Seeding tasks...');
  const createdTasks = [];

  for (const project of projects) {
    // Get members from the same workspace
    const projectMembers = members.filter(member => member.workspaceId === project.workspaceId);
    
    if (projectMembers.length === 0) continue;

    // Create 6-10 tasks per project (increased from 3-5)
    const taskCount = Math.floor(Math.random() * 5) + 6;
    const projectTasks = sampleTasks
      .sort(() => 0.5 - Math.random())
      .slice(0, taskCount);

    for (let i = 0; i < projectTasks.length; i++) {
      const task = projectTasks[i];
      const assignee = getRandomElement(projectMembers);
      
      // Generate due date (between now and 3 months from now)
      const now = new Date();
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3);
      const dueDate = getRandomDate(now, futureDate);

      try {
        const created = await databases.createDocument(
          DATABASE_ID,
          TASKS_ID,
          ID.unique(),
          {
            name: task.name,
            description: task.description,
            status: task.status,
            workspaceId: project.workspaceId,
            projectId: project.$id,
            assigneeId: assignee.$id,
            dueDate: dueDate.toISOString(),
            position: (i + 1) * 1000 // Position for kanban ordering
          }
        );
        createdTasks.push(created);
        console.log(`✅ Created task: ${task.name}`);
      } catch (error) {
        console.error(`❌ Failed to create task ${task.name}:`, error.message);
      }
    }
  }

  return createdTasks;
}

// Main seeding function
async function runSeed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Check environment variables
    if (!DATABASE_ID || !WORKSPACES_ID || !MEMBERS_ID || !PROJECTS_ID || !TASKS_ID) {
      throw new Error('Missing required environment variables. Please check your .env.local file.');
    }

    // Clear existing data
    await clearExistingData();
    console.log('');

    // Seed data in order (respecting dependencies)
    const workspaces = await seedWorkspaces();
    console.log('');

    const realUsers = await createUsers();
    console.log('');

    const members = await seedMembers(workspaces, realUsers);
    console.log('');

    const projects = await seedProjects(workspaces, members);
    console.log('');

    const tasks = await seedTasks(projects, members);
    console.log('');

    // Summary
    console.log('🎉 Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   • ${workspaces.length} workspaces created`);
    console.log(`   • ${realUsers.length} user accounts created`);
    console.log(`   • ${members.length} members created`);
    console.log(`   • ${projects.length} projects created`);
    console.log(`   • ${tasks.length} tasks created`);
    console.log('');
    console.log('🚀 You can now start using your application with sample data!');
    console.log('');
    console.log('📋 Test Users (all with password: password123):');
    realUsers.forEach(user => {
      console.log(`   • ${user.name}: ${user.email}`);
    });
    console.log('');
    console.log('⚠️  Remember to change the default passwords after testing!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed }; 