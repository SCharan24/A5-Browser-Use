# A5 Python Server

This directory contains the Python server component of the A5 Browser Automation Tool (mainly main.py). The server handles requests from the Chrome extension (or your own web application) and executes browser automation commands using the Browser Use library.

## Structure

The server consists of the following key components:

- `main.py`: Main server application with OpenAI
- `mainGemini.py`: Main server application using Gemini
- `mainOllama.py`: Main server application using Ollama (you must run `ollama pull Qwen2.5-Coder:32B-Instruct-q4_K_M` for this to work and it requires about 20GB of harddrive space)
- `utils/`: Future: Utility functions and helpers
- `models/`: Future: Data models and database schemas
- `config/`: Future: Configuration files and environment variables

## Development

To set up the development environment:

1. Create a virtual environment
2. Install dependencies from requirements.txt
3. Configure environment variables
4. Run the server using Python

## API Endpoints


[GET] `/lastResponses` returns the browser-use responses from the end of sessions
[GET] or [POST] `/run` : Parameter: `task`. The `task` parameter is the string being passed to the intitial command for browser-use. 

## Example Request
```
$ curl -X POST \
  http://localhost:8888/run \
  -H "Content-Type: application/json" \
  -d '{"task": "Search for the latest news about artificial intelligence"}'
```