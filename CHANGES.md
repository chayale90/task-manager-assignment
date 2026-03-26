🛠️ Project Updates & Improvements
1. Stability & Refactoring
State Management Optimization: Implemented Lifting State Up to the Dashboard component. This resolved a data synchronization bug between the dashboard and task list, ensuring new tasks appear immediately without requiring a manual page refresh.

Database Seed Integrity: Fixed the original seed script which created duplicate tags on every execution. Refactored the logic to use Prisma’s upsert and added a cleanup utility to ensure a consistent and unique database state.

Full-stack Type Safety: Performed a comprehensive audit and fixed type mismatches between the Frontend and Backend, ensuring a seamless flow of data from the API to the UI.

Login & Registration Fixes: Fixed the login and redirect bug in the AuthContext. Added secure registration validation (using Zod) including email format checks and minimum password length, shared across both client and server.

Backend Ordering: Updated the getTasks query in the backend to ensure new tasks always appear at the top of the list (createdAt: 'desc').

2. New Features
Advanced Filtering & Search (Option B): Implemented server-side filtering by status and priority, full-text search, and full state synchronization with the URL (Shareable links).

Filter Presets: Added functionality to save filter combinations to localStorage for instant access without additional server requests.

Activity Feed (Option D): Built a comprehensive audit log system that tracks every task change and displays a visual history feed within the Task Detail view.

Smart Undo Delete (Creative Feature): Implemented an Optimistic UI delete mechanism with a 5-second "Undo" window. This improves user experience by allowing users to revert accidental deletions before they are processed by the server.

3. Technical Excellence
Cross-Stack Validation: Introduced a shared/ directory with Zod schemas used by both the Frontend and Backend, establishing a Single Source of Truth for data validation.

Dark Mode & Responsive UI: Added full support for Dark/Light modes and ensured a responsive design across all system components, maintaining high accessibility and UX standards.

Search Debouncing: Implemented a 400ms debounce on the text search to optimize server performance and prevent request flooding during typing.

💡 Architectural Decisions
LocalStorage for Presets: Chose client-side storage for personal UI preferences to provide zero-latency responsiveness and reduce database overhead.

Service-based Logging: Centralized the activity logging logic into a dedicated backend service to keep the controllers clean, modular, and maintainable.