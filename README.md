# Chat Application

## Description

This chat application was developed as part of a technical challenge. It allows users to interact in real-time, reply to messages, add reactions, preview images, and view participant details. The focus was on creating a functional and maintainable application with a clear structure.

---

## Implemented Features

### Mandatory

1. **Main Chat Screen**:

   - Displays all messages in an interactive list.
   - Each message includes an avatar, participant name, and timestamp.

2. **Edited Messages**:

   - Edited messages display an `(edited)` indicator.

3. **Message Reactions**:

   - Messages with reactions display a row of emojis with a reaction counter.

4. **Grouped Messages**:

   - Consecutive messages from the same participant are grouped visually.

5. **Message Input Bar**:

   - Users can send new messages through a functional input bar.

6. **Image Support**:
   - Attached images in messages are displayed and can be enlarged in a modal.

---

### Optional

1. **Date Separators**:

   - Messages are organized by days, with separators like `Today` and `Yesterday`.

2. **Reply to Messages**:

   - Users can reply to specific messages, showing the original content.

3. **Participant Modal**:

   - Clicking on a participant shows a modal with their details.

4. **Image Modal**:

   - Images can be previewed in a full-screen modal.

5. **Simulated Reactions**:

   - Users can react to messages with emojis, although these reactions are not persisted on the backend.

6. **Automatic Scroll**:
   - The app ensures the most recent messages are visible upon opening.

---

## Technical Requirements

### Technologies Used

- **React Native (Expo)**: Cross-platform mobile development framework.
- **Zustand**: Lightweight state management library.
- **AsyncStorage**: Local data persistence.
- **TypeScript**: Static typing for better code quality and maintainability.

### Installation

1. Clone the repository:
   `git clone https://github.com/MelaraTechLab/tribe-chat.git`

2. Install dependencies:
   `npm install`

3. Start the application:
   `npm start`

---

## Project Structure

The project is organized into folders that group related functionality, making it easier to navigate and maintain:

1. **`api/`**:

   - Handles communication with the backend, such as fetching messages and sending reactions.
   - Example: `chatApi.ts` includes API functions for the chat.

2. **`components/`**:

   - Reusable UI elements, including:
     - `ChatInput.tsx`: For sending messages.
     - `MessageList.tsx`: To display and group messages.
     - `ParticipantModal.tsx`: To show participant details.
     - `ImagePreviewModal.tsx`: To preview attached images.

3. **`screens/`**:

   - Includes high-level screens:
     - `ChatScreen.tsx`: Combines components to create the main chat interface.

4. **`store/`**:

   - Manages global state using Zustand.
   - Example: `useChatStore.ts` for handling messages, participants, and reactions.

5. **`styles/`**:

   - Centralized styling for consistent design across the app.

6. **`types/`**:
   - Defines data structures and types for messages, participants, and reactions.

---

## Technical Decisions

1. **Global State**:

   - Zustand was chosen for its ease of use and effectiveness in managing global state.

2. **Scroll Handling**:

   - The app ensures that the most recent messages are visible upon opening using optimized scroll techniques.

3. **Data Persistence**:

   - Messages and participants are saved locally with AsyncStorage for a smooth user experience.

4. **Code Modularity**:
   - The code is organized into components and utilities, making it easy to extend and maintain.

---

## Future Improvements

1. **Infinite Scrolling**:

   - Expand the current implementation to support older messages.

2. **Reactions Persistence**:

   - Integrate backend support for storing and retrieving user reactions.

3. **Mentions**:

   - Add the ability to tag participants using `@`.

4. **Enhanced Design**:
   - Improve the visual appeal and make the app more responsive.

---

## Known Issues

1. **Scroll Initialization**:
   - In very large lists, the scroll may occasionally not align perfectly at the bottom.

---

## How to Contribute

1. Fork the project.
2. Create a new branch:
   `git checkout -b feature/<feature-name>`

3. Commit your changes:
   `git commit -m "Description of changes"`

4. Push your changes and open a Pull Request.

---

## Final Notes

This project demonstrates skills in mobile development with React Native, efficient state management, and modular code organization. The main focus was to deliver a functional application while leaving room for future improvements.
