import json
import time
import gc

aggregationValues=[[1,0],[10,10],[30,3],[60,2]]
historyMaxValues=50

def run(duration,sensordata):
    print('Running aggregate for {} ...'.format(duration))
    #look in aggregationValues array
    durationIndexFound=-1
    counter=0
    for d in aggregationValues:
        if d[0]==duration:
            durationIndexFound=counter
            break
        counter=counter+1
    if durationIndexFound == -1:
        #print('Could not find duration with value {}'.format(duration))
        return
    #1 loads json matching duration
    sensorhistory= None
    with open('www/json/sensors_{}.json'.format(duration)) as json_file:
        sensorhistory = json.load(json_file)
        #2 take the last n values
        if len(sensorhistory)>=historyMaxValues:
            sensorhistory = sensorhistory[-historyMaxValues:]
        #print('{} records in sensors_{}.json'.format(len(sensorhistory),duration))
    #calculate new value from previous dataset (if not 1 minute aggregation)
    if aggregationValues[durationIndexFound][1] != 0:
        with open('www/json/sensors_{}.json'.format(aggregationValues[durationIndexFound-1][0])) as json_from:
            #take last n elements to calculate aggregation
            agghistory = json.load(json_from)[-aggregationValues[durationIndexFound][1]:]
            for key in agghistory[0]['metrics']:
                #actual aggregation : avg, min, max, ...
                sensordata['metrics'][key]=round(sum(i['metrics'][key] for i in agghistory)/len(agghistory),2)
    #3 add new element
    sensorhistory.append(sensordata)
    #4 save to flash
    with open('www/json/sensors_{}.json'.format(duration),'w') as outfile:
        json.dump(sensorhistory, outfile)
    return
    gc.collect()  
