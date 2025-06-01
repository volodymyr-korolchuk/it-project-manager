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
const CHAT_ROOMS_ID = process.env.NEXT_PUBLIC_APPWRITE_CHAT_ROOMS_ID;
const CHAT_MESSAGES_ID = process.env.NEXT_PUBLIC_APPWRITE_CHAT_MESSAGES_ID;
const DOCUMENTS_ID = process.env.NEXT_PUBLIC_APPWRITE_DOCUMENTS_ID;

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
  // Frontend Development 🎨
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
    description: 'Build a mobile-friendly navigation menu with dropdown functionality'
  },
  {
    name: 'Build product catalog page',
    status: TaskStatus.IN_PROGRESS,
    description: 'Create paginated product listing with advanced filters and sorting options'
  },
  {
    name: 'Implement shopping cart functionality',
    status: TaskStatus.TODO,
    description: 'Add items to cart, update quantities, and persist across user sessions'
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
    description: 'Create reusable image gallery with zoom and navigation features'
  },

  // Backend Development ⚙️
  {
    name: 'Set up database schema',
    status: TaskStatus.DONE,
    description: 'Design and implement the core database structure for the application'
  },
  {
    name: 'Write unit tests',
    status: TaskStatus.TODO,
    description: 'Create comprehensive unit tests for critical business logic'
  },
  {
    name: 'Implement caching layer',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add Redis caching for frequently accessed data and API responses'
  },
  {
    name: 'Set up email service',
    status: TaskStatus.TODO,
    description: 'Configure transactional emails using SendGrid or similar service'
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
    description: 'Handle file uploads with virus scanning and cloud storage integration'
  },
  {
    name: 'Create data export functionality',
    status: TaskStatus.BACKLOG,
    description: 'Allow users to export their data in various formats (CSV, JSON, PDF)'
  },
  {
    name: 'Implement search functionality',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add global search capability with full-text search and filters'
  },
  {
    name: 'Set up webhook system',
    status: TaskStatus.TODO,
    description: 'Create webhook infrastructure for real-time integrations'
  },

  // DevOps & Infrastructure 🚀
  {
    name: 'Configure CI/CD pipeline',
    status: TaskStatus.IN_REVIEW,
    description: 'Set up automated testing and deployment workflows with GitHub Actions'
  },
  {
    name: 'Optimize page load speed',
    status: TaskStatus.BACKLOG,
    description: 'Improve application performance and reduce loading times'
  },
  {
    name: 'Configure Docker containers',
    status: TaskStatus.DONE,
    description: 'Containerize application for consistent deployment across environments'
  },
  {
    name: 'Set up staging environment',
    status: TaskStatus.IN_PROGRESS,
    description: 'Create production-like staging environment for thorough testing'
  },
  {
    name: 'Implement blue-green deployment',
    status: TaskStatus.TODO,
    description: 'Set up zero-downtime deployment strategy for seamless updates'
  },
  {
    name: 'Add health check endpoints',
    status: TaskStatus.DONE,
    description: 'Create comprehensive endpoints for monitoring service health'
  },
  {
    name: 'Configure SSL certificates',
    status: TaskStatus.IN_REVIEW,
    description: 'Set up automatic SSL certificate renewal with Let\'s Encrypt'
  },
  {
    name: 'Implement secret management',
    status: TaskStatus.TODO,
    description: 'Secure storage and rotation of application secrets and API keys'
  },
  {
    name: 'Set up load balancing',
    status: TaskStatus.BACKLOG,
    description: 'Configure load balancer for high availability and traffic distribution'
  },
  {
    name: 'Set up monitoring',
    status: TaskStatus.DONE,
    description: 'Configure comprehensive application performance and error monitoring'
  },

  // UI/UX & Design 🎨
  {
    name: 'Create user dashboard',
    status: TaskStatus.TODO,
    description: 'Build personalized dashboard with key metrics and quick actions'
  },
  {
    name: 'Design mobile app interface',
    status: TaskStatus.IN_PROGRESS,
    description: 'Create intuitive mobile UI/UX for iOS and Android platforms'
  },
  {
    name: 'Add accessibility features',
    status: TaskStatus.IN_REVIEW,
    description: 'Ensure WCAG compliance with screen reader support and keyboard navigation'
  },
  {
    name: 'Create design system',
    status: TaskStatus.TODO,
    description: 'Build comprehensive design system with reusable components'
  },
  {
    name: 'Implement micro-interactions',
    status: TaskStatus.BACKLOG,
    description: 'Add subtle animations and feedback for better user engagement'
  },
  {
    name: 'Design onboarding flow',
    status: TaskStatus.IN_PROGRESS,
    description: 'Create guided tour for new users to discover key features'
  },
  {
    name: 'Add tooltips and help system',
    status: TaskStatus.TODO,
    description: 'Implement contextual help and tooltips throughout the application'
  },

  // Security & Compliance 🔒
  {
    name: 'Implement user roles',
    status: TaskStatus.IN_REVIEW,
    description: 'Create role-based access control system with granular permissions'
  },
  {
    name: 'Add two-factor authentication',
    status: TaskStatus.TODO,
    description: 'Implement 2FA using TOTP or SMS verification for enhanced security'
  },
  {
    name: 'Perform security audit',
    status: TaskStatus.BACKLOG,
    description: 'Comprehensive security assessment and penetration testing'
  },
  {
    name: 'Implement content security policy',
    status: TaskStatus.IN_PROGRESS,
    description: 'Add CSP headers to prevent XSS attacks and improve security'
  },
  {
    name: 'Add GDPR compliance features',
    status: TaskStatus.TODO,
    description: 'Implement data privacy controls and consent management'
  },
  {
    name: 'Set up audit logging',
    status: TaskStatus.BACKLOG,
    description: 'Log all critical user actions for compliance and debugging'
  },

  // Features & Functionality ✨
  {
    name: 'Add notification system',
    status: TaskStatus.BACKLOG,
    description: 'Implement real-time notifications for important events and updates'
  },
  {
    name: 'Integrate third-party APIs',
    status: TaskStatus.IN_REVIEW,
    description: 'Connect with external services for enhanced functionality'
  },
  {
    name: 'Implement data backup',
    status: TaskStatus.TODO,
    description: 'Set up automated backup and recovery procedures for user data'
  },
  {
    name: 'Create admin panel',
    status: TaskStatus.BACKLOG,
    description: 'Build comprehensive admin interface for system management'
  },
  {
    name: 'Add multi-language support',
    status: TaskStatus.BACKLOG,
    description: 'Implement internationalization for global user base'
  },
  {
    name: 'Add file upload feature',
    status: TaskStatus.IN_PROGRESS,
    description: 'Enable users to upload and manage various file types securely'
  },
  {
    name: 'Create API documentation',
    status: TaskStatus.TODO,
    description: 'Document all API endpoints with examples and usage guidelines'
  },
  {
    name: 'Implement caching strategy',
    status: TaskStatus.BACKLOG,
    description: 'Add intelligent caching to improve response times and user experience'
  },
  {
    name: 'Add real-time collaboration',
    status: TaskStatus.TODO,
    description: 'Enable multiple users to work on documents simultaneously'
  },
  {
    name: 'Create reporting dashboard',
    status: TaskStatus.IN_PROGRESS,
    description: 'Build analytics dashboard with charts and key performance indicators'
  },

  // Testing & Quality Assurance 🧪
  {
    name: 'Write integration tests',
    status: TaskStatus.TODO,
    description: 'Test end-to-end user workflows and API integrations'
  },
  {
    name: 'Add performance tests',
    status: TaskStatus.BACKLOG,
    description: 'Load test critical user paths and identify bottlenecks'
  },
  {
    name: 'Implement visual regression tests',
    status: TaskStatus.IN_REVIEW,
    description: 'Catch UI changes with automated screenshot comparison'
  },
  {
    name: 'Set up automated security scanning',
    status: TaskStatus.TODO,
    description: 'Scan for vulnerabilities in dependencies and source code'
  },
  {
    name: 'Create test data generators',
    status: TaskStatus.BACKLOG,
    description: 'Build tools for generating realistic test data for different scenarios'
  },
  {
    name: 'Add accessibility testing',
    status: TaskStatus.TODO,
    description: 'Automated testing for accessibility compliance and usability'
  },

  // Mobile Development 📱
  {
    name: 'Create React Native app',
    status: TaskStatus.BACKLOG,
    description: 'Build mobile app with core functionality for iOS and Android'
  },
  {
    name: 'Implement push notifications',
    status: TaskStatus.TODO,
    description: 'Add Firebase push notifications for mobile app engagement'
  },
  {
    name: 'Add offline sync capability',
    status: TaskStatus.BACKLOG,
    description: 'Allow app to work offline and sync data when connection is restored'
  },
  {
    name: 'Optimize mobile performance',
    status: TaskStatus.IN_PROGRESS,
    description: 'Reduce app bundle size and improve load times on mobile devices'
  },
  {
    name: 'Add biometric authentication',
    status: TaskStatus.TODO,
    description: 'Implement fingerprint and face recognition for mobile security'
  },

  // Analytics & Business Intelligence 📊
  {
    name: 'Implement user analytics',
    status: TaskStatus.DONE,
    description: 'Track user behavior and conversion funnels with detailed metrics'
  },
  {
    name: 'Set up error tracking',
    status: TaskStatus.IN_PROGRESS,
    description: 'Monitor and alert on application errors with detailed stack traces'
  },
  {
    name: 'Create business intelligence dashboard',
    status: TaskStatus.TODO,
    description: 'Build executive dashboard with key business metrics and KPIs'
  },
  {
    name: 'Add A/B testing framework',
    status: TaskStatus.BACKLOG,
    description: 'Enable feature flag-based experimentation and user testing'
  },
  {
    name: 'Implement conversion tracking',
    status: TaskStatus.TODO,
    description: 'Track and analyze user conversion paths through the application'
  },
  {
    name: 'Add heatmap analytics',
    status: TaskStatus.BACKLOG,
    description: 'Visualize user interactions and identify UI optimization opportunities'
  }
];

const sampleChatMessages = [
  "Hey team! How's everyone doing today?",
  "Just finished the latest feature implementation. Ready for review!",
  "Great work on the UI improvements! The design looks fantastic.",
  "Anyone available for a quick standup in 10 minutes?",
  "I've updated the documentation with the new API changes.",
  "The client feedback is really positive so far!",
  "Can someone help me with the deployment process?",
  "Successfully fixed the bug we discussed yesterday.",
  "The performance optimizations are showing great results!",
  "Let's schedule a retrospective for this sprint.",
  "The new testing framework is working beautifully.",
  "I'll be working on the database migration today.",
  "Don't forget about the team meeting at 3 PM!",
  "The security audit went well - no major issues found.",
  "Could use some input on the user experience flow.",
  "The CI/CD pipeline is now fully automated!",
  "Thanks for the help with debugging earlier.",
  "The client demo went perfectly! 🎉",
  "Working on integrating the payment gateway.",
  "The mobile app beta testing starts next week.",
  "Code review is complete - looks good to merge!",
  "The infrastructure scaling worked flawlessly.",
  "Just pushed the hotfix for the login issue.",
  "The analytics dashboard is providing great insights.",
  "Team lunch tomorrow at 12:30 - who's in?",
  "The API response times have improved by 40%!",
  "Need to discuss the upcoming feature roadmap.",
  "The automated tests are all passing now.",
  "Great job on meeting this week's milestones!",
  "The user feedback survey results are in.",
  "Successfully migrated to the new hosting provider.",
  "The accessibility improvements are looking good.",
  "Let's do a quick knowledge sharing session.",
  "The backup and recovery system is now active.",
  "Anyone up for a coffee break? ☕",
  "The internationalization features are working well.",
  "Just completed the security vulnerability assessment.",
  "The load testing results exceeded expectations!",
  "Thanks for staying late to help with the release.",
  "The monitoring alerts are functioning properly now."
];

const sampleDocuments = [
  {
    title: '📊 Performance Optimization Guide',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🚀 Performance Optimization Strategy",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "This document outlines our comprehensive approach to optimizing application performance and ensuring exceptional user experience.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
          },
          "content": [
            {
              "type": "text",
              "text": "⚡ Core Performance Metrics",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-4",
          "type": "bulletListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "First Contentful Paint (FCP) < 1.5s",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-5",
          "type": "bulletListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Largest Contentful Paint (LCP) < 2.5s",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-6",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "💡 Frontend Optimizations: Image lazy loading, code splitting, bundle optimization, CDN integration, and progressive web app features.",
              "styles": {"bold": true}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['performance', 'optimization', 'guide']
  },
  {
    title: '📈 Marketing Strategy & Campaign Plan',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🎯 Marketing Strategy Overview",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Our comprehensive marketing approach focuses on digital-first strategies to maximize reach and engagement while optimizing for ROI.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 2
          },
          "content": [
            {
              "type": "text",
              "text": "📱 Digital Marketing Channels",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-4",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "🔍 SEO & Content Marketing - Drive organic traffic",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-5",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "📧 Email Marketing - Nurture leads and retain customers",
              "styles": {}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['marketing', 'strategy', 'campaigns', 'digital']
  },
  {
    title: '🔒 Security & Compliance Documentation',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🛡️ Security Framework & Compliance",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "This document outlines our security protocols, compliance requirements, and best practices to protect user data and maintain system integrity.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "🔒 Encryption: All data encrypted at rest using AES-256 and in transit using TLS 1.3. Database encryption keys rotated quarterly.",
              "styles": {"bold": true}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['security', 'compliance', 'privacy', 'documentation']
  },
  {
    title: '🎨 UI/UX Design Guidelines',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🎨 Design System & UI Guidelines",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Our design system ensures consistency, accessibility, and delightful user experiences across all touchpoints.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "🎯 Primary Colors: Blue (#3B82F6) for actions, Green (#10B981) for success states, Red (#EF4444) for errors.",
              "styles": {"bold": true}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['design', 'ui', 'ux', 'guidelines', 'components']
  },
  {
    title: '⚙️ Technical Architecture Overview',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🏗️ System Architecture & Technical Stack",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "This document provides a comprehensive overview of our technical architecture, technology choices, and infrastructure setup.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "🏛️ Microservices Architecture: Modular services with clear boundaries, independent deployment, and fault isolation.",
              "styles": {"bold": true}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['architecture', 'technical', 'infrastructure', 'documentation']
  },
  {
    title: '📚 API Documentation & Integration Guide',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🔌 API Documentation & Developer Guide",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Complete guide for developers to integrate with our API, including authentication, endpoints, and best practices.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "bulletListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "👥 GET /api/v1/users - List all users",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-4",
          "type": "bulletListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "➕ POST /api/v1/users - Create new user",
              "styles": {}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['api', 'documentation', 'integration', 'developer']
  },
  {
    title: '🚀 Deployment & DevOps Procedures',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "🔄 Deployment Pipeline & DevOps Guide",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Comprehensive guide covering our CI/CD pipeline, deployment procedures, and operational best practices.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "🚨 Critical alerts for system health, performance degradation, and error rates. Slack notifications for immediate response.",
              "styles": {"bold": true}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['deployment', 'devops', 'ci-cd', 'monitoring']
  },
  {
    title: '📊 Project Analytics & KPI Dashboard',
    content: JSON.stringify({
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left",
            "level": 1
          },
          "content": [
            {
              "type": "text",
              "text": "📈 Analytics Dashboard & Key Metrics",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-2",
          "type": "paragraph",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Track project progress, team performance, and business metrics with our comprehensive analytics dashboard.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-3",
          "type": "bulletListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Sprint velocity: 45 story points (target: 40)",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "block-4",
          "type": "bulletListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Bug fix rate: 92% within 24h",
              "styles": {}
            }
          ],
          "children": []
        }
      ]
    }),
    tags: ['analytics', 'kpi', 'metrics', 'dashboard', 'performance']
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
    // Clear chat messages first (due to dependencies)
    const chatMessages = await databases.listDocuments(DATABASE_ID, CHAT_MESSAGES_ID);
    for (const message of chatMessages.documents) {
      await databases.deleteDocument(DATABASE_ID, CHAT_MESSAGES_ID, message.$id);
    }
    console.log(`✅ Cleared ${chatMessages.documents.length} chat messages`);

    // Clear chat rooms
    const chatRooms = await databases.listDocuments(DATABASE_ID, CHAT_ROOMS_ID);
    for (const room of chatRooms.documents) {
      await databases.deleteDocument(DATABASE_ID, CHAT_ROOMS_ID, room.$id);
    }
    console.log(`✅ Cleared ${chatRooms.documents.length} chat rooms`);

    // Clear documents (depend on projects)
    const documents = await databases.listDocuments(DATABASE_ID, DOCUMENTS_ID);
    for (const document of documents.documents) {
      await databases.deleteDocument(DATABASE_ID, DOCUMENTS_ID, document.$id);
    }
    console.log(`✅ Cleared ${documents.documents.length} documents`);

    // Clear tasks (due to dependencies)
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
            name: `${project.name}`,
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

async function seedChatRooms(projects) {
  console.log('💬 Seeding chat rooms...');
  const createdChatRooms = [];

  for (const project of projects) {
    try {
      const chatRoom = await databases.createDocument(
        DATABASE_ID,
        CHAT_ROOMS_ID,
        ID.unique(),
        {
          projectId: project.$id,
          workspaceId: project.workspaceId,
          name: `${project.name} Chat`,
          description: `Discussion room for ${project.name} project`,
          createdAt: new Date().toISOString()
        }
      );
      createdChatRooms.push(chatRoom);
      console.log(`✅ Created chat room: ${chatRoom.name}`);
    } catch (error) {
      console.error(`❌ Failed to create chat room for ${project.name}:`, error.message);
    }
  }

  return createdChatRooms;
}

async function seedChatMessages(chatRooms, members, realUsers) {
  console.log('💬 Seeding chat messages...');
  const createdChatMessages = [];

  for (const chatRoom of chatRooms) {
    // Get members from the same workspace
    const roomMembers = members.filter(member => member.workspaceId === chatRoom.workspaceId);
    
    if (roomMembers.length === 0) continue;

    // Create 8-15 messages per chat room
    const messageCount = Math.floor(Math.random() * 8) + 8;
    const roomMessages = sampleChatMessages
      .sort(() => 0.5 - Math.random())
      .slice(0, messageCount);

    for (let i = 0; i < roomMessages.length; i++) {
      const message = roomMessages[i];
      const author = getRandomElement(roomMembers);
      
      // Find the user corresponding to this member
      const user = realUsers.find(u => u.$id === author.userId);
      if (!user) continue;

      // Generate message date (between 7 days ago and now)
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7);
      const messageDate = getRandomDate(pastDate, now);

      try {
        const chatMessage = await databases.createDocument(
          DATABASE_ID,
          CHAT_MESSAGES_ID,
          ID.unique(),
          {
            content: message,
            projectId: chatRoom.projectId,
            workspaceId: chatRoom.workspaceId,
            authorId: author.userId,
            authorName: user.name,
            createdAt: messageDate.toISOString()
          }
        );
        createdChatMessages.push(chatMessage);
        console.log(`✅ Created message in ${chatRoom.name}: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
      } catch (error) {
        console.error(`❌ Failed to create chat message:`, error.message);
      }
    }
  }

  return createdChatMessages;
}

async function seedDocuments(projects, members, realUsers) {
  console.log('📄 Seeding project documents...');
  const createdDocuments = [];

  for (const project of projects) {
    // Get members from the same workspace
    const projectMembers = members.filter(member => member.workspaceId === project.workspaceId);
    
    if (projectMembers.length === 0) continue;

    // Create 3-5 documents per project
    const documentCount = Math.floor(Math.random() * 3) + 3;
    const projectDocuments = sampleDocuments
      .sort(() => 0.5 - Math.random())
      .slice(0, documentCount);

    for (const docTemplate of projectDocuments) {
      const author = getRandomElement(projectMembers);
      
      // Find the user corresponding to this member
      const user = realUsers.find(u => u.$id === author.userId);
      if (!user) continue;

      try {
        const document = await databases.createDocument(
          DATABASE_ID,
          DOCUMENTS_ID,
          ID.unique(),
          {
            title: docTemplate.title,
            content: docTemplate.content,
            projectId: project.$id,
            workspaceId: project.workspaceId,
            authorId: author.userId,
            lastEditedBy: user.name || user.email,
            version: 1,
            tags: docTemplate.tags
          }
        );
        createdDocuments.push(document);
        console.log(`✅ Created document: ${document.title} for ${project.name}`);
      } catch (error) {
        console.error(`❌ Failed to create document ${docTemplate.title}:`, error.message);
      }
    }
  }

  return createdDocuments;
}

async function seedTasks(projects, members) {
  console.log('✅ Seeding tasks...');
  const createdTasks = [];

  for (const project of projects) {
    // Get members from the same workspace
    const projectMembers = members.filter(member => member.workspaceId === project.workspaceId);
    
    if (projectMembers.length === 0) continue;

    // Create 8-12 tasks per project (increased for more variety)
    const taskCount = Math.floor(Math.random() * 5) + 8;
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
    if (!DATABASE_ID || !WORKSPACES_ID || !MEMBERS_ID || !PROJECTS_ID || !TASKS_ID || !CHAT_ROOMS_ID || !CHAT_MESSAGES_ID || !DOCUMENTS_ID) {
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

    const chatRooms = await seedChatRooms(projects);
    console.log('');

    const chatMessages = await seedChatMessages(chatRooms, members, realUsers);
    console.log('');

    const documents = await seedDocuments(projects, members, realUsers);
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
    console.log(`   • ${chatRooms.length} chat rooms created`);
    console.log(`   • ${chatMessages.length} chat messages created`);
    console.log(`   • ${documents.length} documents created`);
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
module.exports = { runSeed }; 