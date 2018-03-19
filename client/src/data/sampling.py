import json
from sklearn.neighbors.kde import KernelDensity
from math import exp, pow, sqrt
import numpy as np
import random

RADIUS = 0.3
ZOOM = 1

classes = {}
input_sample = {}
player_list = ['harden', 'curry']
for player in player_list:
    with open( player + '_shot_all.json', 'r') as f:
        data = []
        data = json.load(f)
        classes[player] = data

kde_dict = {}
f_avg = 0
C = 0
origin = []
for (k, v) in classes.items():
    print(k)
    origin.append(len(v))
    X = []
    for o in v:
        X.append([o['x'], o['y']])
    input_sample[C] = X

    X = np.array(X)
    kde = KernelDensity(kernel='gaussian', bandwidth=0.2).fit(X)
    kde_dict[C] = kde
    s = kde.score(X)
    print(s/len(v))
    f_avg += s/len(v)
    C += 1

print("f_avg = " + str(f_avg/C))
N = C
print("N = " + str(N))
w = (RADIUS/ZOOM) * exp(f_avg)

def selectTrial(input_sample):
    c = random.randrange(N)
    cla = input_sample[c]
    while len(cla) == 0:
        c = random.randrange(N)
        cla = input_sample[c]

    idx = random.randrange(len(cla))
    return c,cla[idx]

def buildRMatrix(x, z, kde):
    R = [[0 for _ in range(N)] for _ in range(N)]
    f = exp(kde.score_samples(np.array([x]))[0])
    ri = w/f
    s = 0
    for x in range(N):
        s += 1 / pow(ri, N)
    r_off = 1 / pow(s, 1/ N)
    for i in range(N):
        for j in range(N):
            if i == j:
                R[i][j] = ri
            else:
                R[i][j] = r_off
    return R

def conflictCheck(Rx, output_sample):
    for a in range(N):
        for b in range(N):
            l1 = output_sample[a]
            l2 = output_sample[b]
            rij = Rx[a][b]
            if len(l1) == 0 or len(l2) == 0:
                return True
            for di in l1:
                for dj in l2:
                    dis = sqrt(pow(di[0] - dj[0], 2) + pow(di[1] - dj[1], 2))
                    if dis <= rij and a != b :
                        #print('({},{}) to ({},{})'.format(di[0],di[1],dj[0],dj[1]))
                        #print('dis= {}, r({},{})= {}'.format(dis, a,b,rij))
                        return False
    return True

P = {}
temP = {}
for i in range(N):
    P[i] = []
    temP[i] = []

# Main algorithm
z = 1
flag = True
while flag and z <= ZOOM:
    while flag:
        c, x = selectTrial(input_sample)
        Rx = buildRMatrix(x, z, kde_dict[c])
        check = conflictCheck(Rx, P)
        #print('sample = ({}, {})'.format(x[0], x[1]))
        if check:
            P[c].append(x)
            input_sample[c].remove(x)
        else:
            temP[c].append(x)
            input_sample[c].remove(x)
        test = False
        for x in range(N):
            if len(input_sample[x]) > 0:
                test = True
        flag = test
    # no zoom

j = []
for (k, v) in P.items():
    print(k)
    print(v)
    print('origin = {}, new = {}'.format(origin[k], len(v)))
    for point in v:
        d = {}
        d['x'] = point[0]
        d['y'] = point[1]
        d['class'] = k
        j.append(d)

with open('filter.json', 'w') as json_f:
    json.dump(j, json_f)

