#!/usr/bin/env bash
apt-get update
apt-get install -y python3 -y python3-dev -y python3-setuptools -y build-essential
update-alternatives --install /usr/bin/python python /usr/bin/python3.6 3
apt-get install -y curl
curl 'https://bootstrap.pypa.io/get-pip.py' > pip.py
python pip.py
rm pip.py
apt-get install -y nginx
rm /etc/nginx/sites-enabled/default
apt-get install -y supervisor
apt-get install -y libldap2-dev -y libssl-dev -y libsasl2-dev -y python3-gdal -y libpq-dev
curl -sL https://deb.nodesource.com/setup_12.x | bash -
apt-get install -y nodejs
export TERM=xterm








