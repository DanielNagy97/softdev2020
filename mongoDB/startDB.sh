#!/bin/bash
sudo service mongodb stop
mongod --directoryperdb --dbpath ./mongo/data/db --logpath ./mongo/log/mongo.log --logappend

