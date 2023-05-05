# PROMPT

**PROMPT** is a support tool designed to assist program management in project-based courses.

The tool is build with the following architecture:
* **PostgreSQL database**
* **server**
* **client** 

### PostgreSQL

### Server

The **server** component is a **Spring Boot** application running on post **8080**.

### Client

The **client** component is built with the **React** framework.
On localhost the application starts on port **3000**. When running 
the application inside a Docker container build with the Dockerfile, the application runs under **80**.