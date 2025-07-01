# full stack
# README



Charbel El Khoury


This project utilizes the [REST Countries API](https://restcountries.com/), a free and open-source API that provides comprehensive data about countries worldwide. The API offers a wide range of information, including country names, capitals, populations, regions, subregions, languages, currencies, timezones, borders, and national flags. It is designed to be easy to use and is suitable for educational, research, and development purposes. The API supports various endpoints for searching and filtering countries, making it a valuable resource for building interactive and informative applications related to world geography and demographics.



This web application is an interactive platform that enables users to discover and learn about countries from all over the world. Built with HTML, CSS, and JavaScript, the application fetches real-time data from the REST Countries API and presents it in a visually appealing and user-friendly manner. The main features of the application include:

- *Search Functionality:* Users can search for countries by name, allowing for quick access to specific country information.
- *Country List and Details:* The application displays a list of countries, each with its flag, name, and region. Clicking on a country reveals detailed information such as its capital, population, area, languages spoken, currencies, and neighboring countries.
- *Responsive Design:* The interface is fully responsive, ensuring a seamless experience on both desktop and mobile devices.
- *Error Handling:* The application gracefully handles errors, such as failed API requests or invalid user input, providing helpful feedback to users.
- *Modern UI/UX:* The design emphasizes clarity and ease of use, with intuitive navigation and visually distinct sections for different types of information.

This project demonstrates key web development skills, including API integration, asynchronous JavaScript (fetch/async/await), DOM manipulation, and responsive design principles. It serves as a practical example of how to build a data-driven web application that interacts with external services.


A notable custom requirement implemented in this project is the advanced filtering and categorization of countries by region. While the REST Countries API provides endpoints for retrieving countries by region, this application enhances the user experience by allowing dynamic, client-side filtering after fetching all country data. Users can select a region (such as Africa, Americas, Asia, Europe, or Oceania) from a dropdown menu, and the application instantly updates the displayed list of countries to match the selected region without requiring additional API calls.

This approach offers several benefits:
- *Performance:* By fetching all country data once and filtering on the client side, the application reduces the number of API requests, resulting in faster and smoother interactions.
- *User Experience:* Users can quickly switch between regions and see results immediately, making exploration more engaging and efficient.
- *Extensibility:* The filtering logic can be easily extended to support additional criteria, such as population size, language, or currency, providing a flexible foundation for future enhancements.

This custom requirement demonstrates thoughtful design and a focus on usability, going beyond the basic capabilities of the API to deliver a richer and more interactive experience for users interested in world geography.

