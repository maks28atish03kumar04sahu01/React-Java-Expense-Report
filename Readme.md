# Full Stack Expense Report

## Description

A complete full-stack expense management solution that streamlines personal and small-business bookkeeping. The intuitive React interface adapts to all screen sizes for fast data entry and review, while the Java API handles validation, persistence, and secure user sessions. Core features include CRUD operations for expense items, user registration/login, and exportable PDF summaries for each user’s expense history. Built for clarity and reliability, the app makes tracking, reporting, and archiving expenses fast and fuss-free.

## Feature highlights

1. Fully responsive React front end (mobile → desktop)

2. Secure authentication and session management

3. Complete CRUD for expense items (add, list, edit, delete)

4. Server-side validation and persistent storage (Java backend)

5. PDF generation of expense reports for download or printing

6. Clean UI with focus on accessibility and ease of use

## Frontend Tech Stacks

1. npm create vite@latest

2. npm install react-router@latest

3. npm install react-router-dom@latest

4. npm install axios@latest

5. npm install @tanstack/react-query

6. npm install react-icons --save

7. npm install zustand

8. npm install html2canvas jspdf

9. npm install react-to-print

10. npm install react-hot-toast

11. npm install react-spinners --save

12. npm i react-cookie

13. npm install react-chartjs-2

14. npm install chart.js

## Frontend Execution

```cmd
    npm install

    npm run dev
```

## Frontend '.env' demo

1. VITE_API_BASE_URL = Add Your Backend URL

2. VITE_API_BASE_PATH = Add Your Backend Universal Path

3. VITE_FRONTEND_BASE_URL = Add Your Frontend URL

4. VITE_FRONTEND_BASE_PATH = Add Your Frontend Universal Path

## Backend Tech Stacks

1. Java

2. Spring Boot & Framework

3. Hibernate

4. Maven

5. Mongo DB

## Backend Execution

```cmd
    java -version

    mvn -versio

    mvn clean

    mvn clean install

    mvn spring-boot:run
```

## Backend 'application.properties' demo

1. server.port = Add Your PORT Value

2. spring.data.mongodb.uri = Add Your Mongo DB URI

3. jwt.secret = Add Your Secret Key For Authorization

4. jwt.expiration = Add Your Mongo Authorization Expiry Date

5. spring.application.name = Add Your Project Name

6. cors.allowed.origins = Add Your Frontend URL