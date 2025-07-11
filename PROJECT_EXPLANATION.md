# Project Explanation: Scout Music Management App

This document provides an overview of the Scout Music Management application, detailing its structure, backend and frontend components, and how they connect.

## 1. Project Structure

The project is organized into two main parts:

*   **`scout_backend/`**: Contains the Django REST Framework API.
    *   `scout_backend/` (inner project directory): Contains project-level settings (`settings.py`), URL configurations (`urls.py`), etc.
    *   `scout_content/`: The Django app handling the music content.
        *   `models.py`: Defines the `Music` database model.
        *   `serializers.py`: Defines the `MusicSerializer` for data conversion.
        *   `views.py`: Contains the `MusicViewSet` for API logic.
        *   `urls.py`: App-specific API URL routing.
        *   `migrations/`: Database migration files.
    *   `manage.py`: Django's command-line utility.
    *   `requirements.txt`: Python dependencies.
    *   `db.sqlite3`: SQLite database file (for local development).
    *   `media/`: Directory where uploaded audio files are stored locally during development.
*   **`scout-frontend/`**: Contains the Next.js/React frontend application.
    *   `src/app/`: Core application files for the Next.js App Router.
        *   `page.js`: The main entry point/homepage of the application.
        *   `layout.js`: The main layout for pages.
        *   `globals.css`: Global CSS styles, including Tailwind CSS directives.
        *   `MusicListPage.js`: Component for displaying, filtering, and managing music entries.
        *   `music_form.js`: Component for the music creation and editing form.
    *   `public/`: Static assets.
    *   `package.json`: Node.js project metadata and dependencies.
    *   `tailwind.config.js`: Configuration for Tailwind CSS.
    *   `postcss.config.js`: Configuration for PostCSS (used by Tailwind CSS).

## 2. Backend (Django REST Framework)

The backend is responsible for providing a RESTful API for managing music entries.

### 2.1. `Music` Model (`scout_content/models.py`)

The `Music` model defines the structure of a music entry in the database:
*   `title` (CharField): The title of the music piece.
*   `type` (CharField): Type of music (e.g., 'SONG', 'CHANT', 'CLAP'), with choices.
*   `lyrics` (TextField): Full lyrics (optional).
*   `category` (CharField): Category (e.g., 'CAMPFIRE', 'MARCHING'), with choices (optional).
*   `difficulty` (IntegerField): Difficulty level (1: Easy, 2: Medium, 3: Hard), with choices (optional).
*   `author` (ForeignKey to User): The user who authored/added the entry (optional).
*   `created_at` (DateTimeField): Timestamp of creation (auto-set).
*   `last_updated` (DateTimeField): Timestamp of last update (auto-set).
*   `audio_file` (FileField): The uploaded audio file (optional). Uses a custom `get_upload_path` function to organize files by type and title.

### 2.2. `MusicSerializer` (`scout_content/serializers.py`)

The `MusicSerializer` converts `Music` model instances to JSON (for API responses) and validates/converts JSON data to model instances (for creating/updating entries).
*   Includes all fields from the `Music` model.
*   Provides read-only `*_display` fields (e.g., `type_display`) to get human-readable versions of choice fields.
*   The `author` field is read-only (meant to be set by the system, not direct API input).
*   Includes basic validation for `audio_file` to check for audio content types.

### 2.3. `MusicViewSet` (`scout_content/views.py`)

The `MusicViewSet` (a `ModelViewSet`) provides the core API logic for CRUD (Create, Read, Update, Delete) operations:
*   Uses `Music.objects.all()` as the base queryset.
*   Uses `MusicSerializer` for data serialization.
*   **Filtering:** Integrates `DjangoFilterBackend` to allow filtering by `type`, `category`, and `difficulty` via query parameters (e.g., `/api/music/?type=SONG`).
*   **Searching:** Integrates `filters.SearchFilter` to allow searching across `title` and `lyrics` fields via a `search` query parameter (e.g., `/api/music/?search=campfire_song`).
*   **Ordering:** Integrates `filters.OrderingFilter` to allow sorting by various fields. Default ordering is by `title`.
*   Standard actions like `list` (GET all), `create` (POST), `retrieve` (GET one), `update` (PUT), `partial_update` (PATCH), and `destroy` (DELETE) are automatically handled.

### 2.4. API URL Routing

*   **`scout_backend/scout_content/urls.py`**: A `DefaultRouter` is used to register the `MusicViewSet`, automatically generating URLs for all standard actions under the `/music/` path.
*   **`scout_backend/urls.py`**: The `scout_content.urls` are included under the main `/api/` path. So, the final API endpoint for music is `/api/music/`.

### 2.5. CORS and Media Files (`scout_backend/settings.py`)

*   **CORS (Cross-Origin Resource Sharing):** `django-cors-headers` is configured to allow requests from the frontend development server (e.g., `http://localhost:3000`). `corsheaders` is added to `INSTALLED_APPS` and `corsheaders.middleware.CorsMiddleware` to `MIDDLEWARE`.
*   **Media Files:** `MEDIA_URL = '/media/'` and `MEDIA_ROOT = BASE_DIR / 'media'` are set to handle file uploads. During development (`DEBUG=True`), `urls.py` is configured to serve these media files.

## 3. Frontend (Next.js & React)

The frontend provides the user interface to interact with the music API.

### 3.1. `MusicListPage.js` (`src/app/MusicListPage.js`)

This is the main component for viewing and interacting with music entries.
*   **Data Fetching:** Uses `useEffect` and `axios` to fetch music items from `/api/music/` when the component mounts or when filter/search parameters change.
*   **Display:** Renders music items as cards in a grid. Each card shows title, type, category, difficulty, a snippet of lyrics, and an HTML5 audio player if an `audio_file` URL is present.
*   **Add/Edit Functionality:**
    *   An "Add New Music" button toggles the visibility of the `MusicForm` for creating new entries.
    *   Each music item has an "Edit" button that opens the `MusicForm`, pre-filled with that item's data.
*   **Delete Functionality:** Each item has a "Delete" button that, after user confirmation, sends a `DELETE` request to the API and updates the UI.
*   **Search and Filtering:**
    *   Provides a search input (for title/lyrics) and dropdowns to filter by type, category, and difficulty.
    *   Changes to these inputs trigger a re-fetch of the music list with appropriate query parameters.
*   **State Management:** Uses `useState` for music items, loading/error states, form visibility, editing state, and filter values.
*   **Error Handling:** Displays messages for loading errors or delete operation failures.

### 3.2. `MusicForm.js` (`src/app/music_form.js`)

This component is a form for creating and editing music entries.
*   **Fields:** Includes inputs for title, lyrics, and select dropdowns for type, category, and difficulty, plus a file input for the audio file.
*   **Modes:** Handles both "add" and "edit" modes. In edit mode, it's pre-filled with the data of the item being edited.
*   **Submission:**
    *   On submit, it constructs a `FormData` object (to support file uploads).
    *   Sends a `POST` request to `/api/music/` for new entries or a `PUT` request to `/api/music/<id>/` for updates.
    *   Includes an `Authorization` header if a JWT token is found in `localStorage`.
*   **Validation & Error Handling:** Displays validation errors received from the backend next to the respective fields or as a general message at the top of the form. Input fields are highlighted on error.
*   **Callbacks:** Uses `onFormSubmit` (after successful submission) and `onCancel` (to close the form) props.

### 3.3. `page.js` (`src/app/page.js`)

This is the main homepage for the Next.js application.
*   It renders the `MusicListPage` component as its primary content.
*   Includes a simple header with the application title ("Scout Music Manager") and a basic footer.

## 4. Connection: Frontend & Backend

*   The frontend (Next.js) communicates with the backend (Django) via HTTP requests using the `axios` library.
*   **API Endpoint:** The frontend is configured to make API calls to `http://localhost:8000/api`.
    *   Listing/Filtering/Searching: `GET /api/music/` (with optional query parameters like `?search=...&type=...`)
    *   Creating: `POST /api/music/`
    *   Updating: `PUT /api/music/{id}/`
    *   Deleting: `DELETE /api/music/{id}/`
*   **Data Format:** Data is exchanged primarily in JSON format. For requests involving file uploads (create/edit music with audio), `FormData` (multipart/form-data) is used.
*   **CORS:** The Django backend's CORS configuration allows the frontend (running on `http://localhost:3000` during development) to make these cross-origin requests.
*   **Authentication (Basic Setup):** The frontend attempts to read a JWT token from `localStorage` and includes it in the `Authorization: Bearer <token>` header for relevant API requests. The backend's API views would need appropriate permission classes (e.g., `IsAuthenticatedOrReadOnly`) to enforce authentication for write operations.

## 5. Key Development Steps Followed

1.  **Backend Setup:**
    *   Defined Django model (`Music`).
    *   Installed Django REST Framework, filters, CORS.
    *   Created Serializer (`MusicSerializer`).
    *   Created API ViewSet (`MusicViewSet`) with CRUD, search, and filter capabilities.
    *   Configured URLs.
    *   Set up CORS and media file handling.
    *   Ran database migrations.
2.  **Frontend Setup & Core UI:**
    *   Updated `MusicForm` (from an existing `ChantForm`) to include all fields, handle create/update logic with `FormData` for file uploads, and connect to the new API endpoints.
    *   Created `MusicListPage` to fetch and display music items, integrate the `MusicForm` for add/edit operations.
    *   Implemented delete functionality in `MusicListPage`.
    *   Added search and filter UI and logic to `MusicListPage`.
    *   Styled components using Tailwind CSS.
    *   Integrated `MusicListPage` into the main `page.js`.
3.  **Refinement:**
    *   Conducted a mental end-to-end test/walkthrough.
    *   Improved error handling in `MusicForm` to display backend validation errors more clearly.
    *   Reviewed code for cleanup.

This provides a comprehensive, though high-level, overview of how the application was built and how its parts are interconnected.
