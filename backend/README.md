# Task Manager Backend

## Installation

To initialize the database use the following commands:
```bash
cd src/database
npx knex migrate:latest
```

To start the server, back in the root folder `backend`, run the command:
```bash
npm start
```

## REST API Routes

### `POST /todos`

This route adds an item to the to-do list.

The expected request body should contain a single JSON object with the following field:

- `description` – Description of the item (e.g., Buy milk at the store.).

The server attributes a unique identifier to the created item, sets the state to `INCOMPLETE` and stores the creation date.

The response is a JSON object, representing the created item, having the following fields:

- `id` – Unique identifier of the list item (e.g., 56).
- `state` – State of the item (`INCOMPLETE`).
- `description` – Description of the item (e.g., Buy milk at the store.).
- `createdAt` – Creation date of the item (e.g., 2021-05-12T07:23:45.678Z)
- `completedAt` – Completion date of the item (`null`).

### `GET /todos?filter=<STATE>&orderBy=<FIELD>`

This route lists the to-do items considering the conditions imposed on the query parameters:

- The filter query parameter is optional and can be `ALL`, `COMPLETE`, or `INCOMPLETE`. If not specified, the default filter is `ALL`.
- The orderBy query parameter is also optional and can be `DESCRIPTION`, `CREATED_AT`, or `COMPLETED_AT`. If not specified, the default order is `CREATED_AT`.

The response is a JSON array of objects, where each object has the following fields:

- `id` – Unique identifier of the list item (e.g., 56).
- `state` – State of the item (`INCOMPLETE`).
- `description` – Description of the item (e.g., Buy milk at the store.).
- `createdAt` – Creation date of the item (e.g., 2021-05-12T07:23:45.678Z)
- `completedAt` – Completion date of the item (e.g., 2021-05-13T11:23:45.678Z).

### `PATCH /todo/{id}`

This route edits an item on the to-do list. The item will be referenced by id using the URL parameter `id`.

The expected request body should contain a single JSON object with a combination of the
following fields:

- `state` - State of the item (i.e., `COMPLETE`).
- `description` - Description of the item (e.g., Buy milk at the store.).

Both fields are optional, but at least one must be present.

If the item does not exist, the server returns an `HTTP 404` error.

If the description is being modified and the item state is COMPLETE, the server returns an `HTTP 400` error.

The response is a JSON object, representing the edited item, having the following fields:

- `id` – Unique identifier of the list item (e.g., 56).
- `state` – State of the item (i.e., `COMPLETE` or `INCOMPLETE`).
- `description` – Description of the item (e.g., Buy milk at the store.).
- `createdAt` – Creation date of the item (e.g., 2021-05-12T07:23:45.678Z)
- `completedAt` – Completion date of the item (e.g., 2021-05-13T11:23:45.678Z).

### `DELETE /todo/{id`

This route removes an item from the to-do list. The item will be referenced by id using the URL
parameter `id`.

If the item does not exist, the server returns an `HTTP 404` error.

This route returns an empty response if it succeeds.