import json
import re

def get_interval(interval_string):
    results = re.findall('(?P<time>\d\d?)\sminute', interval_string)
    return int(results[0])

def remove_duplicates():
    pass

with open('stationDatasets.json', 'r') as datafile:
    dataset = json.load(datafile)
    result = []

    for d in dataset:
        weather_station = re.findall('Weather stations', d["groups"])
        if len(weather_station) > 0:
            sets = {}
            for s in d['datasets']:
                #take only daily and realtime datasets
                daily_or_realtime_set = re.findall('vuorokausiarvot|Säähavainnot', s["title"])
                if len(daily_or_realtime_set) > 0:
                    sets[s['title']] = {
                        'begin': s['begin'],
                        'end': s['end'],
                        'interval': get_interval(s['interval'])
                    }

            #if no datasets, do not include in results
            if len(sets) > 0:
                result.append({
                    'name_fi': d['name_fi'].strip(),
                    'name_en': d['name_en'].strip(),
                    'fmisid': d['fmisid'],
                    'wmo': d['wmo'],
                    'lon': d['lon'],
                    'lat': d['lat'],
                    'datasets': sets
                })

    with open("stations_metadata.json", "w", encoding="utf8") as o:
        json.dump(result, o, indent=4,  ensure_ascii=False)