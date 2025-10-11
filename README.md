# AWS Cognito CRUD Application

A full-stack Next.js application with AWS Cognito authentication and complete CRUD operations for managing items.

## Features

- **Authentication**: AWS Cognito integration with login and signup
- **CRUD Operations**: Create, Read, Update, and Delete items
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components
- **TypeScript**: Full type safety throughout the application
- **Toast Notifications**: User-friendly success and error messages
- **Protected Routes**: Automatic authentication checks and redirects

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: AWS Cognito (amazon-cognito-identity-js)
- **HTTP Client**: Axios
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- AWS Cognito User Pool configured
- Your Serverless REST API deployed

### Installation

1. Clone or download this project

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file in the root directory:
\`\`\`env
# AWS Cognito Configuration
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id_here
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id_here

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-url.execute-api.us-east-1.amazonaws.com/dev
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | Your AWS Cognito User Pool ID | `us-east-1_xxxxxxxxx` |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Your AWS Cognito App Client ID | `xxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_API_URL` | Your Serverless API base URL | `https://xxx.execute-api.us-east-1.amazonaws.com/dev` |

## API Endpoints

The application expects the following REST API endpoints:

- `GET /items` - Get all items
- `GET /items/:id` - Get a single item
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Request/Response Format

**Create/Update Item:**
\`\`\`json
{
  "name": "Item Name",
  "description": "Item Description"
}
\`\`\`

**Item Response:**
\`\`\`json
{
  "id": "uuid",
  "name": "Item Name",
  "description": "Item Description",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── items/              # Items CRUD pages
│   │   ├── [id]/          # Dynamic item routes
│   │   │   ├── page.tsx   # Item details
│   │   │   └── edit/      # Edit item
│   │   ├── add/           # Add new item
│   │   └── page.tsx       # Items list
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects)
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── auth-provider.tsx  # Authentication context
│   ├── item-form.tsx      # Reusable item form
│   └── navbar.tsx         # Navigation bar
├── lib/
│   ├── auth.ts            # AWS Cognito utilities
│   ├── api.ts             # API client and endpoints
│   └── utils.ts           # Utility functions
├── middleware.ts          # Route protection
└── .env.local.example     # Environment variables template
\`\`\`

## Routes

- `/` - Home (redirects to /items or /login)
- `/login` - User login
- `/signup` - User registration
- `/items` - List all items
- `/items/add` - Add new item
- `/items/[id]` - View item details
- `/items/[id]/edit` - Edit item

## Authentication Flow

1. User signs up with username, email, and password
2. AWS Cognito sends verification email
3. User logs in with username and password
4. JWT token is stored in localStorage
5. Token is automatically included in all API requests
6. User can logout to clear session

## Customization

### Changing API Endpoints

Edit `lib/api.ts` to modify endpoint paths or add new API methods.

### Styling

The app uses Tailwind CSS. Modify `app/globals.css` for global styles or component files for specific styling.

### Adding New Fields

To add new fields to items:
1. Update the `Item` interface in `lib/api.ts`
2. Modify `components/item-form.tsx` to include new form fields
3. Update display components to show new fields

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Troubleshooting

### Authentication Issues

- Verify your Cognito User Pool ID and Client ID are correct
- Check that the Cognito App Client has the correct settings (no client secret)
- Ensure email verification is configured in Cognito

### API Connection Issues

- Verify the API URL is correct and accessible
- Check CORS settings on your API
- Ensure the API expects the Authorization header format: `Bearer <token>`

### Build Errors

- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Verify all dependencies are installed: `npm install`

## License

MIT

## Support

For issues or questions, please refer to the Next.js and AWS Cognito documentation.
\`\`\`

```json file="" isHidden
