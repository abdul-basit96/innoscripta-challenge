## Setup

1. Clone the repository.
2. Place following credientials in `.env` file:
   - `CLIENT_ID`
   - `CLIENT_SECRET`
3. Build and run the Docker containers:
   ```sh
   docker-compose up --build
   ```

## Usage

1. Access the API at `http://localhost:3000`.
2. Use 'login with outlook' link to login with outlook account.
3. After successful login, email synchronization will start. 
4. Access the real-time email synchronization at `http://localhost:3000`.
