#!/usr/bin/python3

# Generic Python modules
import cgi
import datetime
import dateutil.tz
import dateutil.parser
import json

# Mappings file copied directly from https://github.com/EnergieID/entsoe-py
from mappings import Area, lookup_area
# Local imports
import parse_xml
import config

DEFAULT_START_TIME = datetime.datetime.utcnow()
DEFAULT_HOURS = 6
DEFAULT_COUNTRY = "FI"

# The following is only for debugging!!!
# import cgitb
# cgitb.enable()

print("Content-Type: application/json")
print("Access-Control-Allow-Origin: http://localhost:3000")
print("")

# These are the GET arguments
arguments = cgi.FieldStorage()

# Do the argument handling
if 'start' in arguments.keys():
        try:
                start_time = dateutil.parser.isoparse(arguments['start'].value)
        except ValueError:
                start_time = DEFAULT_START_TIME
else:
        start_time = DEFAULT_START_TIME

if 'hours' in arguments.keys():
        try:
                hours = int(arguments['hours'].value)
        except ValueError:
                hours = DEFAULT_HOURS
else:
        hours = DEFAULT_HOURS

if 'country' in arguments.keys():
        country = arguments['country'].value
else:
        country = DEFAULT_COUNTRY

# Get area code and time zone based on the country code
try:
	area = lookup_area(country)
except IndexError:
	area = lookup_area(DEFAULT_COUNTRY)


# If no time zone information, assume the start time is in UTC
if start_time.tzinfo is None:
	start_time = start_time.replace(tzinfo=datetime.timezone.utc)

# Start from the beginning of the requested hour, and end requested number of hours later
periodStart = start_time.strftime("%Y%m%d%H00")
end_time = start_time + datetime.timedelta(hours=hours)
periodEnd = end_time.strftime("%Y%m%d%H00")

# Get the data
url = "https://transparency.entsoe.eu/api?documentType=A44&in_Domain={}&out_Domain={}&periodStart={}&periodEnd={}&securityToken={}".format(area.code, area.code, periodStart, periodEnd, config.SECURITY_TOKEN)
series = parse_xml.parse_xml(url)

# Find the requested start time and select the correct amount of hours after that
request_data = []
time_idx = 0
for timeserie in series:
	serie_start = dateutil.parser.isoparse(timeserie["Start"])
	serie_end = dateutil.parser.isoparse(timeserie["End"])
	# Timeseries where the data starts
	if serie_start <= start_time and serie_end >= start_time:
		time_idx = serie_start
		idx = 0
		# Find the first index
		while (time_idx + datetime.timedelta(hours=1)) <= start_time:
			time_idx = time_idx + datetime.timedelta(hours=1)
			idx = idx + 1
		while len(request_data) < hours:
			if idx < len(timeserie["Points"]):
				request_data.append(float(timeserie["Points"][idx]["Price"])/10)
				time_idx = time_idx + datetime.timedelta(hours=1)
				idx = idx + 1
			else:
				break
	# Timeseries where the data continues
	elif serie_start == time_idx:
		idx = 0
		while len(request_data) < hours:
                        if idx < len(timeserie["Points"]):
                                request_data.append(float(timeserie["Points"][idx]["Price"])/10)
                                idx = idx + 1
                        else:
                                break

# Spit out the data
print(json.dumps(request_data))

