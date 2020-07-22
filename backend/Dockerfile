# Created by Jon Musselwhite, JMusselwhite@wvstateu.edu

# You must set a username and password for NLDAS2 downloads by using environment variables
#  docker run -dp 5000:5000 --rm -e USERNAME='your username' -e PASSWORD 'your password' flippingbinary/flask-with-pyhspf

# If you want persistent storage, you'll also need to mount a directory to /home/flask/cache
# You can mount a folder named "cache" in the present directory with the Windows command below:
#  docker run -dp 5000:5000 --rm -e USERNAME='your username' -e PASSWORD 'your password' --mount src="$(pwd)/cache",target=/home/flask/cache,type=bind flippingbinary/flask-with-pyhspf
# The Linux/MacOS equivalent might look like this, but I haven't tested it (yet):
#  docker run -dp 5000:5000 --rm -e USERNAME='your username' -e PASSWORD 'your password' -v "$(pwd)/cache":/home/flask/cache flippingbinary/flask-with-pyhspf

# If you want to keep the container around to run automatically or something, remove the "--rm" argument.

# This image uses Ubuntu 18.04 because 20.04 conflicts right now.
FROM ubuntu:bionic

# This Dockerfile was written in conjunction with an HSPF-related research project at WVSU.
LABEL author="Jon Musselwhite <jmusselwhite@wvstateu.edu>"

# Set the default language to a very generic one.
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8

# Update the PATH to include the location where conda will be.
ENV PATH /opt/conda/bin:$PATH

# The tzdata package will be updated and requires the user to specify a timezone
# if it isn't already in the environment.
ENV TZ="America/New_York"

# Prevent apt-get from waiting for user input.
ENV DEBIAN_FRONTEND="noninteractive"

# Update the OS. Install dependencies. Cleanup after.
RUN apt-get update --fix-missing && apt-get install -y wget bzip2 ca-certificates \
    libglib2.0-0 libxext6 libsm6 libxrender1 libssl-dev libffi-dev \
    p7zip-full libgdal-dev libgdal20 libproj12 proj-bin libproj-dev proj-data build-essential gfortran unzip \
    && apt-get clean \
    && apt-get autoclean

# Pull miniconda straight from Anaconda and install it. Cleanup after.
RUN wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh \
    && /bin/bash ~/miniconda.sh -b -p /opt/conda \
    && rm ~/miniconda.sh \
    && ln -s /opt/conda/etc/profile.d/conda.sh /etc/profile.d/conda.sh

# Install Python libraries. Cleanup after.
RUN conda update --all \
    && conda install -c conda-forge gdal lxml matplotlib \
      numpy pillow pyshp scipy pyproj eccodes pygrib uwsgi python-dotenv -y --quiet \
    && conda clean --all

# Install the CMR API for Python which allows us to search NASA's data sources.
# Also install flask which allows us to create a web server.
RUN /opt/conda/bin/python -m pip install python-cmr flask

# Install pyHSPF from Github. Cleanup after.
RUN wget --quiet https://github.com/djlampert/PyHSPF/archive/master.zip -O ~/pyhspf.zip \
    && unzip -d ~/ ~/pyhspf.zip \
    && rm ~/pyhspf.zip \
    && cd ~/PyHSPF-master/src \
    && rm setup.cfg \
    && /opt/conda/bin/python setup.py build \
    && /opt/conda/bin/python setup.py install \
    && rm -R ~/PyHSPF-master

# Add an unprivileged user to ultimately use.
RUN useradd --create-home --home-dir /home/flask --shell /bin/bash flask \
    && echo ". /opt/conda/etc/profile.d/conda.sh" >> /home/flask/.bashrc\
    && echo "conda activate base" >> /home/flask/.bashrc \
    && su -c "conda init bash" - flask

# Switch to the unprivileged user.
USER flask

# Set default directory to unprivileged user's home.
WORKDIR /home/flask

# Copy files into container.
COPY . /home/flask/

# Announce port 8888 to be exposed.
EXPOSE 5000

# Set default startup command.
CMD uwsgi --enable-threads --socket 0.0.0.0:5000 --protocol=http -w wsgi:app
