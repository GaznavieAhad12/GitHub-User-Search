# GitHub User Search Interface

A responsive React-based web application built with Next.js that allows users to search for GitHub users and view their public profile information and top 5 repositories.

## 🚀 Features

### Core Requirements
- **User Input Form**: Search input field with search button
- **Profile Display**: User avatar, name, bio, location, followers, following count
- **Top 5 Repositories**: Displays repositories sorted by star count
- **Loading States**: Skeleton loaders during API calls
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile-first, fluid layout with card-based design

### Bonus Features
- **Debounced Search**: Automatic search with 500ms delay as you type
- **Dark Mode Toggle**: Switch between light and dark themes
- **Clean UI**: Modern interface using shadcn/ui components

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React.js with App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: GitHub REST API
- **Language**: JavaScript (ES6+)
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## 📋 Requirements Met

### 1. User Input Form ✅
- Search input for GitHub username
- Search button to trigger search
- Enter key support for quick search

### 2. Fetch & Display ✅
- **Profile Info**: Name, avatar, bio, location, followers count, join date
- **Top 5 Repositories**: Sorted by stars with language, stars, and forks
- **Loading States**: Skeleton components during API calls
- **Error States**: Clear error messages for failed requests

### 3. Responsive Layout ✅
- Mobile-first design approach
- Fluid layout that adapts to all screen sizes
- Card-based grid system for repositories
- Responsive navigation and typography

### 4. Bonus Features ✅
- **Debounced Search**: Reduces API calls with 500ms delay
- **Dark Mode**: System preference detection with manual toggle
- **Enhanced UX**: Loading skeletons, external links, badges

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**:
\`\`\`bash
git clone <your-repo-url>
cd github-user-search
\`\`\`

2. **Install dependencies**:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Run the development server**:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Search**: Enter a GitHub username in the search field
2. **Submit**: Click the "Search" button or press Enter
3. **View Results**: See user profile and top 5 repositories
4. **Explore**: Click on profile or repository links to visit GitHub
5. **Theme**: Toggle dark/light mode using the theme button

## 🔧 API Integration

### GitHub REST API Endpoints Used:
- **User Profile**: \`GET https://api.github.com/users/{username}\`
- **User Repositories**: \`GET https://api.github.com/users/{username}/repos\`

### Rate Limiting:
- 60 requests per hour for unauthenticated requests
- Debounced search helps minimize API calls

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1024px)**: Two-column repository grid
- **Desktop (> 1024px)**: Three-column repository grid

## 🎨 UI Components

Built using shadcn/ui components:
- **Cards**: For user profile and repository display
- **Buttons**: For search and external links
- **Input**: For username search field
- **Avatar**: For user profile images
- **Badges**: For repository languages and stats
- **Skeleton**: For loading states

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

### Deploy to Netlify
1. Build the project: \`npm run build\`
2. Deploy the \`out\` folder to Netlify

## 📁 Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.js            # Root layout with theme provider
│   ├── loading.js           # Loading component
│   └── page.js              # Main search interface
├── components/
│   ├── theme-provider.jsx   # Theme context provider
│   └── ui/                  # shadcn/ui components
├── README.md                # Project documentation
└── package.json             # Dependencies and scripts
\`\`\`

## 🧪 What This Tests

- **API Integration**: Fetch API usage with GitHub REST API
- **Component Structure**: Modular React component design
- **State Management**: useState and useEffect hooks
- **Error Handling**: Try-catch blocks and user feedback
- **Responsive CSS**: Tailwind CSS responsive utilities
- **Clean Code**: Readable, maintainable JavaScript code
- **User Experience**: Loading states, error messages, intuitive UI

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- GitHub REST API for providing user and repository data
- shadcn/ui for beautiful, accessible UI components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
