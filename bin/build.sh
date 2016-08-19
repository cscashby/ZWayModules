#!/bin/bash

rm *.tar.gz
pushd ../JSONDevice/
tar cvzf ../bin/JSONDevice.tar.gz *
popd
pushd ../Tado/
tar cvzf ../bin/Tado.tar.gz *
popd
