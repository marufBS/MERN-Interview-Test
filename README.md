# Assesment of Ontik Technology


This is a drawing application built using React and Fabric.js. The application allows users to create, edit, and save drawings on a canvas. The canvas state, drawings managed with Redux and stored in a MongoDB database. 
***

## Features

- **Drawing Tools**: Draw shapes (rectangles, circles, lines), freehand drawing, and add text.
- **Canvas State Management**: Save and restore canvas state using Redux and MongoDB.
- **Real-time Updates**: Update and save the canvas state.
- **Responsive UI**: Built with a responsive user interface using React and Fabric.js.

## Technologies Used

- **React**: For building the user interface.
- **Fabric.js**: To provide drawing tools and canvas manipulation.
- **Redux**: For managing the state of the canvas and application.
- **MongoDB**: To store canvas data and base64 image thumbnails.
- **Axios**: For making HTTP requests to the backend.
- **Node.js & Express**: For the backend server and REST API.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/marufBS/MERN-Interview-Test.git
    ```
2. Navigate to the project directory:
    ```bash
    cd project-name
    ```
3. Install dependencies for both client and server:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```
4. Set up your `.env` file in the `server` folder with the following:
    ```env
    MONGODB_URI=mongodb+srv://whiteboard-dev:rEt96UbleBHaF5lP@cluster0.s24bq.mongodb.net
    ```
5. Start the development server:
    ```bash
    cd client
    npm start
    cd ../server
    npm start
    ```

## Usage

1. Open the application in your browser.
2. Use the toolbar to draw on the canvas:
   - **Select Tool**: Select and move objects.
   - **Draw Tool**: Freehand drawing.
   - **Shapes**: Add rectangles, circles, and lines.
   - **Text**: Add text to the canvas.
3. The canvas will update on clicking the update button from navbar.

## Project Structure

- **client**: Contains the React frontend.
- **server**: Contains the Node.js backend and REST API.
- **components**: React components such as `Drawingpad`, `Toolbar`, and `Navbar`.
- **redux**: Redux slices for managing canvas state.

## Saving Canvas State

- **Local State**: Canvas state is managed locally using React's `useState`.
- **Redux**: Global state management using Redux to store the canvas and thumbnail data.
- **MongoDB**: Persistent storage for canvas data and base64 thumbnails.


## Future Improvements

- **Enhanced Drawing Tools**: Add more drawing options like dynamic dynamic canvas, image upload, canvas export to jpg/png and color pickers.
- **User Authentication**: Implement user login to save and manage individual users' drawings.
- **Collaborative Drawing**: Enable real-time collaborative drawing features.

## Contributing

Feel free to fork this repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
