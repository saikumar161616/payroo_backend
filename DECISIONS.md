# Future Improvements

- I plan to implement WebSockets to enable real-time communication features such as notifications.

- I intend to integrate RabbitMQ as a message queue service for PDF generation, which will help offload resource-intensive tasks from the main server.

- Plan to store genrated files, such ad PDF's, in an AWS S3 bucket for reliable and scalable file storage


- Plan to implement redis cache to store frequently accessed data in memory significantly reducing database load and improving response times.


- I plan to implement a **multi-tenant architecture** where a single backend will serve multiple clients, each accessible via a unique subdomain (e.g., `https://clientname.payroo.com`). The backend will first connect to a **master database**, which stores tenant-specific metadata and database connection details. For every incoming request, I will extract the client identifier (slug) from the request origin, fetch or reuse the corresponding database connection, and store it in a namespace object. This mapped database connection will then be attached to the request object (`req.db`), ensuring all API routes operate on the correct tenant database seamlessly.


- I will plan to deploy on an Ubuntu EC2 instance using Nginx / Apache web servers and set up load balncers.