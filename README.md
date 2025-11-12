## 🎥 Demo Video

Experience **Framez** in action — a mobile social app built with React Native.  
Watch the demo below to see the core features: authentication, posting, and user profiles.

🔗 [**Watch Demo Video on Google Drive**](https://drive.google.com/drive/folders/18tuajPK6SUg7g94aXW1cpm6Pau7r4xo5)

---

## 🚀 Overview
Framez-app is a versatile and feature-rich Expo project designed to help users share their moments effortlessly. This app leverages modern React Native and Expo technologies to provide a seamless user experience across Android, iOS, and the web. Whether you're a developer looking to build a social media app or a user who wants to share your experiences, Framez-app is the perfect starting point.

## ✨ Features
- 📸 Image upload and sharing
- 🗣️ Text-based posts with rich formatting
- 🌟 User profiles and authentication
- 🔒 Secure user data with Supabase
- 📱 Responsive design for mobile and web

## 🛠️ Tech Stack
- **Programming Language:** TypeScript
- **Frameworks & Libraries:**
  - Expo
  - React Native
  - React Navigation
  - Supabase
  - Lucide React Native
- **Tools:**
  - ESLint
  - TypeScript
  - Expo CLI

##  Installation

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Expo CLI

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/framez-app.git

# Navigate to the project directory
cd framez-app

# Install dependencies
npm install

# Start the app
npx expo start
```

### Alternative Installation Methods
- **Using Yarn:**
  ```bash
  yarn install
  yarn start
  ```

- **Docker Setup:**
  - Ensure Docker is installed
  - Run `docker-compose up` in the project root

## 🎯 Usage

### Basic Usage
```typescript
// Import necessary components and hooks
import { useAuth } from '../src/context/AuthContext';
import { supabase } from '../src/config/supabase';

// Example of fetching posts
const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('Posts:', data);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

// Call the function
fetchPosts();
```

### Advanced Usage
- **Customizing User Profiles:**
  ```typescript
  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      console.log('Profile:', data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Call the function
  fetchProfile('user-id');
  ```

## 📁 Project Structure
```
framez-app/
├── app/
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   └── profile.tsx
│   ├── +not-found.tsx
│   └── _layout.tsx
├── components/
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   ├── themed-view.tsx
│   └── ui/
│       ├── collapsible.tsx
│       └── icon-symbol.tsx
├── constants/
│   └── theme.ts
├── hooks/
│   └── use-color-scheme.ts
├── scripts/
│   └── reset-project.js
├── src/
│   ├── config/
│   │   └── supabase.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   └── types/
│       └── index.ts
├── .gitignore
├── app.json
├── eas.json
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

