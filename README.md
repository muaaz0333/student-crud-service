# 🎓 Student CRUD Service

This is the Student CRUD (Create, Read, Update, Delete) service for the system. It handles all operations related to managing student data. Upon successful creation of a student record (POST request), this service publishes a message to a RabbitMQ exchange to trigger an email notification via the SMTP Email Service.

## ✨ Features

* ✅ Create new student records.
* 📄 Retrieve student records (single or all).
* ✏️ Update existing student records.
* 🗑️ Delete student records.
* 📬 Publishes message to RabbitMQ on student creation for email notification.

## 🧰 Technology Stack

* 🚀 NestJS
* 🔤 TypeScript
* 🍃 MongoDB
* 🐳 Docker
* 📦 `@nestjs/microservices`, `amqplib`

## 🔗 System Dependencies

This service depends on the following external services:

* 📨 **RabbitMQ Broker:** Used for publishing messages for email notifications.
* 🍃 MongoDB

## ⚙️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/muaaz0333/student-crud-service.git
    cd student-crud-service
    ```

2.  **Install dependencies:**
    ```bash
    npm install 
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory based on the `.env.example` provided.
    ```bash
    # Example .env.example
    PORT=3000 # Or desired port
    RMQ_URL=amqp://localhost:5672 # Or your RabbitMQ connection string
    MONGODB_URI= Enter your mongo DB uri   
    ```

4.  **Run RabbitMQ:**
    Ensure your RabbitMQ Docker container is running:
    ```bash
    docker run -d --hostname my-rabbit --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
    ```
    (Access management UI at `http://localhost:15672` with default guest/guest credentials)


5.  **Run the service:**

    * **Development mode (with hot-reloading):**
        ```bash
        npm start:dev # or yarn start:dev
        ```
    * **Production mode:**
        ```bash
        npm start:prod # or yarn start:prod
        ```

## 📡 API Endpoints

The service runs on the configured PORT (default 3001).

| Method | Endpoint       | Description                | Request Body (Example)                                                                                                                     |
| :----- |:---------------| :------------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------|
| `POST` | `/student`     | Create a new student       | `{  "name":"Muaaz Ahmad", "email":"muaazahmad001@gmail.com", "rollNumber":173, "gender":"male", "marks":100, "password":123, "class":1  }` |
| `GET`  | `/student`     | Get all students           | None                                                                                                                                       |
| `GET`  | `/student/:id` | Get student by ID          | None                                                                                                                                       |
| `PUT`  | `/student/:id` | Update student by ID       | `{ "name": "Muaaz",.... }`                                                                                                                 |
| `DELETE`| `/student/:id` | Delete student by ID       | None                                                                                                                                       |

## 📬 RabbitMQ Integration

* **Exchange:** `email_exchange`
  * **Message Published (on POST /students):**
      * **Routing Key:** Likely uses a specific routing key (e.g., `student.created`). Document the exact routing key your service uses.
        * **Payload:** Contains information about the newly created student, specifically the email address needed by the SMTP service. Example payload:
            ```json
           {
              "message": "Student has been created successfully, and email sent",
              "newStudent": {
              "name": "Muaaz Ahmad",
              "email": "muaazahmad001@gmail.com",
              "rollNumber": 173,
              "class": 1,
              "gender": "male",
              "marks": 100,
              "password": 123,
              "_id": "681b365d4aa968ebaeff06e1",
              "__v": 0
          }
            ```
      * 🔔 **Note:** Ensure the exchange and any necessary queues/bindings are set up in RabbitMQ.


## 🙌 Follow the Author

Made with ❤️ by **Muaaz Ahmad**  
👨‍💻 GitHub: [@muaaz0333](https://github.com/muaaz0333)  
🔗 LinkedIn: [linkedin.com/in/MuaazAhmad](https://www.linkedin.com/in/expertfullstackdeveloper/)