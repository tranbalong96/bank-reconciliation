<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <!-- <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul> -->
    </li>
    <li>
      <a href="#solution-diagrams">Solution diagrams</a>
    </li>
    <li>
      <a href="#docker-container">Docker Container</a>
      <ul>
        <li><a href="#api-public-bank-reconciliation">api-public-bank-reconciliation</a></li>
        <li><a href="#api-private-bank-reconciliation">api-private-bank-reconciliation</a></li>
        <li><a href="#bank_reconciliation_db">bank_reconciliation_db</a></li>
        <li><a href="#phpmyadmin">phpmyadmin</a></li>
        <li><a href="#rabbitmq">rabbitmq</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#curl">cURL</a>
    <!-- <ul>
        <li><a href="#register_account">Register account</a></li>
        <li><a href="#login">Login</a></li>
        <li><a href="#import">Import transaction with file</a></li>
        <li><a href="#get_all">Get all transactions</a></li>
        <li><a href="#get_by_id">Get by transaction id</a></li>
        <li><a href="#create">Create new transaction</a></li>
        <li><a href="#update">Update transaction</a></li>
        <li><a href="#delete">Delete  transaction</a></li>
      </ul> -->
    </li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
- The system helps the bank to import transactions into the database with user authentication. 
- The system provides API for client to call via HTTP(s) protocol
to import the transactions.
- The system import Excel/CSV file can have more than 1 million records.

<!-- SOLUTION DIAGRAMS -->
## Solution diagrams
![Alt text](./image/solution-diagram.png?raw=true)
- After the user has authenticated, users can import data into the database using Excel/CSV files through "Publisher"
- The Publisher receives data from the user, it will analyze the data, grouping records by a custom configured number place it onto a queue defined in RabbitMQ.
- Other applications, called consumers, connect to the queue and subscribe to the data to be inserted into the database. 
- Messages placed onto the queue are stored until the consumer retrieves them.

<!-- DOCKER CONTAINER -->
## Docker Container
### api-public-bank-reconciliation
```yml
api-public-bank-reconciliation:
    image: api-public-bank-reconciliation
    build: api-public-bank-reconciliation
    depends_on:
      - bank_reconciliation_db
    ports:
      - "8000:3000"
    volumes:
      - ./src:/home/app/src
    environment:
      DB_HOST: bank_reconciliation_db
      DB_USER: user
      DB_PASSWORD: secret
      DB_NAME: bank_reconciliation
```
API for client to call via HTTP(s) protocol
to import the transactions.
### api-private-bank-reconciliation
```yml
api-private-bank-reconciliation:
    image: api-private-bank-reconciliation
    build: api-private-bank-reconciliation
    depends_on:
      - bank_reconciliation_db
    volumes:
      - ./src:/home/app/src
    environment:
      DB_HOST: bank_reconciliation_db
      DB_USER: user
      DB_PASSWORD: secret
      DB_NAME: bank_reconciliation
```
API connects to the queue and subscribes to the data to be inserted into the database.
### bank_reconciliation_db
```yml
image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: bank_reconciliation
      MYSQL_USER: user
      MYSQL_PASSWORD: secret
    ports:
      - "3306:3306"
    expose:
      - "3306"
```
Database for the system to query data.
### phpmyadmin
```yml
phpmyadmin:
    image: phpmyadmin/phpmyadmin
    depends_on:
      - bank_reconciliation_db
    ports:
      - "8888:80"
    environment:
      PMA_HOST: bank_reconciliation_db
      MYSQL_ROOT_PASSWORDL: secret
    links:
      - bank_reconciliation_db
```
phpMyAdmin is an open source tool written in the PHP programming language to handle MySQL administrative tasks through a web browser.
### rabbitmq
```yml
rabbitmq:
    image: rabbitmq:3-management
    ports:
      - 5672:5672
      - 15672:15672
```
RabbitMQ is messaging middleware that works to connect `api-public-bank-reconciliation` systems and `api-private-bank-reconciliation`, allowing them to communicate with each other. 
<!-- GETTING STARTED -->
## Getting Started
To get a local copy up and running follow these simple example steps.
### Prerequisites
<!-- * npm
  ```sh
  npm install npm@latest -g
  ```
* Docker
<br>You can install docker through 
[the link](https://docs.docker.com/get-docker/) -->

[Install Docker Compose](https://docs.docker.com/compose/install/)

### Installation
To get started, to install the starter project with Git:

```sh
$ git clone https://github.com/tranbalong96/bank-reconciliation.git
$ cd bank-reconciliation
$ docker-compose up -d
```
<!-- USAGE EXAMPLES -->
## Usage
1. Register an account
2. Login to system, After login you get an accessToken
3. Add accessToken to Bearer Token
4. Call API to import data with file transaction.csv or transaction.xlsx in folder
## cURL
### Register account
```
curl -L -X POST "http://localhost:8000/user/register" -H "Content-Type: application/json" --data-raw "{\"name\": \"My Name\",\"username\": \"username\",\"password\": \"12345678\",\"confirmPassword\": \"12345678\"}"
```
#### Description 
- `name` is name of user
- `username` for the user to login into the system
- `password` for the user to login into the system
- `confirmPassword` conform your password

<br />
If success will be return:

- id
- name
- username

### Login 
```
curl -X POST "http://localhost:8000/auth/login" -H "Content-Type: application/json" -d "{\"username\":\"username\",\"password\":\"12345678\"}"
```
#### Description 
- `password` for the user to login into the system
- `confirmPassword` conform your password

<br />
If success will be return:

- accessToken: add this value to Bearer Token when calling another API

### Import transaction with file
#### Import csv file 
```
curl -X POST "http://localhost:8000/transaction/import" -H "Authorization: Bearer {token}" -F "file=@records/transaction.csv"
```
#### Import excel file 
```
curl -X POST "http://localhost:8000/transaction/import" -H "Authorization: Bearer {token}" -F "file=@records/transaction.xlsx"
```
#### Description 
- `token` can get this token after login

<br />
If success will be return:

- `successImport` number record can import to database.
- `errorImport` number record can't import to database.
- Array `errorData` have data invalid, it's don't insert to database
### Get all transactions
```
curl -X GET "http://localhost:8000/transaction" -H "Content-Type: application/json" -H "Authorization: Bearer {token}"
```
#### Description 
- `token` can get this token after login

<br />
If success will be return:

- Array transactions with `id`, `content`, `amount`, `type`, `date`

### Get by transaction id
```
curl -X GET "http://localhost:8000/transaction/:id" -H "Content-Type: application/json" -H "Authorization: Bearer {token}"
```
#### Description 
- `token` can get this token after login
- `:id` is id of transaction

<br />
If success will be return:

- Object transaction with `id`, `content`, `amount`, `type`, `date`

### Create new transaction
```
curl -X POST "http://localhost:8000/transaction" -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d "{\"content\":\"ABC\", \"amount\":100, \"type\": \"Deposit\", \"date\": \"2022-03-18T20:54:11.396Z\"}"
```

#### Description 
- `content` can get this token after login
- `amount` is id of transaction
- `type` type of transaction. If amount > 0 `type` is "Deposit" else `type` is "Withdraw"
- `date` date of transaction

<br />
If success will be return:

- Object transaction with `id`, `content`, `amount`, `type`, `date`

### Update transaction
```
curl -X PUT "http://localhost:8000/transaction/:id" -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d "{\"content\":\"ABC\", \"amount\":300, \"type\": \"Deposit\", \"date\": \"2022-03-18T20:54:11.396Z\"}"
```
#### Description 
- `:id` id of transaction want to update
- `content` can get this token after login
- `amount` is id of transaction
- `type` type of transaction. If amount > 0 `type` is "Deposit" else `type` is "Withdraw"
- `date` date of transaction

### Delete transaction
```
curl -X DELETE "http://localhost:8000/transaction/:id" -H "Content-Type: application/json" -H "Authorization: Bearer {token}"
```
#### Description 
- `:id` id of transaction want to update