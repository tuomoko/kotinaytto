import urllib.request
import xml.etree.ElementTree as ET
import re
import json

def parse_xml(url):
    with urllib.request.urlopen(url) as response:
        html = response.read()


    root = ET.fromstring(html)

    # Need to take the namespace from the XML
    ns = re.match(r'{.*}', root.tag).group(0)

    series = list()
    for el in root.findall(f"{ns}TimeSeries"):
        print('-------------------')
        period = el.find(f"{ns}Period")
        timeInterval = period.find(f"{ns}timeInterval")
        start = timeInterval.find(f"{ns}start").text
        end = timeInterval.find(f"{ns}end").text
        points = []
        for point in period.findall(f"{ns}Point"):
            position = point.find(f"{ns}position").text
            price = point.find(f"{ns}price.amount").text
            points.append({"Position": position, "Price": price})
        series.append({"Start": start, "End": end, "Points": points})
    #    for ch in period.getchildren():
    #        print('{:>15}: {:<30}'.format(ch.tag, ch.text))

    return series