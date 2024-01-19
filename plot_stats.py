import numpy as np 
import matplotlib.pyplot as plt
import matplotlib.colors as allowedcolors
import json
import os
import requests

filterlists = json.loads(open('filterlists.json').read())

try:
    os.mkdir("stats")
except:
    pass

try:
    stats = json.loads(open('stats.json', 'r', encoding='utf-8').read())
except:
    stats = {}

for filter in filterlists:
    try:
        fcontents = requests.get(filterlists[filter]).text.replace("\r\n", "\n").split("\n")
        if filter not in stats:
            stats[filter] = []
        numfilters = 0
        done = []
        for l in fcontents:
            if l == "" or l.startswith("#") or l.startswith("!") or l in done:
                continue
            done.append(l)
            numfilters += 1
        stats[filter].append(numfilters)
    except Exception as err:
        print(err)

for filter in stats:
    x = np.arange(1,len(stats[filter]) + 1)
    y = np.array(stats[filter])

    filtername = filter.replace(" ","_").replace("'","")
    plt.title(f"Number of unique filters in {filter}")
    plt.xlabel("Time")
    plt.ylabel("Filters")
    plt.plot(x, y, color ="green")
    plt.savefig(f"stats/{filtername}.png")
    plt.clf()

try:
    outstats = open("stats.json", 'w')
    outstats.write(json.dumps(stats))
    outstats.close()
except Exception as err:
    print(err)

