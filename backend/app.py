from cmr import CollectionQuery, GranuleQuery
from urllib import request
import pygrib
import numpy as np
#from datetime import timedelta, fromtimestamp
import datetime
#from dateutil.parser import parse
#import re
#import os
#import glob
from pathlib import Path
import json
print('hello', flush=True)

# Set the bounding box of West Virginia in GPS coordinates
max_wv_lat = 40.638801
min_wv_lat = 37.201483
max_wv_lon = -77.719519
min_wv_lon = -82.644739

# Get username and password from secrets file
with open('/run/secrets/nldas-username', 'r') as file:
  username = file.read().replace('\n', '')
with open('/run/secrets/nldas-password', 'r') as file:
  password = file.read().replace('\n', '')

# Create handlers for downloading files
if username is not None and password is not None:
  redirectHandler = request.HTTPRedirectHandler()
  cookieProcessor = request.HTTPCookieProcessor()
  passwordManager = request.HTTPPasswordMgrWithDefaultRealm()
  passwordManager.add_password(None, "https://urs.earthdata.nasa.gov", username, password)
  authHandler = request.HTTPBasicAuthHandler(passwordManager)
  opener = request.build_opener(redirectHandler,cookieProcessor,authHandler)
  request.install_opener(opener)

# Define the evaporation route.
def handleEvaporation(task):
  print('Inside Evaporation request', flush=True)
#  # Pull the start/end dates from the form variables
#  start_date = parse(t.start_date)
#  end_date = parse(t.end_date) - datetime.timedelta(minutes=1)
#  # Print the variables to the console (view in Docker Dashboard)
#  print('Request received for range: {} to {}'.format(start_date,end_date))
#  # Create a evaporation dictionary to hold the data
#  evaporation = {}
#  count = 0
#  evaporation['average'] = 0
#  evaporation['history'] = []
#
#  api = GranuleQuery()
#  granules = api.short_name("NLDAS_FORA0125_H") \
#      .temporal(start_date, end_date) \
#      .get()
#
#  # Make sure the granules cache directory exists
#  Path('./cache').mkdir(parents=True, exist_ok=True)
#
#  # Loop through the granules from CMR
#  for granule in granules:
#    # Get the URL of the granule
#    url = granule["links"][0]["href"]
#    # Create the filename of the granule by combining NLDAS with the id
#    filename = Path('./cache/') / granule["producer_granule_id"]
#    # Test if the file already exists
#    if Path(filename).is_file():
#      print('Pulling from cache: {}'.format(filename))
#    elif username is not None and password is not None:
#      # Announce filename for diagnostic purposes (goes to Docker Dashboard)
#      print('Downloading {}'.format(filename))
#      # Create the file and open it
#      with request.urlopen(url) as response, open(filename, 'wb') as file:
#        # read in contents of downloaded file
#        data = response.read()
#        # Write the contents to the local file
#        file.write(data)
#    else:
#      print('ERROR: Set environment variables USERNAME/PASSWORD for NLDAS2 download or prebuild cache')
#      return '{error:"Set environment variables USERNAME/PASSWORD for NLDAS2 download or prebuild cache"}'
#
#    # Open the file with pyGRIB
#    grbs = pygrib.open(str(filename))
#    # Select parameter 228 (potential evaporation)
#    grb = grbs.select(parameterName='228')[0]
#    # Identify the indexes corresponding to the edges of the WV bounding box
#    x1 = np.searchsorted(grb.distinctLongitudes, min_wv_lon)
#    y1 = np.searchsorted(grb.distinctLatitudes, min_wv_lat)
#    x2 = np.searchsorted(grb.distinctLongitudes, max_wv_lon, side='right')
#    y2 = np.searchsorted(grb.distinctLatitudes, max_wv_lat, side='right')
#    # Print those indexes for diagnostic purposes
#    print("Latitude range:  {} - {}".format(grb.distinctLatitudes[y1], grb.distinctLatitudes[y2]))
#    print("Longitude range: {} - {}".format(grb.distinctLongitudes[x1], grb.distinctLongitudes[x2]))
#    # Pull the numpy subset of values inside the bounding box
#    data = grb.values[y1:y2, x1:x2]
#    # Calculate average using numpy (speed boost!)
#    avg = np.average(data)
#    # Append this history event to the output variable
#    evaporation['history'].append({
#      'date': grb.dataDate,
#      'time': grb.dataTime,
#      'value': avg
#    })
#    # Add average the variable
#    evaporation['average'] += float(avg)
#    # Increase count for later division
#    count += 1
#
#  # Divide 'average' by number of granules to produce real average
#  if count > 0:
#    evaporation['average'] /= count
#  
#  # Return data in JSON format
#  return jsonify(evaporation)

# Define the evaporation route.
def handleEvaporation(r, t):
  print('Inside Evaporation request', flush=True)
  try:
    # Pull the start/end dates from the form variables
    start_date = datetime.datetime.fromtimestamp(t['start_date'])
    end_date = datetime.datetime.fromtimestamp(t['end_date'])
    # Print the variables to the console (view in Docker Dashboard)
    print('Request received for range: {} to {}'.format(start_date,end_date))
    key = 'evaporation-{}-{}'.format(int(start_date.timestamp()),int(end_date.timestamp()))
    # Check if work has already been done
    result = r.get(key)
    print('Result is {}'.format(type(result)), flush=True)
    if ( result is not None ):
      print('Already did job {}'.format(key), flush=True)
      return
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
        with request.urlopen(url) as response, open(filename, 'wb') as file:
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
      print("Latitude range:  {} - {}".format(grb.distinctLatitudes[y1], grb.distinctLatitudes[y2]), flush=True)
      print("Longitude range: {} - {}".format(grb.distinctLongitudes[x1], grb.distinctLongitudes[x2]), flush=True)
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
    r.set(key,json.dumps(evaporation))
#    print(json.dumps(evaporation, indent=2), flush=True)
  except Exception as e:
    print('A daggone exception occurred')
    print(e)
  except:
    print('A daggone exceptional exception occurred')

# Define the precipitation route.
def handlePrecipitation(r, t):
  print('Inside Precipitation request', flush=True)
  try:
    # Pull the start/end dates from the form variables
    start_date = datetime.datetime.fromtimestamp(t['start_date'])
    end_date = datetime.datetime.fromtimestamp(t['end_date'])
    # Print the variables to the console (view in Docker Dashboard)
    print('Request received for range: {} to {}'.format(start_date,end_date))
    key = 'precipitation-{}-{}'.format(int(start_date.timestamp()),int(end_date.timestamp()))
    # Check if work has already been done
    result = r.get(key)
    print('Result is {}'.format(type(result)), flush=True)
    if ( result is not None ):
      print('Already did job {}'.format(key), flush=True)
      return
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
        with request.urlopen(url) as response, open(filename, 'wb') as file:
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
      print("Latitude range:  {} - {}".format(grb.distinctLatitudes[y1], grb.distinctLatitudes[y2]), flush=True)
      print("Longitude range: {} - {}".format(grb.distinctLongitudes[x1], grb.distinctLongitudes[x2]), flush=True)
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
    r.set(key,json.dumps(precipitation))
#    print(json.dumps(precipitation, indent=2), flush=True)
  except Exception as e:
    print('A daggone exception occurred')
    print(e)
  except:
    print('A daggone exceptional exception occurred')

if __name__ == '__main__':
  import time
  import redis
  r = redis.Redis(host='redis', port=6379)

  print('Entering main loop...', flush=True)
  while True:
    time.sleep(1)
    print('Waiting for task...', flush=True)
    # Pause until there is a string to pop off the queue
    _, taskString = r.brpop('queue')
#    try:
    print('Processing {}'.format(taskString), flush=True)
    # Convert string to JSON representation of task
    task = json.loads(taskString.decode('utf8'))
    # Pass task off to handler
    if task['type'] == 'evaporation':
      handleEvaporation(r, task)
    elif task['type'] == 'precipitation':
      handlePrecipitation(r, task)
    else:
      print('Unknown type: {}'.format(task['type']))
#    except:
#      print('Failed to process {} task: {}'.format(type(taskString), taskString))
