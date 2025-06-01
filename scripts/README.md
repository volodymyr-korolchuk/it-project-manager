# 🌱 Database Seeding Script

This script helps you quickly populate your database with realistic sample data for development and testing purposes.

## 📊 What it creates

- **3 Workspaces** with different names and invite codes
- **7 User accounts** with realistic names and emails
- **Members** assigned to workspaces with realistic role distribution (70% members, 30% admins)
- **16 Projects** (4-6 per workspace) with varied project types
- **16 Chat rooms** (one per project) for team communication  
- **196+ Chat messages** (8-15 per room) with realistic conversation flow
- **61+ Rich documents** (3-5 per project) with professional content and emojis
- **163+ Tasks** (8-12 per project) covering all aspects of development

## ✨ Features

### 💬 Chat System Seeding
- Creates chat rooms automatically for each project
- Generates realistic chat messages with timestamps from the last 7 days
- Messages are authored by random team members
- Natural conversation flow about development topics

### 📄 Document System Seeding 
- **Rich Content Documents** with professional formatting using Editor.js blocks
- **8 Document Types** with comprehensive content:
  - 📊 **Performance Optimization Guide** - Metrics, techniques, best practices
  - 📈 **Marketing Strategy & Campaign Plan** - Digital marketing, KPIs, channels
  - 🔒 **Security & Compliance Documentation** - Authentication, data protection, audits
  - 🎨 **UI/UX Design Guidelines** - Design system, color palette, accessibility
  - ⚙️ **Technical Architecture Overview** - Tech stack, patterns, infrastructure
  - 📚 **API Documentation & Integration Guide** - Endpoints, authentication, rate limiting
  - 🚀 **Deployment & DevOps Procedures** - CI/CD, monitoring, environments
  - 📊 **Project Analytics & KPI Dashboard** - Performance metrics, team analytics

- **Advanced Content Blocks**: Headers, paragraphs, lists, tables, code blocks, checklists, quotes, warnings, and delimiters
- **Emoji Integration** throughout all content for visual appeal
- **Professional Tags** for easy categorization and filtering
- **Realistic authorship** with proper version tracking

### ✅ Enhanced Task System
- **80+ Diverse Task Types** covering all development aspects:
  - 🎨 **Frontend Development** (UI/UX, responsive design, user experience)
  - ⚙️ **Backend Development** (APIs, databases, caching, security)
  - 🚀 **DevOps & Infrastructure** (CI/CD, monitoring, containerization)
  - 🎨 **UI/UX & Design** (design systems, accessibility, user research)
  - 🔒 **Security & Compliance** (authentication, audits, GDPR)
  - ✨ **Features & Functionality** (notifications, integrations, analytics)
  - 🧪 **Testing & Quality Assurance** (unit tests, performance, automation)
  - 📱 **Mobile Development** (React Native, push notifications, offline sync)
  - 📊 **Analytics & Business Intelligence** (tracking, dashboards, A/B testing)

- **Realistic Task Distribution** across different statuses
- **Smart Assignment** to appropriate team members
- **Due Date Generation** spanning 3 months for realistic planning
- **Detailed Descriptions** for each task type

## 🛠️ Prerequisites

1. **Node.js** installed on your system
2. **Appwrite** instance running (local or cloud)
3. **Environment variables** configured in `.env.local`:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_APPWRITE_KEY=your_server_api_key

# Collection IDs
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_workspaces_collection_id
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_members_collection_id
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=your_projects_collection_id
NEXT_PUBLIC_APPWRITE_TASKS_ID=your_tasks_collection_id
NEXT_PUBLIC_APPWRITE_CHAT_ROOMS_ID=your_chat_rooms_collection_id
NEXT_PUBLIC_APPWRITE_CHAT_MESSAGES_ID=your_chat_messages_collection_id
NEXT_PUBLIC_APPWRITE_DOCUMENTS_ID=your_documents_collection_id
```

## 🚀 How to run

1. Navigate to your project directory
2. Run the seeding script:

```bash
node scripts/seed.js
```

The script will:
- 🧹 **Clear existing data** (in dependency order)
- 👤 **Create user accounts** with proper authentication
- 🏢 **Set up workspaces** with invite codes
- 👥 **Assign members** with realistic role distribution
- 📁 **Generate projects** with varied names and types
- 💬 **Create chat rooms** and populate with messages
- 📄 **Generate rich documents** with professional content
- ✅ **Create diverse tasks** across all development areas

## 📋 Test Accounts

All users are created with the password: `password123`

- **John Doe**: john.doe@acme.com
- **Jane Smith**: jane.smith@acme.com  
- **Alex Johnson**: alex.johnson@tech.com
- **Sarah Wilson**: sarah.wilson@tech.com
- **Mike Brown**: mike.brown@digital.com
- **Lisa Davis**: lisa.davis@digital.com
- **Volodymyr**: gitpush@gmail.com

## ⚠️ Important Notes

- **Change default passwords** after testing
- The script **clears existing data** before seeding
- Run in **development environment** only
- Ensure proper **backup** before running in any important environment

## 🎯 Sample Output

```
🎉 Seeding completed successfully!
📊 Summary:
   • 3 workspaces created
   • 7 user accounts created
   • 10 members created
   • 16 projects created
   • 16 chat rooms created
   • 196 chat messages created
   • 61 documents created
   • 163 tasks created
```

## 🔧 Customization

You can easily customize the seeding data by modifying:

- `sampleWorkspaces` - Workspace names and invite codes
- `sampleUsers` - User accounts and emails
- `sampleProjects` - Project names and types
- `sampleTasks` - Task types and descriptions
- `sampleDocuments` - Document templates and content
- `sampleChatMessages` - Chat message content

## 🐛 Troubleshooting

- **Permission errors**: Ensure your API key has proper permissions
- **Collection not found**: Verify all collection IDs in environment variables
- **Network errors**: Check Appwrite endpoint configuration
- **Seeding fails**: Review console output for specific error messages

---

Happy coding! 🚀 