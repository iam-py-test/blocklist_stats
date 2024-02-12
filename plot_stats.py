import numpy as np 
import matplotlib.pyplot as plt
import matplotlib.colors as allowedcolors
import json
import os
import requests
import threading
import hashlib
import datetime

filterlists = json.loads(open('filterlists.json').read())

current_date = datetime.datetime.now().strftime("%d/%m/%Y")

def dict_as_arr(dic):
    """
    Return the items in a dict as a list (called an array here, don't sue me)
    I am sure there is a better way
    """
    arr = []
    for item in dic:
        arr.append(dic[item])
    return arr

try:
    os.mkdir("stats")
except:
    pass

try:
    os.mkdir("size_stats")
except:
    pass

try:
    stats = json.loads(open('stats.json', 'r', encoding='utf-8').read())
except:
    stats = {}

try:
    change_stats = json.loads(open("change_stats.json", 'r').read())
except:
    change_stats = {
    }

try:
    size_stats = json.loads(open("size_stats.json", 'r').read())
except:
    size_stats = {
    }

running_threads = 0

def count_filters(filter, trust_line_count=False, exclude_from_line_count=0):
    global stats
    global running_threads
    global change_stats
    global size_stats
    running_threads += 1
    try:
        freq = requests.get(filterlists[filter])
        fhash = hashlib.md5(freq.content).hexdigest()
        fcontents = freq.text.replace("\r\n", "\n").split("\n")
        if filter not in stats:
            stats[filter] = {}
        if filter not in change_stats:
            change_stats[filter] = {}
        if filter not in size_stats:
            size_stats[filter] = {}
        change_stats[filter][current_date] = fhash
        size_stats[filter][current_date] = len(freq.content)
        numfilters = 0
        done = []
        if trust_line_count:
            numfilters = len(fcontents) - exclude_from_line_count
        else:
            for l in fcontents:
                if l == "" or l.startswith("#") or l.startswith("!") or l in done:
                    continue
                done.append(l)
                numfilters += 1
        stats[filter][current_date] = numfilters
    except Exception as err:
        print(err)
    running_threads -= 1

trust_lines = {
    "1Hosts Mini": 18,
    "HaGeZi's Light DNS Blocklist": 11,
    "Peter Lowe's Ad and tracking server list": 14,
}

for filter in filterlists:
    if filter not in trust_lines:
        trust_lines[filter] = 0
    threading.Thread(target=count_filters, args=(filter, trust_lines[filter] != 0, trust_lines[filter])).start()

while running_threads > 0:
    pass

for filter in stats:
    filter_items = dict_as_arr(stats[filter])
    x = np.arange(1,len(filter_items) + 1)
    y = np.array(filter_items)

    filtername = filter.replace(" ","_").replace("'","").replace("+","_")
    plt.title(f"Number of unique filters in {filter}")
    plt.xlabel("Time")
    plt.ylabel("Filters")
    plt.plot(x, y, color ="green")
    plt.savefig(f"stats/{filtername}.png")
    plt.clf()

for filter in size_stats:
    filter_items = dict_as_arr(size_stats[filter])
    x = np.arange(1,len(filter_items) + 1)
    y = np.array(filter_items)

    filtername = filter.replace(" ","_").replace("'","").replace("+","_")
    plt.title(f"Size (in bytes) of {filter}")
    plt.xlabel("Time")
    plt.ylabel("Size")
    plt.plot(x, y, color ="green")
    plt.savefig(f"size_stats/{filtername}.png")
    plt.clf()

try:
    outstats = open("stats.json", 'w')
    outstats.write(json.dumps(stats))
    outstats.close()
except Exception as err:
    print(err)

try:
    outstats = open("change_stats.json", 'w')
    outstats.write(json.dumps(change_stats))
    outstats.close()
except Exception as err:
    print(err)

try:
    outstats = open("size_stats.json", 'w')
    outstats.write(json.dumps(size_stats))
    outstats.close()
except Exception as err:
    print(err)

