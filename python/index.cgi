#!/usr/bin/python3

# Generic Python modules
import cgi
import datetime
import dateutil.tz
import json

# Mappings file copied directly from https://github.com/EnergieID/entsoe-py
from mappings import Area, lookup_area
# Local imports
import parse_xml
import config

# The following is only for debugging!!!
# import cgitb
# cgitb.enable()

print("Content-Type: application/json")
print("")

# These are the GET arguments
arguments = cgi.FieldStorage()

# Do the argument handling
if 'date' in arguments.keys():
        try:
                date = datetime.datetime.strptime(arguments['date'].value,'%Y-%m-%d').date()
        except ValueError:
                date = datetime.date.today()
else:
        date = datetime.date.today()

if 'domain' in arguments.keys():
        domain = arguments['domain'].value
else:
        domain = "FI"

# Get area code and time zone based on the country code
area = lookup_area(domain)
tz = dateutil.tz.gettz(area.tz)

# Select the hours of the requested date as UTC and convert to correct format
periodStart = datetime.datetime.combine(date, datetime.time(00, 00), tzinfo=tz)
periodStart = periodStart.astimezone(datetime.timezone.utc).strftime("%Y%m%d%H%M")
periodEnd = datetime.datetime.combine(date, datetime.time(23, 00), tzinfo=tz)
periodEnd = periodEnd.astimezone(datetime.timezone.utc).strftime("%Y%m%d%H%M")

# Get the data
url = "https://transparency.entsoe.eu/api?documentType=A44&in_Domain={}&out_Domain={}&periodStart={}&periodEnd={}&securityToken={}".format(area.code, area.code, periodStart, periodEnd, config.SECURITY_TOKEN)
series = parse_xml.parse_xml(url)
print(json.dumps(series))
