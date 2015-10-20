import csv
import json
import requests
from lxml import etree
from lxml import objectify
from io import StringIO, BytesIO

def get_station_data(name):
    url = "http://catalog.fmi.fi/geonetwork/srv/csw"
    params = {
        "service": "CSW",
        "version": "2.0.2",
        "request": "GetRecords",
        "resultType": "results",
        "outputSchema": "http://www.isotc211.org/2005/gmd",
        "NAMESPACE": "xmlns(gmd=http://www.isotc211.org/2005/gmd)",
        "typeNames": "gmd:MD_Metadata",
        "elementSetName": "full",
        "startPosition": 1,
        "maxRecords": 10,
        "CONSTRAINTLANGUAGE": "CQL_TEXT",
        "CONSTRAINT": "AnyText = '" + name + "'",
        "CONSTRAINT_LANGUAGE_VERSION": "1.1.0"
    }
    req = requests.get(url, params=params)
    return req.content

def get_grand_parent(element, amount):

    el = element
    for i in range(0, amount):
        el = el.getparent()

    return el

def print_children(element, indentation=0):
    for child in element:
        print("  "*indentation, child.tag, " : ", child.text)
        indentation += 1
        print_children(child, indentation)


def parse_station_data(documentstr):
    ns = {
        "csw": "http://www.opengis.net/cat/csw/2.0.2",
        "gmd": "http://www.isotc211.org/2005/gmd",
        "gco": "http://www.isotc211.org/2005/gco",
        "gml": "http://www.opengis.net/gml"
    }

    parser = etree.XMLParser(recover=True)
    xml = etree.fromstring(documentstr, parser)
    beginPosElements = xml.findall(".//{" + ns["gml"] + "}beginPosition")
    #print_children(get_grand_parent(beginPosElements[0], 8))
    datasets = []
    for el in beginPosElements:

        datatitle = el.xpath("../../../../../../../gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString", namespaces=ns)[0].text
        abstract = el.xpath("../../../../../../../gmd:abstract/gco:CharacterString", namespaces=ns)[0].text
        interval = el.xpath("../../../../../../../gmd:resourceMaintenance/gmd:MD_MaintenanceInformation/gmd:updateScopeDescription/gmd:MD_ScopeDescription/gmd:dataset/gco:CharacterString", namespaces=ns)[0].text
        dataBegin = el.text
        dataEnd = el.xpath("../gml:endPosition", namespaces=ns)[0].text

        datasets.append({
            "title": datatitle,
            "abstract": abstract,
            "interval": interval,
            "begin": dataBegin,
            "end": dataEnd
        })

    return datasets

    #root = objectify.fromstring(documentstr, parser)
    #print([ el.tag for el in root.iterchildren(tag=ns["csw"] + 'SearchResults')])
    #print(etree.tostring(xml, pretty_print=True))


# read the basic data of stations which was manually gotten from
# http://ilmatieteenlaitos.fi/havaintoasemat
with open("stations.csv") as st:
    reader = csv.DictReader(st)
    stations = list(reader)

    for station in stations:
        xmlrep = get_station_data(station["fmisid"])
        station["datasets"] = parse_station_data(xmlrep)


    with open("stationDatasets.json", "w", encoding="utf8") as o:
        json.dump(stations, o, indent=4, ensure_ascii=False)



