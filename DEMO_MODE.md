# TaskFlow Demo Mode

TaskFlow includes a "Demo Mode" feature that allows users to try out the application without needing to register or log in.

## How Demo Mode Works

When a user is not authenticated (no valid JWT token), the application automatically enters demo mode. In this mode:

1. Users can access the Dashboard and Tasks pages
2. Users can create, edit, delete, and manage tasks
3. A demo banner appears at the top of the screen to indicate demo mode
4. All changes are stored in memory only and will be lost when the browser is closed
5. Login and registration buttons remain visible to encourage account creation

## Technical Implementation

Demo mode is implemented using the following components:

### 1. DemoContext

A React context that manages:
- Demo mode state
- Demo tasks data
- CRUD operations for demo tasks

### 2. TaskContext Integration

The TaskContext is modified to:
- Check if the app is in demo mode
- Use demo operations when in demo mode
- Use API operations when authenticated

### 3. Protected Routes

The ProtectedRoute component is updated to:
- Allow access to protected routes in demo mode
- Show the demo banner when in demo mode
- Redirect to login only when not in demo mode and not authenticated

### 4. Demo Banner

A persistent banner that:
- Appears only in demo mode
- Informs users that changes won't be saved permanently
- Provides quick access to registration and login

## Benefits of Demo Mode

1. **Lower Barrier to Entry**: Users can try the app without committing to registration
2. **Increased Engagement**: Users can experience the full functionality before signing up
3. **Better Conversion**: Users who like the app after trying it are more likely to register
4. **Improved User Experience**: No frustrating "login walls" before seeing the value

## Future Enhancements

Potential improvements to demo mode:
- Persist demo data in localStorage to survive page refreshes
- Add a "Save My Data" button to convert demo account to real account
- Implement guided tours or tooltips specifically for demo users
- Track demo mode usage analytics to improve conversion