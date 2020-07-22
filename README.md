# WVSU-Hydrography

## Getting started

Clone this repository and create a directory inside it called `secrets` for your NLDAS2 credentials.

Inside that folder, create a file called `nldas-username` and put your username in it.
Make sure you don't end that file with a line ending. Use a text editor that shows you line numbers if you need to.
There should only be one single line in that file. If you have a bash terminal, you might try something like this:

    echo "my.username" > ./secrets/nldas-username

Now create a file called `nldas-password` inside that same folder. Put your NLDAS2 password using the same technique.

    echo "my.password" > ./secrets/nldas-password

These credentials will be used by the backend docker container to pull GRIB files directly from NASA when you access them through the frontend. After creating your credential files, start the docker project with the standard command:

    docker-compose up -d

This will create three docker containers and puts them in the background:
1. The first container runs nginx as a proxy in front of the backend and frontend. It listens on port 8080.
2. The second runs the project inside the `frontend` folder which is a Next.js web app.
3. The third runs the project inside the `backend` folder. That is a Python project which pulls GRIB files on demand and produces data for the frontend.
