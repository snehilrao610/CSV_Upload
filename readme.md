# CSV File Uploader and Viewer

## Overview

This project is a web application that allows users to upload CSV files, view a list of uploaded files, and display the data from selected CSV files in a table. It also includes features such as sorting, searching, and pagination for better data management.

## Installation

To run this project locally, follow these steps:

1. Clone the GitHub repository.
   `git clone https://github.com/snehilrao610/CSV_Upload.git`
2. Navigate to the project directory.
   `cd CSV_Upload`
3. Install the project dependencies. (Assuming you have Node.js and npm installed)
   `npm install`

## Usage

4. Start the server.
   `npm run dev`
5. Open your web browser and go to http://localhost:3000 to access the application.
6. Upload CSV files using the provided interface.
7. Select a file from the list to display its data in a table.
8. Use the search box to filter data based on your criteria.
9. Click on the table headers to sort the data in ascending or descending order.
10. Pagination controls allow you to navigate through the data when there are many records.

## Project Structure

The project has the following structure:

- public/: Contains HTML, CSS, and JavaScript files for the frontend.
- uploads/: Temporary storage for uploaded CSV files.
- app.js: The Node.js application file that serves the project.
- package.json and package-lock.json: Define project dependencies and scripts.

## Dependencies

- Express.js: Web application framework for the server.
- Multer: Middleware for handling file uploads.
- csv-parser: Library for parsing CSV data.
- Node.js and npm: JavaScript runtime and package manager.
  `npm install express multer csv-parser`

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or create a pull request on GitHub.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
