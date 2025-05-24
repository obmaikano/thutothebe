# Adding New Pages - React Project0 Pattern

Your frontend properly follows the React Project0 structure for adding new pages. Here's the complete guide:

## 🌐 Adding a New Public Page

Public pages are accessible without authentication (like login, registration, help pages).

### Steps:

1. **Create Page in `/pages` folder**
   ```typescript
   // Example: /src/pages/Help.tsx
   import React from 'react';

   const Help = () => {
     return (
       <div className="container mx-auto p-4">
         <h1>Help & Support</h1>
         <p>This is a public help page</p>
       </div>
     );
   };

   export default Help;
   ```

2. **Add route in `App.tsx`**
   ```typescript
   // Import the component
   const Help = lazy(() => import('./pages/Help'));

   // Add route in the Routes section
   <Routes>
     {/* Existing public routes */}
     <Route path="/login" element={<Login />} />
     
     {/* Add your new public route */}
     <Route path="/help" element={<Help />} />
     
     {/* Protected routes... */}
   </Routes>
   ```

3. **Add to PUBLIC_ROUTES in `/app/auth.ts`**
   ```typescript
   export const PUBLIC_ROUTES: string[] = [
     '/login',
     '/forgot-password',
     '/reset-password',
     '/help',        // Add your new route here
     '/404'
   ];
   ```

## 🔒 Adding a New Protected Page

Protected pages require authentication and appear in the sidebar navigation.

### Steps:

1. **Create Page in `/pages/protected` folder**
   ```typescript
   // Example: /src/pages/protected/Notifications.tsx
   import { useEffect } from 'react';
   import { useDispatch } from 'react-redux';
   import { setPageTitle } from '../../features/common/headerSlice';
   import Notifications from '../../features/notifications';

   function NotificationsPage() {
     const dispatch = useDispatch();

     useEffect(() => {
       dispatch(setPageTitle({ title: "Notifications" }));
     }, [dispatch]);

     return <Notifications />;
   }

   export default NotificationsPage;
   ```

2. **Create Feature Component in `/features` folder**
   ```typescript
   // Create: /src/features/notifications/index.tsx
   import React from 'react';

   const Notifications = () => {
     return (
       <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Notifications</h1>
         <div className="card bg-base-100 shadow-xl">
           <div className="card-body">
             <p>Your notifications will appear here</p>
           </div>
         </div>
       </div>
     );
   };

   export default Notifications;
   ```

3. **Add to sidebar in `/routes/roleSidebar.ts`**
   ```typescript
   // Add to appropriate role menu items
   import { Bell } from 'lucide-react';

   export const studentMenuItems: MenuItem[] = [
     // ... existing items
     {
       icon: Bell,
       label: 'Notifications',
       path: '/app/notifications',
       description: 'View your notifications'
     }
   ];
   ```

4. **Import and map in `/routes/index.tsx`**
   ```typescript
   // Import the page component
   const NotificationsPage = lazy(() => import('../pages/protected/Notifications'));

   // Add to appRoutes array
   export const appRoutes = [
     // ... existing routes
     {
       path: 'notifications',
       element: NotificationsPage
     }
   ];
   ```

5. **Add route to `App.tsx` (if using explicit routes)**
   ```typescript
   // In the protected routes section
   <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
     {/* Existing routes */}
     <Route path="dashboard" element={<Dashboard />} />
     
     {/* Add your new protected route */}
     <Route path="notifications" element={<NotificationsPage />} />
   </Route>
   ```

## 📁 File Structure Example

```
frontend/src/
├── pages/
│   ├── Help.tsx                    # Public page
│   └── protected/
│       └── Notifications.tsx       # Protected page
├── features/
│   └── notifications/
│       ├── index.tsx              # Main component
│       ├── components/            # Feature-specific components
│       └── notificationSlice.tsx  # Redux slice (if needed)
├── routes/
│   ├── index.tsx                  # Route mappings
│   ├── sidebar.ts                 # Basic sidebar items
│   └── roleSidebar.ts            # Role-based sidebar items
├── app/
│   └── auth.ts                    # PUBLIC_ROUTES definition
└── App.tsx                        # Main routing file
```

## 🎯 Key Points

- **Public pages**: Simple components accessible without authentication
- **Protected pages**: Wrapper components that set page titles and include feature components
- **Feature components**: Main logic resides in `/features` folder
- **Redux slices**: Place in feature folders when needed
- **Role-based sidebar**: Use `/routes/roleSidebar.ts` for different user roles
- **Route mapping**: Always add to `/routes/index.tsx` for protected routes

## ✅ Your Current Implementation Status

Your frontend already properly follows this pattern:

- ✅ `App.tsx` handles main routing
- ✅ `/app/auth.ts` contains `PUBLIC_ROUTES`
- ✅ `/routes/roleSidebar.ts` contains role-based sidebar items
- ✅ `/routes/index.tsx` maps protected routes
- ✅ `/pages/protected/` contains protected page components
- ✅ `/features/` contains feature-specific logic and components
- ✅ Redux slices are properly placed in feature folders

Your structure is fully compliant with React Project0 standards! 