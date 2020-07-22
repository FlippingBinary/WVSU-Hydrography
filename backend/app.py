from flask import Flask, request, jsonify
from cmr import CollectionQuery, GranuleQuery
import urllib
import pygrib
import numpy as np
from datetime import timedelta
from dateutil.parser import parse
import re
import os
import glob
from pathlib import Path

# Create the global web app
app = Flask(__name__)

# Set the bounding box of West Virginia in GPS coordinates
max_wv_lat = 40.638801
min_wv_lat = 37.201483
max_wv_lon = -77.719519
min_wv_lon = -82.644739

# Set the username and password from the environment
username = os.getenv('USERNAME')
password = os.getenv('PASSWORD')

# Create handlers for downloading files
if username is not None and password is not None:
  redirectHandler = urllib.request.HTTPRedirectHandler()
  cookieProcessor = urllib.request.HTTPCookieProcessor()
  passwordManager = urllib.request.HTTPPasswordMgrWithDefaultRealm()
  passwordManager.add_password(None, "https://urs.earthdata.nasa.gov", username, password)
  authHandler = urllib.request.HTTPBasicAuthHandler(passwordManager)
  opener = urllib.request.build_opener(redirectHandler,cookieProcessor,authHandler)
  urllib.request.install_opener(opener)

# Define the root route.
@app.route("/")
def root():
  cache = [f for f in glob.glob('./cache/NLDAS_*.002.grb')]
  print(cache)
  return jsonify(cache)
#  print('ERROR: Expected /evaporation or /precipitation, not /')
#  return '{error:"Expected /evaporation or /precipitation, not /"}'

# Define the evaporation route.
# This POST method should return the amount of evaporation for the timerange specified.
@app.route('/evaporation', methods=['POST'])
def evaporation():
  # Pull the start/end dates from the form variables
  start_date = parse(request.form['start_date'])
  end_date = parse(request.form['end_date']) - timedelta(minutes=1)
  # Print the variables to the console (view in Docker Dashboard)
  print('Request received for range: {} to {}'.format(start_date,end_date))
  # Create a evaporation dictionary to hold the data
  evaporation = {}
  count = 0
  evaporation['average'] = 0
  evaporation['history'] = []

  api = GranuleQuery()
  granules = api.short_name("NLDAS_FORA0125_H") \
      .temporal(start_date, end_date) \
      .get()

  # Make sure the granules cache directory exists
  Path('./cache').mkdir(parents=True, exist_ok=True)

  # Loop through the granules from CMR
  for granule in granules:
    # Get the URL of the granule
    url = granule["links"][0]["href"]
    # Create the filename of the granule by combining NLDAS with the id
    filename = Path('./cache/') / granule["producer_granule_id"]
    # Test if the file already exists
    if Path(filename).is_file():
      print('Pulling from cache: {}'.format(filename))
    elif username is not None and password is not None:
      # Announce filename for diagnostic purposes (goes to Docker Dashboard)
      print('Downloading {}'.format(filename))
      # Create the file and open it
      with urllib.request.urlopen(url) as response, open(filename, 'wb') as file:
        # read in contents of downloaded file
        data = response.read()
        # Write the contents to the local file
        file.write(data)
    else:
      print('ERROR: Set environment variables USERNAME/PASSWORD for NLDAS2 download or prebuild cache')
      return '{error:"Set environment variables USERNAME/PASSWORD for NLDAS2 download or prebuild cache"}'

    # Open the file with pyGRIB
    grbs = pygrib.open(str(filename))
    # Select parameter 228 (potential evaporation)
    grb = grbs.select(parameterName='228')[0]
    # Identify the indexes corresponding to the edges of the WV bounding box
    x1 = np.searchsorted(grb.distinctLongitudes, min_wv_lon)
    y1 = np.searchsorted(grb.distinctLatitudes, min_wv_lat)
    x2 = np.searchsorted(grb.distinctLongitudes, max_wv_lon, side='right')
    y2 = np.searchsorted(grb.distinctLatitudes, max_wv_lat, side='right')
    # Print those indexes for diagnostic purposes
    print("Latitude range:  {} - {}".format(grb.distinctLatitudes[y1], grb.distinctLatitudes[y2]))
    print("Longitude range: {} - {}".format(grb.distinctLongitudes[x1], grb.distinctLongitudes[x2]))
    # Pull the numpy subset of values inside the bounding box
    data = grb.values[y1:y2, x1:x2]
    # Calculate average using numpy (speed boost!)
    avg = np.average(data)
    # Append this history event to the output variable
    evaporation['history'].append({
      'date': grb.dataDate,
      'time': grb.dataTime,
      'value': avg
    })
    # Add average the variable
    evaporation['average'] += float(avg)
    # Increase count for later division
    count += 1

  # Divide 'average' by number of granules to produce real average
  if count > 0:
    evaporation['average'] /= count
  
  # Return data in JSON format
  return jsonify(evaporation)

# Define the precipitation route.
# This POST method should return the amount of precipitation for the timerange specified.
@app.route('/precipitation', methods=['POST'])
def precipitation():
  # Pull the start/end dates from the form variables
  start_date = parse(request.form['start_date'])
  end_date = parse(request.form['end_date']) - timedelta(minutes=1)
  # Print the variables to the console (view in Docker Dashboard)
  print('Request received for range: {} to {}'.format(start_date,end_date))
  # Create a precipitation dictionary to hold the data
  precipitation = {}
  count = 0
  precipitation['average'] = 0
  precipitation['history'] = []

  api = GranuleQuery()
  granules = api.short_name("NLDAS_FORA0125_H") \
      .temporal(start_date, end_date) \
      .get()

  # Make sure the granules cache directory exists
  Path('./cache').mkdir(parents=True, exist_ok=True)

  # Loop through the granules from CMR
  for granule in granules:
    # Get the URL of the granule
    url = granule["links"][0]["href"]
    # Create the filename of the granule by combining NLDAS with the id
    filename = Path('./cache/') / granule["producer_granule_id"]
    # Test if the file already exists
    if Path(filename).is_file():
      print('Pulling from cache: {}'.format(filename))
    elif username is not None and password is not None:
      # Announce filename for diagnostic purposes (goes to Docker Dashboard)
      print('Downloading {}'.format(filename))
      # Create the file and open it
      with urllib.request.urlopen(url) as response, open(filename, 'wb') as file:
        # read in contents of downloaded file
        data = response.read()
        # Write the contents to the local file
        file.write(data)
    else:
      print('ERROR: Set environment variables USERNAME/PASSWORD for NLDAS2 download or prebuild cache')
      return '{error:"Set environment variables USERNAME/PASSWORD for NLDAS2 download or prebuild cache"}'

    # Open the file with pyGRIB
    grbs = pygrib.open(str(filename))
    # Select parameter 61 (precipitation hourly total)
    grb = grbs.select(parameterName='61')[0]
    # Identify the indexes corresponding to the edges of the WV bounding box
    x1 = np.searchsorted(grb.distinctLongitudes, min_wv_lon)
    y1 = np.searchsorted(grb.distinctLatitudes, min_wv_lat)
    x2 = np.searchsorted(grb.distinctLongitudes, max_wv_lon, side='right')
    y2 = np.searchsorted(grb.distinctLatitudes, max_wv_lat, side='right')
    # Print those indexes for diagnostic purposes
    print("Latitude range:  {} - {}".format(grb.distinctLatitudes[y1], grb.distinctLatitudes[y2]))
    print("Longitude range: {} - {}".format(grb.distinctLongitudes[x1], grb.distinctLongitudes[x2]))
    # Pull the numpy subset of values inside the bounding box
    data = grb.values[y1:y2, x1:x2]
    # Calculate average using numpy (speed boost!)
    avg = np.average(data)
    # Append this history event to the output variable
    precipitation['history'].append({
      'date': grb.dataDate,
      'time': grb.dataTime,
      'value': avg
    })
    # Add average the variable
    precipitation['average'] += float(avg)
    # Increase count for later division
    count += 1

  # Divide 'average' by number of granules to produce real average
  if count > 0:
    precipitation['average'] /= count
  
  # Return data in JSON format
  return jsonify(precipitation)

if __name__ == '__main__':
  app.run(host='0.0.0.0')
