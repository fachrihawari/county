# county

County is a simple counter service that allows you to increment and retrieve counts for a given namespace and key.

## Features

- Increment a count for a given namespace and key.
- Retrieve the current count for a given namespace and key.

## How to Run

```bash
bun install
```

To run:

```bash
bun dev
```


## API Documentation

### Deployed API

The API is deployed at https://county.hawari.dev.

### GET /api/count

Retrieve the current count for a given namespace and key.

#### Query Parameters
- `namespace` (string, required): The namespace of the counter.
- `key` (string, required): The key of the counter.

#### Responses
- **200 OK**
  ```json
  {
    "count": number
  }
  ```
- **400 Bad Request**
  - Missing `namespace`
    ```json
    {
      "message": "namespace parameter is required"
    }
    ```
  - Missing `key`
    ```json
    {
      "message": "key parameter is required"
    }
    ```

### POST /api/count/up

Increment the count for a given namespace and key. If the counter does not exist, it will be created with an initial value of 1.

#### Query Parameters
- `namespace` (string, required): The namespace of the counter.
- `key` (string, required): The key of the counter.

#### Responses
- **200 OK**
  ```json
  "OK"
  ```
- **400 Bad Request**
  - Missing `namespace`
    ```json
    {
      "message": "namespace parameter is required"
    }
    ```
  - Missing `key`
    ```json
    {
      "message": "key parameter is required"
    }
    ```

### Error Responses

- **404 Not Found**
  ```json
  {
    "message": "Not Found"
  }
  ```
