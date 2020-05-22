import json
import time

aggregationValues=[[1,0],[10,10],[30,3],[60,2]]
historyMaxValues=100

def run(duration,sensordata):
    #print('Running aggregate for {} ...'.format(duration))
    #look in aggregationValues array
    durationIndexFound=-1
    counter=0
    for d in aggregationValues:
        if d[0]==duration:
            durationIndexFound=counter
            break
        counter=counter+1
    if durationIndexFound == -1:
        print('Could not find duration with value {}'.format(duration))
        return
    #1 loads json matching duration
    sensorhistory= None
    with open('json/sensors_{}.json'.format(duration)) as json_file:
        sensorhistory = json.load(json_file)
        if len(sensorhistory)>=historyMaxValues:
            sensorhistory = sensorhistory[-historyMaxValues:]
        #2 remove first element if we are at the capacity limit
        #print('{} records in sensors_{}.json'.format(len(sensorhistory),duration))
    #calculate new value from previous dataset (if not 1 minute aggregation)
    if aggregationValues[durationIndexFound][1] != 0:
        with open('json/sensors_{}.json'.format(aggregationValues[durationIndexFound-1][0])) as json_from:
            #take last n elements to calculate aggregation
            sensorhistory = json.load(json_from)[-aggregationValues[durationIndexFound][1]:]
            #TODO : actual aggregation : avg, min, max, ...
            #For now, just take the last one
            sensordata = sensorhistory[-1:]
    #3 add new element
    sensorhistory.append(sensordata)
    #4 save to disk
    with open('json/sensors_{}.json'.format(duration),'w') as outfile:
        json.dump(sensorhistory, outfile)
    return
