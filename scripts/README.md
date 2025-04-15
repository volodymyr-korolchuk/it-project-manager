# Database Seeding Script

This directory contains scripts for seeding your Appwrite database with sample data for development and testing purposes.

## 🚀 Quick Start

### Prerequisites

1. **Appwrite Server API Key**: You need a server API key with database write permissions
2. **Environment Variables**: Proper configuration in your `.env.local` file
3. **Node Dependencies**: Install the required packages

### Installation

```bash
# Install required dependencies
npm install node-appwrite dotenv
```

### Environment Setup

Add these variables to your `.env.local` file:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your-project-id
APPWRITE_KEY=your-server-api-key

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your-workspaces-collection-id
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your-members-collection-id
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=your-projects-collection-id
NEXT_PUBLIC_APPWRITE_TASKS_ID=your-tasks-collection-id
```

### Getting Your Server API Key

1. Go to your [Appwrite Console](https://cloud.appwrite.io)
2. Navigate to your project
3. Go to **Settings** > **API Keys**
4. Create a new API key with the following scopes:
   - `documents.read`
   - `documents.write`
   - `collections.read`
   - `databases.read`

### Running the Seed Script

```bash
# Run the seeding script
node scripts/seed.js

# Or add it to your package.json scripts:
npm run seed
```

## 📊 What Gets Created

The seeding script creates realistic sample data including:

### Workspaces (3 total)
- **Acme Corporation** - Enterprise workspace
- **Tech Innovators Inc** - Tech startup workspace  
- **Digital Solutions LLC** - Digital agency workspace

### Members (6 total)
- Users distributed across workspaces
- Mix of admin and regular member roles
- Realistic names and email addresses

### Projects (6-9 total)
- **Website Redesign**
- **Mobile App Development** 
- **API Integration**
- **Database Migration**
- **Security Audit**
- **Performance Optimization**

### Tasks (18-45 total)
- Various task statuses (Backlog, Todo, In Progress, In Review, Done)
- Realistic descriptions and due dates
- Proper assignee relationships
- Kanban position ordering

## 🛠️ Customization

### Modifying Sample Data

You can customize the sample data by editing the arrays in `seed.js`:

```javascript
const sampleWorkspaces = [
  // Add your own workspace data
];

const sampleUsers = [
  // Add your own user data
];

const sampleProjects = [
  // Add your own project data
];

const sampleTasks = [
  // Add your own task data
];
```

### Adjusting Quantities

Modify these values in the seeding functions:

```javascript
// In seedProjects function
const projectCount = Math.floor(Math.random() * 2) + 2; // 2-3 projects per workspace

// In seedTasks function  
const taskCount = Math.floor(Math.random() * 3) + 3; // 3-5 tasks per project
```

## 🔧 Advanced Usage

### Selective Seeding

You can run individual seeding functions:

```javascript
import { runSeed } from './scripts/seed.js';

// Run only workspace seeding
const workspaces = await seedWorkspaces();
```

### Error Handling

The script includes comprehensive error handling:
- Validates environment variables
- Handles missing dependencies gracefully
- Provides detailed error messages
- Clears data safely before seeding

### Development vs Production

**⚠️ Important**: This script is designed for development environments only. 

- It clears all existing data before seeding
- Uses placeholder user IDs
- Should not be run against production databases

## 📝 Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   Error: Missing required environment variables
   ```
   Solution: Check your `.env.local` file has all required variables

2. **Authentication Failed**
   ```
   Error: Unauthorized
   ```
   Solution: Verify your `APPWRITE_KEY` has the correct permissions

3. **Collection Not Found**
   ```
   Error: Collection not found
   ```
   Solution: Ensure your collection IDs in environment variables are correct

4. **Permission Denied**
   ```
   Error: Document permissions missing
   ```
   Solution: Check your collection permissions allow server-side writes

### Getting Help

- Check the [Appwrite Documentation](https://appwrite.io/docs)
- Visit [Appwrite Discord](https://discord.gg/appwrite) for community support
- Review [Appwrite Server SDK Reference](https://appwrite.io/docs/server/databases)

## 🧪 Testing the Data

After running the seed script, you can verify the data was created:

1. **Appwrite Console**: Check your collections in the web console
2. **Application**: Start your Next.js app and browse the workspaces
3. **API**: Use the Appwrite REST API to query the data

```bash
# Start your application
npm run dev

# Visit http://localhost:3000 to see the seeded data
```

## 📚 Related Documentation

- [Appwrite Databases](https://appwrite.io/docs/databases)
- [Node.js Server SDK](https://appwrite.io/docs/server/databases)
- [Database Seeding Best Practices](https://appwrite.io/threads/1096115914245668914) 